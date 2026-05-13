/**
 * Self-hosted text CAPTCHA — no third-party dependency, no cost,
 * no image puzzles, cannot be blocked by ad-blockers.
 *
 * Flow:
 *   GET  /api/captcha          → { svg, token, expires_in }
 *   POST <your form>           → { ..., captcha_token, captcha_answer }
 *   server: verifyTextCaptcha(token, answer)
 *
 * Security:
 *   - Token is a JWT signed with HMAC-SHA256 (5-min TTL).
 *   - Token carries the SHA-256 hash of the (uppercased, trimmed) answer
 *     keyed with the captcha secret — the answer itself is never on-the-wire
 *     in the token.
 *   - Single-use: once verified, the nonce is parked in an in-process LRU
 *     until token expiry, so the same token cannot be replayed.
 *   - Visual: the SVG uses a confusion-resistant alphabet (no I/O/0/1) and
 *     adds noise lines + dots + per-glyph rotation.
 *
 * Note on multi-instance deployments: the in-process nonce store gives
 * single-use per server. For horizontally-scaled deployments, swap the
 * `usedNonces` Map for a Redis SETNX with TTL.
 */

import crypto from 'crypto';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const SECRET =
  process.env.CAPTCHA_SECRET ||
  process.env.JWT_SECRET ||
  'change-me-in-production';

const CODE_LENGTH = 5;
const CODE_TTL_SECONDS = 300;

/** Visually unambiguous alphabet — drops I, O, 0, 1, L, U, V. */
const ALPHABET = 'ABCDEFGHJKMNPQRSTWXYZ23456789';

const usedNonces = new Map<string, number>();
const MAX_NONCE_CACHE = 10_000;

function pruneNonces(now = Date.now()) {
  if (usedNonces.size < MAX_NONCE_CACHE / 2) return;
  for (const [k, exp] of usedNonces) {
    if (exp <= now) usedNonces.delete(k);
  }
  if (usedNonces.size > MAX_NONCE_CACHE) {
    const trimTo = Math.floor(MAX_NONCE_CACHE * 0.8);
    const it = usedNonces.keys();
    while (usedNonces.size > trimTo) {
      const k = it.next().value;
      if (k === undefined) break;
      usedNonces.delete(k);
    }
  }
}

function randomCode(len = CODE_LENGTH): string {
  const buf = crypto.randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) {
    out += ALPHABET[buf[i] % ALPHABET.length];
  }
  return out;
}

function hashAnswer(answer: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(answer.trim().toUpperCase())
    .digest('hex');
}

