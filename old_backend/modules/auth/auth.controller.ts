import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "./auth.validation";
import { loginService } from "./auth.service";
import { formatApiError } from "@/backend/utils/api-error";

export const loginController = async (
  req: NextRequest
) => {
  try {
    const body = await req.json();

    const validatedData = loginSchema.parse(body);

    const result = await loginService(validatedData);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token: result.token, // add token in response
      user: {
        id: result.user.id,
        school_code: result.user.school_code,
        role: result.user.role,
        role_id: result.user.role_id,
        full_name: result.user.full_name,
        email: result.user.email,
        phone: result.user.phone,
        is_active: result.user.is_active,
      },
    });

    const isProduction = process.env.NODE_ENV === 'production';

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 401 }
    );
  }
};