/** Tiny seeded PRNG so the SVG is "random-looking" but cheap. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function renderSvg(code: string): string {
  const w = 200;
  const h = 64;
  const seed = crypto.randomBytes(4).readUInt32LE(0);
  const rand = rng(seed);

  const lines: string[] = [];
  for (let i = 0; i < 6; i++) {
    const x1 = (rand() * w).toFixed(1);
    const y1 = (rand() * h).toFixed(1);
    const x2 = (rand() * w).toFixed(1);
    const y2 = (rand() * h).toFixed(1);
    const opacity = (0.2 + rand() * 0.35).toFixed(2);
    lines.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7280" stroke-width="1" opacity="${opacity}"/>`
    );
  }

  const dots: string[] = [];
  for (let i = 0; i < 90; i++) {
    const cx = (rand() * w).toFixed(1);
    const cy = (rand() * h).toFixed(1);
    const r = (0.4 + rand() * 1.1).toFixed(2);
    const opacity = (0.25 + rand() * 0.4).toFixed(2);
    dots.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#9ca3af" opacity="${opacity}"/>`
    );
  }

  const wave: string[] = [];
  let path = `M 0 ${(h / 2).toFixed(1)}`;
  for (let x = 10; x <= w; x += 10) {
    const y = h / 2 + Math.sin((x + seed) / 8) * 4 + (rand() - 0.5) * 4;
    path += ` L ${x} ${y.toFixed(1)}`;
  }
  wave.push(
    `<path d="${path}" stroke="#374151" stroke-width="1" fill="none" opacity="0.35"/>`
  );

  const charW = w / (code.length + 1);
  const chars: string[] = [];
  const palette = ['#1f2937', '#374151', '#4b5563', '#111827'];
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const x = charW * (i + 1);
    const y = h / 2 + 9;
    const rotation = ((rand() - 0.5) * 36).toFixed(1);
    const fontSize = (28 + rand() * 6).toFixed(0);
    const color = palette[Math.floor(rand() * palette.length)];
    chars.push(
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Verdana,Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="${color}" text-anchor="middle" transform="rotate(${rotation} ${x.toFixed(1)} ${y.toFixed(1)})">${ch}</text>`
    );
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Captcha image" preserveAspectRatio="xMidYMid meet">`,
    `<rect width="${w}" height="${h}" fill="#f9fafb"/>`,
    lines.join(''),
    wave.join(''),
    chars.join(''),
    dots.join(''),
    `</svg>`,
  ].join('');
}

export type GeneratedCaptcha = {
  /** Signed token. The client must echo this back unchanged. */
  token: string;
  /** Inline SVG markup (no external requests). */
  svg: string;
  /** Seconds until the token expires. */
  expires_in: number;
};

export function generateTextCaptcha(): GeneratedCaptcha {
  const code = randomCode();
  const nonce = crypto.randomBytes(12).toString('base64url');
  const token = jwt.sign(
    { a: hashAnswer(code), n: nonce, t: 'captcha' },
    SECRET,
    { expiresIn: CODE_TTL_SECONDS }
  );
  return { token, svg: renderSvg(code), expires_in: CODE_TTL_SECONDS };
}

export type CaptchaVerifyResult = {
  success: boolean;
  message?: string;
};

export function verifyTextCaptcha(
  token: string | null | undefined,
  answer: string | null | undefined
): CaptchaVerifyResult {
  if (!token || typeof token !== 'string' || !token.trim()) {
    return {
      success: false,
      message: 'Please complete the security check before submitting.',
    };
  }
  if (!answer || typeof answer !== 'string' || !answer.trim()) {
    return {
      success: false,
      message: 'Please enter the characters shown in the image.',
    };
  }

  let decoded: JwtPayload;
  try {
    const verified = jwt.verify(token.trim(), SECRET);
    if (typeof verified === 'string' || !verified) {
      return {
        success: false,
        message: 'Captcha is invalid. Please refresh and try again.',
      };
    }
    decoded = verified;
  } catch (err) {
    const name = (err as { name?: string })?.name;
    if (name === 'TokenExpiredError') {
      return {
        success: false,
        message: 'Captcha expired. Please refresh and try again.',
      };
    }
    return {
      success: false,
      message: 'Captcha is invalid. Please refresh and try again.',
    };
  }

  if (decoded.t !== 'captcha' || typeof decoded.a !== 'string') {
    return {
      success: false,
      message: 'Captcha is invalid. Please refresh and try again.',
    };
  }

  const nonce = typeof decoded.n === 'string' ? decoded.n : '';
  const now = Date.now();
  pruneNonces(now);
  if (!nonce || usedNonces.has(nonce)) {
    return {
      success: false,
      message: 'Captcha already used. Please refresh and try again.',
    };
  }

  const expected = decoded.a;
  const provided = hashAnswer(answer);
  if (
    expected.length !== provided.length ||
    !crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(provided, 'hex')
    )
  ) {
    return {
      success: false,
      message: 'Incorrect captcha. Please try again.',
    };
  }

  const expMs = (decoded.exp ?? Math.floor(now / 1000) + CODE_TTL_SECONDS) * 1000;
  usedNonces.set(nonce, expMs);

  return { success: true };
}
