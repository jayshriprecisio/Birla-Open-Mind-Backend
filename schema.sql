-- Database schema (PostgreSQL). Edit this file when the schema changes.
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET search_path = public;

--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-14 16:25:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17909)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5776 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--



--
-- TOC entry 308 (class 1255 OID 17497)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 299 (class 1259 OID 17667)
-- Name: academic_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_master (
    id bigint NOT NULL,
    academic_name character varying(180) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT academic_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 252 (class 1259 OID 17078)
-- Name: academic_subject_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_subject_master (
    id bigint NOT NULL DEFAULT nextval('public.academic_subject_master_id_seq'::regclass),
    name character varying(150) NOT NULL,
    short_form character varying(20),
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT academic_subject_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 251 (class 1259 OID 17077)
-- Name: academic_subject_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.academic_subject_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.academic_subject_master.id;



--
-- TOC entry 268 (class 1259 OID 17198)
-- Name: academic_year_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_year_master (
    id bigint NOT NULL DEFAULT nextval('public.academic_year_master_id_seq'::regclass),
    name character varying(50) NOT NULL,
    short_form character varying(20),
    short_form_2_digit character varying(10),
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT academic_year_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 267 (class 1259 OID 17197)
-- Name: academic_year_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.academic_year_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.academic_year_master.id;



--
-- TOC entry 292 (class 1259 OID 17459)
-- Name: admission_inquiry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admission_inquiry (
    id bigint NOT NULL DEFAULT nextval('public.admission_inquiry_id_seq'::regclass),
    school_id uuid NOT NULL,
    grade_id bigint NOT NULL,
    parent_first_name character varying(100) NOT NULL,
    parent_last_name character varying(100),
    email character varying(150) NOT NULL,
    phone_number character varying(20) NOT NULL,
    comment text,
    captcha_token text,
    status character varying(20) DEFAULT 'NEW'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by bigint,
    deleted_at timestamp without time zone,
    deleted_by bigint,
    CONSTRAINT chk_inquiry_email CHECK (((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT chk_inquiry_status CHECK (((status)::text = ANY ((ARRAY['NEW'::character varying, 'IN_PROGRESS'::character varying, 'RESOLVED'::character varying, 'CLOSED'::character varying])::text[])))
);



--
-- TOC entry 291 (class 1259 OID 17458)
-- Name: admission_inquiry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admission_inquiry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.admission_inquiry.id;



--
-- TOC entry 237 (class 1259 OID 16753)
-- Name: batch_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.batch_master (
    id integer NOT NULL DEFAULT nextval('public.batch_master_id_seq'::regclass),
    batch_name character varying(100) NOT NULL,
    short_form character varying(20) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 236 (class 1259 OID 16752)
-- Name: batch_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.batch_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.batch_master.id;



--
-- TOC entry 223 (class 1259 OID 16620)
-- Name: board_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.board_master (
    id bigint NOT NULL DEFAULT nextval('public.board_master_id_seq'::regclass),
    board_code character varying(30) NOT NULL,
    board_name character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    created_by bigint,
    updated_by bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_deleted boolean DEFAULT false
);



--
-- TOC entry 222 (class 1259 OID 16619)
-- Name: board_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.board_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.board_master.id;



--
-- TOC entry 245 (class 1259 OID 16810)
-- Name: brand_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand_master (
    id bigint NOT NULL DEFAULT nextval('public.brand_master_id_seq'::regclass),
    name character varying(150) NOT NULL,
    brand_code character varying(50) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_deleted boolean DEFAULT false,
    CONSTRAINT brand_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 244 (class 1259 OID 16809)
-- Name: brand_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brand_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.brand_master.id;



--
-- TOC entry 300 (class 1259 OID 17685)
-- Name: calculation_basis_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calculation_basis_master (
    id bigint NOT NULL,
    calculation_basis_name character varying(180) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT calculation_basis_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 290 (class 1259 OID 17366)
-- Name: cheque_favour_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cheque_favour_master (
    id bigint NOT NULL DEFAULT nextval('public.cheque_favour_master_id_seq'::regclass),
    cheque_in_favour_of character varying(150) NOT NULL,
    fees_type character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 289 (class 1259 OID 17365)
-- Name: cheque_favour_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cheque_favour_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.cheque_favour_master.id;



--
-- TOC entry 225 (class 1259 OID 16635)
-- Name: course_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_master (
    id bigint NOT NULL DEFAULT nextval('public.course_master_id_seq'::regclass),
    course_code character varying(50) NOT NULL,
    course_name character varying(150) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 224 (class 1259 OID 16634)
-- Name: course_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.course_master.id;



--
-- TOC entry 235 (class 1259 OID 16740)
-- Name: division_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.division_master (
    id integer NOT NULL DEFAULT nextval('public.division_master_id_seq'::regclass),
    division_name character varying(100) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 234 (class 1259 OID 16739)
-- Name: division_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.division_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.division_master.id;



--
-- TOC entry 282 (class 1259 OID 17297)
-- Name: easebuzz_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.easebuzz_mapping (
    id bigint NOT NULL DEFAULT nextval('public.easebuzz_mapping_id_seq'::regclass),
    school_name character varying(150) NOT NULL,
    merchant_key character varying(150) NOT NULL,
    merchant_salt character varying(150) NOT NULL,
    environment character varying(20) DEFAULT 'TEST'::character varying,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 281 (class 1259 OID 17296)
-- Name: easebuzz_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.easebuzz_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.easebuzz_mapping.id;



--
-- TOC entry 301 (class 1259 OID 17703)
-- Name: fees_category_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fees_category_master (
    id bigint NOT NULL,
    fees_category_name character varying(160) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fees_category_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 302 (class 1259 OID 17721)
-- Name: fees_sub_type_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fees_sub_type_master (
    id bigint NOT NULL,
    fees_sub_type_name character varying(140) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fees_sub_type_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 303 (class 1259 OID 17739)
-- Name: fees_type_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fees_type_master (
    id bigint NOT NULL,
    fees_type_name character varying(120) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fees_type_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 270 (class 1259 OID 17212)
-- Name: gender_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gender_master (
    id bigint NOT NULL DEFAULT nextval('public.gender_master_id_seq'::regclass),
    name character varying(50) NOT NULL,
    short_form character varying(10),
    display_order integer,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT gender_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 269 (class 1259 OID 17211)
-- Name: gender_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gender_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.gender_master.id;



--
-- TOC entry 272 (class 1259 OID 17226)
-- Name: grade_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grade_master (
    id bigint NOT NULL DEFAULT nextval('public.grade_master_id_seq'::regclass),
    name character varying(100) NOT NULL,
    short_form character varying(20),
    display_order integer,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT grade_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 271 (class 1259 OID 17225)
-- Name: grade_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grade_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.grade_master.id;



--
-- TOC entry 286 (class 1259 OID 17333)
-- Name: grayquest_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grayquest_mapping (
    id bigint NOT NULL DEFAULT nextval('public.grayquest_mapping_id_seq'::regclass),
    school_name character varying(150) NOT NULL,
    institute_id character varying(100) NOT NULL,
    api_key character varying(200) NOT NULL,
    environment character varying(20) DEFAULT 'TEST'::character varying,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 285 (class 1259 OID 17332)
-- Name: grayquest_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grayquest_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.grayquest_mapping.id;



--
-- TOC entry 241 (class 1259 OID 16782)
-- Name: house_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.house_master (
    id integer NOT NULL DEFAULT nextval('public.house_master_id_seq'::regclass),
    house_name character varying(100) NOT NULL,
    short_form character varying(20) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 240 (class 1259 OID 16781)
-- Name: house_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.house_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.house_master.id;



--
-- TOC entry 304 (class 1259 OID 17757)
-- Name: mode_of_payment_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mode_of_payment_master (
    id bigint NOT NULL,
    mode_of_payment_name character varying(150) NOT NULL,
    name_on_receipt character varying(150) NOT NULL,
    visible_to_parent character varying(10) NOT NULL,
    visible_to_fee_counter character varying(10) NOT NULL,
    order_of_preference integer DEFAULT 1 NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT mode_of_payment_master_order_of_preference_check CHECK ((order_of_preference >= 1)),
    CONSTRAINT mode_of_payment_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 258 (class 1259 OID 17120)
-- Name: parameter_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parameter_master (
    id bigint NOT NULL DEFAULT nextval('public.parameter_master_id_seq'::regclass),
    parameter_name character varying(150) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT parameter_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 257 (class 1259 OID 17119)
-- Name: parameter_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parameter_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.parameter_master.id;



--
-- TOC entry 307 (class 1259 OID 17887)
-- Name: password_resets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_resets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id bigint NOT NULL,
    token character varying(255) NOT NULL,
    used boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);



--
-- TOC entry 278 (class 1259 OID 17267)
-- Name: payment_entity_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_entity_master (
    id bigint NOT NULL DEFAULT nextval('public.payment_entity_master_id_seq'::regclass),
    entity_name character varying(150) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 277 (class 1259 OID 17266)
-- Name: payment_entity_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_entity_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.payment_entity_master.id;



--
-- TOC entry 280 (class 1259 OID 17280)
-- Name: paytm_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paytm_mapping (
    id bigint NOT NULL DEFAULT nextval('public.paytm_mapping_id_seq'::regclass),
    school_name character varying(150) NOT NULL,
    mid character varying(100) NOT NULL,
    tid character varying(100) NOT NULL,
    edc_type character varying(50),
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 279 (class 1259 OID 17279)
-- Name: paytm_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paytm_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.paytm_mapping.id;



--
-- TOC entry 288 (class 1259 OID 17351)
-- Name: pdc_status_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pdc_status_master (
    id bigint NOT NULL DEFAULT nextval('public.pdc_status_master_id_seq'::regclass),
    pdc_status character varying(50) NOT NULL,
    description text,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 287 (class 1259 OID 17350)
-- Name: pdc_status_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pdc_status_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.pdc_status_master.id;



--
-- TOC entry 305 (class 1259 OID 17781)
-- Name: period_of_service_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.period_of_service_master (
    id bigint NOT NULL,
    period_of_service_name character varying(180) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT period_of_service_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 262 (class 1259 OID 17148)
-- Name: pp_grade_domain_skill_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pp_grade_domain_skill_mapping (
    id bigint NOT NULL DEFAULT nextval('public.pp_grade_domain_skill_mapping_id_seq'::regclass),
    grade_name character varying(100) NOT NULL,
    domain_name character varying(100) NOT NULL,
    skill_name character varying(150) NOT NULL,
    parameter_id bigint,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT pp_grade_domain_skill_mapping_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 261 (class 1259 OID 17147)
-- Name: pp_grade_domain_skill_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pp_grade_domain_skill_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.pp_grade_domain_skill_mapping.id;



--
-- TOC entry 254 (class 1259 OID 17092)
-- Name: pre_primary_phase_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pre_primary_phase_master (
    id bigint NOT NULL DEFAULT nextval('public.pre_primary_phase_master_id_seq'::regclass),
    phase_name character varying(150) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT pre_primary_phase_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 253 (class 1259 OID 17091)
-- Name: pre_primary_phase_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pre_primary_phase_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.pre_primary_phase_master.id;



--
-- TOC entry 256 (class 1259 OID 17106)
-- Name: pre_primary_subject_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pre_primary_subject_master (
    id bigint NOT NULL DEFAULT nextval('public.pre_primary_subject_master_id_seq'::regclass),
    name character varying(150) NOT NULL,
    short_form character varying(20),
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT pre_primary_subject_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 255 (class 1259 OID 17105)
-- Name: pre_primary_subject_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pre_primary_subject_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.pre_primary_subject_master.id;



--
-- TOC entry 284 (class 1259 OID 17315)
-- Name: school_bank_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_bank_mapping (
    id bigint NOT NULL DEFAULT nextval('public.school_bank_mapping_id_seq'::regclass),
    school_name character varying(150) NOT NULL,
    bank_name character varying(150) NOT NULL,
    account_number character varying(50) NOT NULL,
    ifsc_code character varying(20) NOT NULL,
    account_type character varying(50),
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 283 (class 1259 OID 17314)
-- Name: school_bank_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_bank_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.school_bank_mapping.id;



--
-- TOC entry 249 (class 1259 OID 17023)
-- Name: school_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_contacts (
    contact_id uuid DEFAULT gen_random_uuid() NOT NULL,
    school_id uuid NOT NULL,
    contact_type character varying(20) NOT NULL,
    full_name character varying(150) NOT NULL,
    email_login_id character varying(150) NOT NULL,
    phone_number character varying(15) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT school_contacts_contact_type_check CHECK (((contact_type)::text = ANY ((ARRAY['centre_head'::character varying, 'principal'::character varying])::text[])))
);



--
-- TOC entry 293 (class 1259 OID 17499)
-- Name: school_enquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_enquiries (
    enquiry_id uuid DEFAULT gen_random_uuid() NOT NULL,
    school_id uuid NOT NULL,
    branch_id bigint,
    enquiry_no character varying(50),
    enquiry_purpose_id bigint,
    enquiry_for_id bigint,
    academic_session_id bigint,
    board_id bigint,
    grade_id bigint,
    batch_id bigint,
    school_type_id bigint,
    source_id bigint,
    sub_source_id bigint,
    lead_stage_id bigint,
    contact_mode_id bigint,
    student_name character varying(255),
    dob date,
    gender_id bigint,
    aadhaar_no character varying(20),
    current_school character varying(255),
    current_board_id bigint,
    current_grade_id bigint,
    father_name character varying(255),
    father_mobile character varying(20),
    father_email character varying(255),
    mother_name character varying(255),
    mother_mobile character varying(20),
    mother_email character varying(255),
    guardian_name character varying(255),
    guardian_mobile character varying(20),
    preferred_contact_id bigint,
    address_line1 text,
    address_line2 text,
    address_line3 text,
    pincode character varying(10),
    country character varying(10),
    state character varying(50),
    city character varying(50),
    is_concession boolean DEFAULT false,
    concession_type_id bigint,
    is_referral boolean DEFAULT false,
    referral_name bigint,
    current_owner character varying(50),
    assigned_to bigint,
    interaction_mode_id bigint,
    interaction_status_id bigint,
    next_followup_date date,
    priority_tag character varying(20),
    status character varying(50) DEFAULT 'NEW'::character varying,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_deleted boolean DEFAULT false
);



--
-- TOC entry 298 (class 1259 OID 17656)
-- Name: school_enquiry_assignment_cursor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_enquiry_assignment_cursor (
    id smallint DEFAULT 1 NOT NULL,
    next_index integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);



--
-- TOC entry 295 (class 1259 OID 17534)
-- Name: school_enquiry_followups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_enquiry_followups (
    followup_id bigint NOT NULL,
    enquiry_id uuid,
    interaction_mode_id bigint,
    interaction_status_id bigint,
    followup_date date,
    followup_time time without time zone,
    next_followup_date date,
    next_followup_time time without time zone,
    remarks text,
    notes text,
    followup_with character varying(20),
    followup_by uuid,
    created_at timestamp without time zone DEFAULT now(),
    priority character varying(20),
    is_deleted boolean DEFAULT false,
    created_by uuid,
    updated_by uuid,
    updated_at timestamp without time zone
);



--
-- TOC entry 297 (class 1259 OID 17644)
-- Name: school_enquiry_followups_followup_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.school_enquiry_followups ALTER COLUMN followup_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.school_enquiry_followups_followup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 294 (class 1259 OID 17520)
-- Name: school_enquiry_siblings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_enquiry_siblings (
    sibling_id bigint NOT NULL,
    enquiry_id uuid,
    sibling_name character varying(255),
    enrollment_no character varying(255),
    dob date,
    school_name character varying(255),
    grade_id bigint,
    board_id bigint,
    created_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 296 (class 1259 OID 17643)
-- Name: school_enquiry_siblings_sibling_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.school_enquiry_siblings ALTER COLUMN sibling_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.school_enquiry_siblings_sibling_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 16673)
-- Name: school_hours_duration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_hours_duration (
    id bigint NOT NULL DEFAULT nextval('public.school_hours_duration_id_seq'::regclass),
    duration_code character varying(20) NOT NULL,
    duration_name character varying(50) NOT NULL,
    total_minutes integer NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 228 (class 1259 OID 16672)
-- Name: school_hours_duration_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_hours_duration_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.school_hours_duration.id;



--
-- TOC entry 250 (class 1259 OID 17049)
-- Name: school_partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_partners (
    partner_id uuid DEFAULT gen_random_uuid() NOT NULL,
    school_id uuid NOT NULL,
    partner_name character varying(150),
    partner_email character varying(255),
    partner_mobile character varying(15),
    sort_order smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);



--
-- TOC entry 227 (class 1259 OID 16653)
-- Name: school_timing_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_timing_master (
    id bigint NOT NULL DEFAULT nextval('public.school_timing_master_id_seq'::regclass),
    timing_code character varying(50) NOT NULL,
    shift_name character varying(100) NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 226 (class 1259 OID 16652)
-- Name: school_timing_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_timing_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.school_timing_master.id;



--
-- TOC entry 248 (class 1259 OID 16974)
-- Name: schools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools (
    school_id uuid DEFAULT gen_random_uuid() NOT NULL,
    zone_id character varying(20) NOT NULL,
    brand_id bigint NOT NULL,
    brand_code character varying(20),
    school_name character varying(255) NOT NULL,
    school_code character varying(30) NOT NULL,
    board character varying(30) NOT NULL,
    session_month character varying(30) NOT NULL,
    total_capacity integer,
    operational_capacity integer,
    address_line1 character varying(255) NOT NULL,
    address_line2 character varying(255) NOT NULL,
    address_line3 character varying(255),
    pin_code character(6) NOT NULL,
    country character(2) DEFAULT 'IN'::bpchar NOT NULL,
    state_province character varying(60) NOT NULL,
    city character varying(60) NOT NULL,
    phone_number character varying(15) NOT NULL,
    official_email character varying(60) NOT NULL,
    website_url character varying(512),
    billing_name character varying(255),
    billing_same_as_school boolean DEFAULT false NOT NULL,
    billing_address_line1 character varying(255),
    billing_address_line2 character varying(255),
    billing_address_line3 character varying(255),
    billing_pin_code character(6),
    billing_country character(2),
    billing_state_province character varying(60),
    billing_city character varying(60),
    affiliation_number character varying(30),
    cbse_school_code character varying(20),
    udise_code character varying(20),
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT schools_operational_capacity_check CHECK ((operational_capacity > 0)),
    CONSTRAINT schools_pin_code_check CHECK ((pin_code ~ '^[0-9]{6}$'::text)),
    CONSTRAINT schools_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying])::text[]))),
    CONSTRAINT schools_total_capacity_check CHECK ((total_capacity > 0))
);



--
-- TOC entry 306 (class 1259 OID 17799)
-- Name: service_provider_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_provider_master (
    id bigint NOT NULL,
    service_provider_name character varying(150) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT service_provider_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 247 (class 1259 OID 16827)
-- Name: session_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session_master (
    id bigint NOT NULL DEFAULT nextval('public.session_master_id_seq'::regclass),
    session_name character varying(150) CONSTRAINT session_master_name_not_null NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_by bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_deleted boolean DEFAULT false,
    CONSTRAINT session_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 246 (class 1259 OID 16826)
-- Name: session_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.session_master.id;



--
-- TOC entry 274 (class 1259 OID 17240)
-- Name: stream_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stream_master (
    id bigint NOT NULL DEFAULT nextval('public.stream_master_id_seq'::regclass),
    name character varying(100) NOT NULL,
    short_form character varying(20),
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT stream_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 273 (class 1259 OID 17239)
-- Name: stream_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stream_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.stream_master.id;



--
-- TOC entry 266 (class 1259 OID 17184)
-- Name: student_attendance_status_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_attendance_status_master (
    id bigint NOT NULL DEFAULT nextval('public.student_attendance_status_master_id_seq'::regclass),
    name character varying(100) NOT NULL,
    short_form character varying(20),
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT student_attendance_status_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 265 (class 1259 OID 17183)
-- Name: student_attendance_status_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_attendance_status_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.student_attendance_status_master.id;



--
-- TOC entry 264 (class 1259 OID 17170)
-- Name: subject_group_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subject_group_master (
    id bigint NOT NULL DEFAULT nextval('public.subject_group_master_id_seq'::regclass),
    subject_group_name character varying(150) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT subject_group_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 263 (class 1259 OID 17169)
-- Name: subject_group_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subject_group_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.subject_group_master.id;



--
-- TOC entry 260 (class 1259 OID 17134)
-- Name: subject_type_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subject_type_master (
    id bigint NOT NULL DEFAULT nextval('public.subject_type_master_id_seq'::regclass),
    name character varying(150) NOT NULL,
    short_form character varying(20),
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT subject_type_master_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);



--
-- TOC entry 259 (class 1259 OID 17133)
-- Name: subject_type_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subject_type_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.subject_type_master.id;



--
-- TOC entry 239 (class 1259 OID 16768)
-- Name: term_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.term_master (
    id integer NOT NULL DEFAULT nextval('public.term_master_id_seq'::regclass),
    term_name character varying(100) NOT NULL,
    short_form character varying(20) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 238 (class 1259 OID 16767)
-- Name: term_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.term_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.term_master.id;



--
-- TOC entry 276 (class 1259 OID 17254)
-- Name: transaction_type_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_type_master (
    id bigint NOT NULL DEFAULT nextval('public.transaction_type_master_id_seq'::regclass),
    transaction_type character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 275 (class 1259 OID 17253)
-- Name: transaction_type_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_type_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.transaction_type_master.id;



--
-- TOC entry 221 (class 1259 OID 16599)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL DEFAULT nextval('public.users_id_seq'::regclass),
    school_code character varying(50) NOT NULL,
    role bigint NOT NULL,
    full_name character varying(150),
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    phone character varying(20),
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 220 (class 1259 OID 16598)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.users.id;



--
-- TOC entry 231 (class 1259 OID 16690)
-- Name: winter_duration_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.winter_duration_master (
    id bigint NOT NULL DEFAULT nextval('public.winter_duration_master_id_seq'::regclass),
    winter_code character varying(20) NOT NULL,
    winter_duration_days integer NOT NULL,
    winter_start_date date NOT NULL,
    winter_end_date date NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 230 (class 1259 OID 16689)
-- Name: winter_duration_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.winter_duration_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.winter_duration_master.id;



--
-- TOC entry 233 (class 1259 OID 16727)
-- Name: winter_timing_gap_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.winter_timing_gap_master (
    id integer NOT NULL DEFAULT nextval('public.winter_timing_gap_master_id_seq'::regclass),
    winter_timing_gap interval NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by bigint
);



--
-- TOC entry 232 (class 1259 OID 16726)
-- Name: winter_timing_gap_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.winter_timing_gap_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.winter_timing_gap_master.id;



--
-- TOC entry 243 (class 1259 OID 16796)
-- Name: zone_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zone_master (
    id integer NOT NULL DEFAULT nextval('public.zone_master_id_seq'::regclass),
    zone_name character varying(100) NOT NULL,
    short_form character varying(20) NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    is_deleted boolean DEFAULT false,
    created_by bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- TOC entry 242 (class 1259 OID 16795)
-- Name: zone_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zone_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY public.zone_master.id;



--
-- TOC entry 5762 (class 0 OID 17667)
-- Dependencies: 299
-- Data for Name: academic_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5715 (class 0 OID 17078)
-- Dependencies: 252
-- Data for Name: academic_subject_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.academic_subject_master (id, name, short_form, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Computer', 'CO', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5731 (class 0 OID 17198)
-- Dependencies: 268
-- Data for Name: academic_year_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.academic_year_master (id, name, short_form, short_form_2_digit, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', '2024 - 25', '24-25', '25', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.academic_year_master (id, name, short_form, short_form_2_digit, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', '2025 - 26', '25-26', '26', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5755 (class 0 OID 17459)
-- Dependencies: 292
-- Data for Name: admission_inquiry; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.admission_inquiry (id, school_id, grade_id, parent_first_name, parent_last_name, email, phone_number, comment, captcha_token, status, is_deleted, created_at, updated_at, created_by, deleted_at, deleted_by) VALUES ('4', 'fb031039-975c-4f43-a38a-a5a0822b5b87', '2', 'Neha', 'Joshi', 'joshi@gmail.com', '8888888889', 'Looking for LKG admission', 'wefgergrgrtg', 'NEW', FALSE, now(), now(), NULL, NULL, NULL);
INSERT INTO public.admission_inquiry (id, school_id, grade_id, parent_first_name, parent_last_name, email, phone_number, comment, captcha_token, status, is_deleted, created_at, updated_at, created_by, deleted_at, deleted_by) VALUES ('6', '8c75b15d-a1b4-427b-a0ce-909fd437c1e4', '1', 'jayshri', 'pawar', 'jayshripawar05@gmail.com', '3453456453', 'test\\n[Relation: Mother | School: Jsw | Grade: LY 1]', NULL, 'NEW', FALSE, now(), now(), NULL, NULL, NULL);
INSERT INTO public.admission_inquiry (id, school_id, grade_id, parent_first_name, parent_last_name, email, phone_number, comment, captcha_token, status, is_deleted, created_at, updated_at, created_by, deleted_at, deleted_by) VALUES ('3', '8c75b15d-a1b4-427b-a0ce-909fd437c1e4', '1', 'Sunil', 'Verma', 'varma@gmail.com', '8888888888', 'Interested in admission for Grade 1', 'wefgergrgrtg', 'NEW', TRUE, now(), now(), NULL, '2026-05-12 11:45:59.758332', '1');


--
-- TOC entry 5700 (class 0 OID 16753)
-- Dependencies: 237
-- Data for Name: batch_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.batch_master (id, batch_name, short_form, status, is_deleted, created_by, created_at, updated_at) VALUES ('3', 'Batch 3', 'B03', 'ACTIVE', FALSE, '1', now(), now());
INSERT INTO public.batch_master (id, batch_name, short_form, status, is_deleted, created_by, created_at, updated_at) VALUES ('2', 'Batch 2', 'B02', 'ACTIVE', TRUE, '1', now(), now());
INSERT INTO public.batch_master (id, batch_name, short_form, status, is_deleted, created_by, created_at, updated_at) VALUES ('1', 'Batch 01', 'B01', 'ACTIVE', FALSE, '1', now(), now());


--
-- TOC entry 5686 (class 0 OID 16620)
-- Dependencies: 223
-- Data for Name: board_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.board_master (id, board_code, board_name, status, created_by, updated_by, created_at, updated_at, is_deleted) VALUES ('2', 'BRD-1777455192227', 'BOB201', 'ACTIVE', '1', NULL, now(), now(), FALSE);
INSERT INTO public.board_master (id, board_code, board_name, status, created_by, updated_by, created_at, updated_at, is_deleted) VALUES ('3', 'BRD-1777456021199', 'BOB203', 'ACTIVE', '1', NULL, now(), now(), FALSE);
INSERT INTO public.board_master (id, board_code, board_name, status, created_by, updated_by, created_at, updated_at, is_deleted) VALUES ('7', 'BRD-1778159858803', 'BOB301', 'ACTIVE', '1', NULL, now(), now(), FALSE);


--
-- TOC entry 5708 (class 0 OID 16810)
-- Dependencies: 245
-- Data for Name: brand_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.brand_master (id, name, brand_code, status, created_at, updated_at, is_deleted) VALUES ('2', 'Birla Open Minds Pre School', 'BOMPS', 'ACTIVE', now(), now(), FALSE);
INSERT INTO public.brand_master (id, name, brand_code, status, created_at, updated_at, is_deleted) VALUES ('3', 'Gopi Birla Memorial School', 'GBMS', 'ACTIVE', now(), now(), FALSE);
INSERT INTO public.brand_master (id, name, brand_code, status, created_at, updated_at, is_deleted) VALUES ('1', 'Birla Open Minds International Schools', 'BOMIS', 'ACTIVE', now(), now(), FALSE);


--
-- TOC entry 5763 (class 0 OID 17685)
-- Dependencies: 300
-- Data for Name: calculation_basis_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5753 (class 0 OID 17366)
-- Dependencies: 290
-- Data for Name: cheque_favour_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.cheque_favour_master (id, cheque_in_favour_of, fees_type, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Birla Open Minds International School', 'Birla Open Minds International School', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5688 (class 0 OID 16635)
-- Dependencies: 225
-- Data for Name: course_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.course_master (id, course_code, course_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'CRS-1777530687840', 'IT', 'INACTIVE', TRUE, '1', '1', now(), now());
INSERT INTO public.course_master (id, course_code, course_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('3', 'CRS-1777533248143', 'CSS', 'ACTIVE', FALSE, '1', '1', now(), now());
INSERT INTO public.course_master (id, course_code, course_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'CRS-1777530534407', 'CSS', 'ACTIVE', TRUE, '1', '1', now(), now());


--
-- TOC entry 5698 (class 0 OID 16740)
-- Dependencies: 235
-- Data for Name: division_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.division_master (id, division_name, status, is_deleted, created_by, created_at, updated_at) VALUES ('2', 'C', 'ACTIVE', FALSE, '1', now(), now());
INSERT INTO public.division_master (id, division_name, status, is_deleted, created_by, created_at, updated_at) VALUES ('3', 'B', 'ACTIVE', FALSE, '1', now(), now());
INSERT INTO public.division_master (id, division_name, status, is_deleted, created_by, created_at, updated_at) VALUES ('1', 'A', 'ACTIVE', TRUE, '1', now(), now());


--
-- TOC entry 5745 (class 0 OID 17297)
-- Dependencies: 282
-- Data for Name: easebuzz_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.easebuzz_mapping (id, school_name, merchant_key, merchant_salt, environment, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Birla Open Minds International School', 'KEY001', 'SALT001', 'PROD', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5764 (class 0 OID 17703)
-- Dependencies: 301
-- Data for Name: fees_category_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5765 (class 0 OID 17721)
-- Dependencies: 302
-- Data for Name: fees_sub_type_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5766 (class 0 OID 17739)
-- Dependencies: 303
-- Data for Name: fees_type_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5733 (class 0 OID 17212)
-- Dependencies: 270
-- Data for Name: gender_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.gender_master (id, name, short_form, display_order, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Female', 'FE', '1', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.gender_master (id, name, short_form, display_order, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Male', 'MA', '1', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5735 (class 0 OID 17226)
-- Dependencies: 272
-- Data for Name: grade_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.grade_master (id, name, short_form, display_order, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Learning Year 1', 'LY 1', '1', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.grade_master (id, name, short_form, display_order, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Learning Year 2', 'LY 2', '2', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5749 (class 0 OID 17333)
-- Dependencies: 286
-- Data for Name: grayquest_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.grayquest_mapping (id, school_name, institute_id, api_key, environment, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Birla Open Minds International School', 'INST001', 'APIKEY001', 'PROD', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5704 (class 0 OID 16782)
-- Dependencies: 241
-- Data for Name: house_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5767 (class 0 OID 17757)
-- Dependencies: 304
-- Data for Name: mode_of_payment_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5721 (class 0 OID 17120)
-- Dependencies: 258
-- Data for Name: parameter_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.parameter_master (id, parameter_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Asks questions to extend own understanding about the things seen in the environment', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.parameter_master (id, parameter_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Attempts to make decisions/choices', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5770 (class 0 OID 17887)
-- Dependencies: 307
-- Data for Name: password_resets; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.password_resets (id, user_id, token, used, created_at) VALUES ('47b59c9f-e817-41fc-acdf-72d8a651b4bf', '2', 'adf62b0d049b2b455f342a6e176773145a4a140aebc753af93a919a3c9ec9367', FALSE, now());


--
-- TOC entry 5741 (class 0 OID 17267)
-- Dependencies: 278
-- Data for Name: payment_entity_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.payment_entity_master (id, entity_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Maste', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.payment_entity_master (id, entity_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Visa', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5743 (class 0 OID 17280)
-- Dependencies: 280
-- Data for Name: paytm_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.paytm_mapping (id, school_name, mid, tid, edc_type, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Birla Open Minds International School', 'MID001', 'TID001', 'EDC 1', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5751 (class 0 OID 17351)
-- Dependencies: 288
-- Data for Name: pdc_status_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.pdc_status_master (id, pdc_status, description, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Action pendings', 'Fee Executive created token for PDC but not updated PDC detail in PDC Module', 'ACTIVE', FALSE, '1', '1', now(), now());


--
-- TOC entry 5768 (class 0 OID 17781)
-- Dependencies: 305
-- Data for Name: period_of_service_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5725 (class 0 OID 17148)
-- Dependencies: 262
-- Data for Name: pp_grade_domain_skill_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.pp_grade_domain_skill_mapping (id, grade_name, domain_name, skill_name, parameter_id, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'L2', 'APPROACHES TO LEARNING', 'APPROACHES TO LEARNING', '1', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.pp_grade_domain_skill_mapping (id, grade_name, domain_name, skill_name, parameter_id, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Attempts to make decisions/choices', 'INITIATIVE AND CURIOSITY', 'Seeks new experiences', '1', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.pp_grade_domain_skill_mapping (id, grade_name, domain_name, skill_name, parameter_id, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('3', 'L4', 'APPROACHES TO LEARNING', 'APPROACHES TO LEARNING', '2', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5717 (class 0 OID 17092)
-- Dependencies: 254
-- Data for Name: pre_primary_phase_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.pre_primary_phase_master (id, phase_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Phase 1', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5719 (class 0 OID 17106)
-- Dependencies: 256
-- Data for Name: pre_primary_subject_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.pre_primary_subject_master (id, name, short_form, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Integrated Learning Time', 'IL', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5747 (class 0 OID 17315)
-- Dependencies: 284
-- Data for Name: school_bank_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_bank_mapping (id, school_name, bank_name, account_number, ifsc_code, account_type, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Birla Open Minds International School', 'ICICI Bank', '12345673452', 'ICIC0000001', 'Current', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5712 (class 0 OID 17023)
-- Dependencies: 249
-- Data for Name: school_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_contacts (contact_id, school_id, contact_type, full_name, email_login_id, phone_number, is_active, created_at) VALUES ('63f93e14-bca7-4143-b25b-075d4fdbef34', 'fb031039-975c-4f43-a38a-a5a0822b5b87', 'centre_head', 'jon', 'jon@gmail.com', '1234567834', TRUE, now());
INSERT INTO public.school_contacts (contact_id, school_id, contact_type, full_name, email_login_id, phone_number, is_active, created_at) VALUES ('d5d583cc-10be-4370-b826-826e1f6915a4', 'fb031039-975c-4f43-a38a-a5a0822b5b87', 'principal', 'manoj', 'manoj@gmail.com', '1234567834', TRUE, now());
INSERT INTO public.school_contacts (contact_id, school_id, contact_type, full_name, email_login_id, phone_number, is_active, created_at) VALUES ('89b4015f-1ec6-4658-8b3f-22ab5d3d9fb5', '8c75b15d-a1b4-427b-a0ce-909fd437c1e4', 'centre_head', 'Rohit', 'rohit@gmail.com', '1234567845', TRUE, now());
INSERT INTO public.school_contacts (contact_id, school_id, contact_type, full_name, email_login_id, phone_number, is_active, created_at) VALUES ('7ecaacb3-f129-42dc-a172-1a0166fdfb7f', '673b46e3-e51e-49a5-88eb-5db7756dd736', 'centre_head', 'Jane Head', 'jane.head@bomis.edu.in', '9876543212', TRUE, now());
INSERT INTO public.school_contacts (contact_id, school_id, contact_type, full_name, email_login_id, phone_number, is_active, created_at) VALUES ('0c95a06d-360f-4af0-9d6e-f2ee3f343204', '673b46e3-e51e-49a5-88eb-5db7756dd736', 'principal', 'Robert Principal', 'robert.p@bomis.edu.in', '9876543213', TRUE, now());


--
-- TOC entry 5756 (class 0 OID 17499)
-- Dependencies: 293
-- Data for Name: school_enquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_enquiries (enquiry_id, school_id, branch_id, enquiry_no, enquiry_purpose_id, enquiry_for_id, academic_session_id, board_id, grade_id, batch_id, school_type_id, source_id, sub_source_id, lead_stage_id, contact_mode_id, student_name, dob, gender_id, aadhaar_no, current_school, current_board_id, current_grade_id, father_name, father_mobile, father_email, mother_name, mother_mobile, mother_email, guardian_name, guardian_mobile, preferred_contact_id, address_line1, address_line2, address_line3, pincode, country, state, city, is_concession, concession_type_id, is_referral, referral_name, current_owner, assigned_to, interaction_mode_id, interaction_status_id, next_followup_date, priority_tag, status, created_by, updated_by, created_at, updated_at, is_deleted) VALUES ('7e9565b8-4e4b-4522-9380-342566e5fe67', '00000000-0000-0000-0000-000000000001', '1', 'ENQ-2026-721949', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', 'jayshri pawar', '2008-06-11', '1', '123456789434', 'abc', '1', '1', 'Sunil Verma', '8888888888', 'varma@gmail.com', 'rama', '1234567867', 'rama@gmail.com', 'ss', '1234567456', '1', NULL, NULL, NULL, NULL, 'India', 'Maharashtra', 'Raigarh(MH)', TRUE, '1', FALSE, '1', 'Corporate Admin', '1', '1', '1', '2026-05-29', 'COLD', 'NEW', NULL, NULL, now(), now(), FALSE);
INSERT INTO public.school_enquiries (enquiry_id, school_id, branch_id, enquiry_no, enquiry_purpose_id, enquiry_for_id, academic_session_id, board_id, grade_id, batch_id, school_type_id, source_id, sub_source_id, lead_stage_id, contact_mode_id, student_name, dob, gender_id, aadhaar_no, current_school, current_board_id, current_grade_id, father_name, father_mobile, father_email, mother_name, mother_mobile, mother_email, guardian_name, guardian_mobile, preferred_contact_id, address_line1, address_line2, address_line3, pincode, country, state, city, is_concession, concession_type_id, is_referral, referral_name, current_owner, assigned_to, interaction_mode_id, interaction_status_id, next_followup_date, priority_tag, status, created_by, updated_by, created_at, updated_at, is_deleted) VALUES ('9888f747-38bc-4575-8fef-99e0113bb8b3', '00000000-0000-0000-0000-000000000001', '1', 'ENQ-2026-364086', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', 'John Junior', '2018-05-15', '1', '123456789012', 'Little Hearts Pre-school', '1', '1', 'John Doe', '9876543210', 'john@example.com', 'Jane Doe', '9876543211', 'jane@example.com', NULL, NULL, '1', '123 Street', NULL, NULL, '400001', 'India', 'Maharashtra', 'Mumbai', FALSE, '1', FALSE, '1', 'Mumbai Admin', '2', '1', '1', NULL, 'WARM', 'NEW', NULL, NULL, now(), now(), FALSE);


--
-- TOC entry 5761 (class 0 OID 17656)
-- Dependencies: 298
-- Data for Name: school_enquiry_assignment_cursor; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_enquiry_assignment_cursor (id, next_index, updated_at) VALUES ('1', '0', now());


--
-- TOC entry 5758 (class 0 OID 17534)
-- Dependencies: 295
-- Data for Name: school_enquiry_followups; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_enquiry_followups (followup_id, enquiry_id, interaction_mode_id, interaction_status_id, followup_date, followup_time, next_followup_date, next_followup_time, remarks, notes, followup_with, followup_by, created_at, priority, is_deleted, created_by, updated_by, updated_at) VALUES ('1', '7e9565b8-4e4b-4522-9380-342566e5fe67', '1', '1', '2026-05-28', '14:28:00', '2026-05-29', '20:32:00', 'on going', NULL, 'parents', NULL, now(), NULL, FALSE, NULL, NULL, now());
INSERT INTO public.school_enquiry_followups (followup_id, enquiry_id, interaction_mode_id, interaction_status_id, followup_date, followup_time, next_followup_date, next_followup_time, remarks, notes, followup_with, followup_by, created_at, priority, is_deleted, created_by, updated_by, updated_at) VALUES ('2', '9888f747-38bc-4575-8fef-99e0113bb8b3', '1', '1', '2026-05-20', '10:00:00', NULL, NULL, 'Initial call done', NULL, 'Father', NULL, now(), NULL, FALSE, NULL, NULL, now());


--
-- TOC entry 5757 (class 0 OID 17520)
-- Dependencies: 294
-- Data for Name: school_enquiry_siblings; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_enquiry_siblings (sibling_id, enquiry_id, sibling_name, enrollment_no, dob, school_name, grade_id, board_id, created_at) VALUES ('1', '7e9565b8-4e4b-4522-9380-342566e5fe67', 'w', '12', '2023-05-07', 'e', '1', '1', now());
INSERT INTO public.school_enquiry_siblings (sibling_id, enquiry_id, sibling_name, enrollment_no, dob, school_name, grade_id, board_id, created_at) VALUES ('2', '9888f747-38bc-4575-8fef-99e0113bb8b3', 'Alice Doe', 'ENR123', NULL, 'BOMIS', '2', '1', now());


--
-- TOC entry 5692 (class 0 OID 16673)
-- Dependencies: 229
-- Data for Name: school_hours_duration; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_hours_duration (id, duration_code, duration_name, total_minutes, status, is_deleted, created_at, updated_at) VALUES ('1', 'SHR-1777535414403', '03:30', '210', 'ACTIVE', FALSE, now(), now());
INSERT INTO public.school_hours_duration (id, duration_code, duration_name, total_minutes, status, is_deleted, created_at, updated_at) VALUES ('2', 'SHR-1777535664326', '04:31', '271', 'ACTIVE', FALSE, now(), now());
INSERT INTO public.school_hours_duration (id, duration_code, duration_name, total_minutes, status, is_deleted, created_at, updated_at) VALUES ('3', 'SHR-1777701632501', '12:00', '720', 'ACTIVE', FALSE, now(), now());


--
-- TOC entry 5713 (class 0 OID 17049)
-- Dependencies: 250
-- Data for Name: school_partners; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_partners (partner_id, school_id, partner_name, partner_email, partner_mobile, sort_order, created_at) VALUES ('183ea06b-11bc-4ba9-bd8f-ff6fd1d2f4a8', 'fb031039-975c-4f43-a38a-a5a0822b5b87', 'sam', 'sam@gmail.com', '1234567895', '0', now());
INSERT INTO public.school_partners (partner_id, school_id, partner_name, partner_email, partner_mobile, sort_order, created_at) VALUES ('9fc73b27-ac97-4a22-bf8a-a8acf572c6d8', '8c75b15d-a1b4-427b-a0ce-909fd437c1e4', 'rohit', 'rohit@gmail.com', '1234567894', '0', now());
INSERT INTO public.school_partners (partner_id, school_id, partner_name, partner_email, partner_mobile, sort_order, created_at) VALUES ('1b20b45f-12cb-4c62-9233-3b1995b535c7', '673b46e3-e51e-49a5-88eb-5db7756dd736', 'John Partner', 'john@example.com', '9876543211', '0', now());


--
-- TOC entry 5690 (class 0 OID 16653)
-- Dependencies: 227
-- Data for Name: school_timing_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.school_timing_master (id, timing_code, shift_name, start_time, end_time, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'TIM-1777532530231', 'morning shift', '10:30:00', '13:00:00', 'ACTIVE', FALSE, '1', '1', now(), now());


--
-- TOC entry 5711 (class 0 OID 16974)
-- Dependencies: 248
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.schools (school_id, zone_id, brand_id, brand_code, school_name, school_code, board, session_month, total_capacity, operational_capacity, address_line1, address_line2, address_line3, pin_code, country, state_province, city, phone_number, official_email, website_url, billing_name, billing_same_as_school, billing_address_line1, billing_address_line2, billing_address_line3, billing_pin_code, billing_country, billing_state_province, billing_city, affiliation_number, cbse_school_code, udise_code, status, created_by, created_at, updated_at, deleted_at) VALUES ('8c75b15d-a1b4-427b-a0ce-909fd437c1e4', '3', '2', 'BOMPS', 'Jsw', 'JS123', 'CBSE', '4', '120', '150', 'Plot No. 50', 'Room Exotica', 'near ram mandir Sector 20, Ulwe', '410206', 'IN', 'Maharashtra', 'Raigarh(MH)', '1234567896', 'jon@gmail.com', 'www.com', 'Jsw', TRUE, 'Plot No. 50', 'Room Exotica', 'near ram mandir Sector 20, Ulwe', '410206', 'IN', 'Maharashtra', 'Raigarh(MH)', 'rupa das', '123', '567', 'active', NULL, now(), now(), NULL);
INSERT INTO public.schools (school_id, zone_id, brand_id, brand_code, school_name, school_code, board, session_month, total_capacity, operational_capacity, address_line1, address_line2, address_line3, pin_code, country, state_province, city, phone_number, official_email, website_url, billing_name, billing_same_as_school, billing_address_line1, billing_address_line2, billing_address_line3, billing_pin_code, billing_country, billing_state_province, billing_city, affiliation_number, cbse_school_code, udise_code, status, created_by, created_at, updated_at, deleted_at) VALUES ('fb031039-975c-4f43-a38a-a5a0822b5b87', '3', '1', 'BOMIS', 'New ideal english school', 'NS102', 'CBSE', '1', '100', '150', 'Plot No. 81', 'Span Exotica', 'near Radcliffe School Sector 20, Ulwe', '410206', 'IN', 'Maharashtra', 'Raigarh(MH)', '1234567845', 'new@gmail.com', 'https//www.new.com', 'New ideal english school', TRUE, 'Plot No. 81', 'Span Exotica', 'near Radcliffe School Sector 20, Ulwe', '410206', 'IN', 'Maharashtra', 'Raigarh(MH)', '1234', '1234', '4563', 'active', NULL, now(), now(), NULL);
INSERT INTO public.schools (school_id, zone_id, brand_id, brand_code, school_name, school_code, board, session_month, total_capacity, operational_capacity, address_line1, address_line2, address_line3, pin_code, country, state_province, city, phone_number, official_email, website_url, billing_name, billing_same_as_school, billing_address_line1, billing_address_line2, billing_address_line3, billing_pin_code, billing_country, billing_state_province, billing_city, affiliation_number, cbse_school_code, udise_code, status, created_by, created_at, updated_at, deleted_at) VALUES ('673b46e3-e51e-49a5-88eb-5db7756dd736', '1', '1', 'BOMIS', 'Birla Open Minds International School', 'BOMIS01', 'CBSE', '4', '1000', '800', '123 Education Lane', 'Building A', NULL, '400001', 'IN', 'Maharashtra', 'Mumbai', '9876543210', 'admin@bomis.edu.in', 'https://bomis.edu.in', 'Birla Open Minds International School', TRUE, '123 Education Lane', 'Building A', NULL, '400001', 'IN', 'Maharashtra', 'Mumbai', NULL, NULL, NULL, 'inactive', NULL, now(), now(), NULL);


--
-- TOC entry 5769 (class 0 OID 17799)
-- Dependencies: 306
-- Data for Name: service_provider_master; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5710 (class 0 OID 16827)
-- Dependencies: 247
-- Data for Name: session_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.session_master (id, session_name, status, created_by, created_at, updated_at, is_deleted) VALUES ('1', 'Feb', 'ACTIVE', '1', now(), now(), FALSE);
INSERT INTO public.session_master (id, session_name, status, created_by, created_at, updated_at, is_deleted) VALUES ('2', 'Jan', 'ACTIVE', '1', now(), now(), FALSE);
INSERT INTO public.session_master (id, session_name, status, created_by, created_at, updated_at, is_deleted) VALUES ('3', 'May', 'ACTIVE', '1', now(), now(), FALSE);


--
-- TOC entry 5737 (class 0 OID 17240)
-- Dependencies: 274
-- Data for Name: stream_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.stream_master (id, name, short_form, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Science', 'SCI', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.stream_master (id, name, short_form, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Commerce', 'COM', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5729 (class 0 OID 17184)
-- Dependencies: 266
-- Data for Name: student_attendance_status_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.student_attendance_status_master (id, name, short_form, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Absent', 'A', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.student_attendance_status_master (id, name, short_form, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Present', 'P', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5727 (class 0 OID 17170)
-- Dependencies: 264
-- Data for Name: subject_group_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.subject_group_master (id, subject_group_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Social Studies', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.subject_group_master (id, subject_group_name, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Science', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5723 (class 0 OID 17134)
-- Dependencies: 260
-- Data for Name: subject_type_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.subject_type_master (id, name, short_form, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Compulsory', 'CO', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5702 (class 0 OID 16768)
-- Dependencies: 239
-- Data for Name: term_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.term_master (id, term_name, short_form, status, is_deleted, created_by, created_at, updated_at) VALUES ('1', 'Term 1', 'T1', 'ACTIVE', FALSE, '1', now(), now());
INSERT INTO public.term_master (id, term_name, short_form, status, is_deleted, created_by, created_at, updated_at) VALUES ('2', 'Term 2', 'T2', 'ACTIVE', FALSE, '1', now(), now());


--
-- TOC entry 5739 (class 0 OID 17254)
-- Dependencies: 276
-- Data for Name: transaction_type_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.transaction_type_master (id, transaction_type, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('1', 'Commercial Credit Card', 'ACTIVE', FALSE, '1', NULL, now(), now());
INSERT INTO public.transaction_type_master (id, transaction_type, status, is_deleted, created_by, updated_by, created_at, updated_at) VALUES ('2', 'Credit Card', 'ACTIVE', FALSE, '1', NULL, now(), now());


--
-- TOC entry 5684 (class 0 OID 16599)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.users (id, school_code, role, full_name, email, password_hash, phone, is_active, last_login, created_at, updated_at) VALUES ('3', 'BOM_PARENT', '5', 'Sharma Parent', 'parent.sharma@birlaopenminds.edu.in', '$2a$10$hashedpassword', NULL, TRUE, NULL, now(), now());
INSERT INTO public.users (id, school_code, role, full_name, email, password_hash, phone, is_active, last_login, created_at, updated_at) VALUES ('1', 'BOM_CORP', '1', 'Corporate Admin', 'corporate@birlaopenminds.edu.in', '$2b$10$ZyLh63UB2dPkZvRKV22Q3eGAd23FNQZZQ5dRPIm85.Rpn9dqOUlku', NULL, TRUE, NULL, now(), now());
INSERT INTO public.users (id, school_code, role, full_name, email, password_hash, phone, is_active, last_login, created_at, updated_at) VALUES ('2', 'BOM_MUM', '2', 'Mumbai Admin', 'jayshripawar05@gmail.com', '$2a$10$hashedpassword', NULL, TRUE, NULL, now(), now());


--
-- TOC entry 5694 (class 0 OID 16690)
-- Dependencies: 231
-- Data for Name: winter_duration_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.winter_duration_master (id, winter_code, winter_duration_days, winter_start_date, winter_end_date, status, is_deleted, created_at, updated_at) VALUES ('1', 'WIN-1777540088059', '3', '2026-04-22', '2026-04-28', 'ACTIVE', FALSE, now(), now());
INSERT INTO public.winter_duration_master (id, winter_code, winter_duration_days, winter_start_date, winter_end_date, status, is_deleted, created_at, updated_at) VALUES ('2', 'WIN-1777701589932', '4', '2026-05-01', '2026-05-10', 'ACTIVE', FALSE, now(), now());


--
-- TOC entry 5696 (class 0 OID 16727)
-- Dependencies: 233
-- Data for Name: winter_timing_gap_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.winter_timing_gap_master (id, winter_timing_gap, status, is_deleted, created_at, updated_at, created_by) VALUES ('1', '12:34:00', 'ACTIVE', FALSE, now(), now(), '1');


--
-- TOC entry 5706 (class 0 OID 16796)
-- Dependencies: 243
-- Data for Name: zone_master; Type: TABLE DATA; Schema: public; Owner: postgres
--


-- seed data
INSERT INTO public.zone_master (id, zone_name, short_form, status, is_deleted, created_by, created_at, updated_at) VALUES ('2', 'West', 'WT', 'ACTIVE', FALSE, '1', now(), now());
INSERT INTO public.zone_master (id, zone_name, short_form, status, is_deleted, created_by, created_at, updated_at) VALUES ('3', 'North', 'NT', 'ACTIVE', FALSE, '1', now(), now());
INSERT INTO public.zone_master (id, zone_name, short_form, status, is_deleted, created_by, created_at, updated_at) VALUES ('1', 'Central', 'CT', 'ACTIVE', FALSE, '1', now(), now());


--
-- TOC entry 5812 (class 0 OID 0)
-- Dependencies: 251
-- Name: academic_subject_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academic_subject_master_id_seq', 1, true);


--
-- TOC entry 5813 (class 0 OID 0)
-- Dependencies: 267
-- Name: academic_year_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academic_year_master_id_seq', 2, true);


--
-- TOC entry 5814 (class 0 OID 0)
-- Dependencies: 291
-- Name: admission_inquiry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admission_inquiry_id_seq', 6, true);


--
-- TOC entry 5815 (class 0 OID 0)
-- Dependencies: 236
-- Name: batch_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.batch_master_id_seq', 3, true);


--
-- TOC entry 5816 (class 0 OID 0)
-- Dependencies: 222
-- Name: board_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.board_master_id_seq', 7, true);


--
-- TOC entry 5817 (class 0 OID 0)
-- Dependencies: 244
-- Name: brand_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brand_master_id_seq', 3, true);


--
-- TOC entry 5818 (class 0 OID 0)
-- Dependencies: 289
-- Name: cheque_favour_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cheque_favour_master_id_seq', 1, true);


--
-- TOC entry 5819 (class 0 OID 0)
-- Dependencies: 224
-- Name: course_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_master_id_seq', 3, true);


--
-- TOC entry 5820 (class 0 OID 0)
-- Dependencies: 234
-- Name: division_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.division_master_id_seq', 3, true);


--
-- TOC entry 5821 (class 0 OID 0)
-- Dependencies: 281
-- Name: easebuzz_mapping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.easebuzz_mapping_id_seq', 1, true);


--
-- TOC entry 5822 (class 0 OID 0)
-- Dependencies: 269
-- Name: gender_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gender_master_id_seq', 2, true);


--
-- TOC entry 5823 (class 0 OID 0)
-- Dependencies: 271
-- Name: grade_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grade_master_id_seq', 2, true);


--
-- TOC entry 5824 (class 0 OID 0)
-- Dependencies: 285
-- Name: grayquest_mapping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grayquest_mapping_id_seq', 1, true);


--
-- TOC entry 5825 (class 0 OID 0)
-- Dependencies: 240
-- Name: house_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.house_master_id_seq', 1, false);


--
-- TOC entry 5826 (class 0 OID 0)
-- Dependencies: 257
-- Name: parameter_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parameter_master_id_seq', 2, true);


--
-- TOC entry 5827 (class 0 OID 0)
-- Dependencies: 277
-- Name: payment_entity_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_entity_master_id_seq', 2, true);


--
-- TOC entry 5828 (class 0 OID 0)
-- Dependencies: 279
-- Name: paytm_mapping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paytm_mapping_id_seq', 1, true);


--
-- TOC entry 5829 (class 0 OID 0)
-- Dependencies: 287
-- Name: pdc_status_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pdc_status_master_id_seq', 1, true);


--
-- TOC entry 5830 (class 0 OID 0)
-- Dependencies: 261
-- Name: pp_grade_domain_skill_mapping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pp_grade_domain_skill_mapping_id_seq', 3, true);


--
-- TOC entry 5831 (class 0 OID 0)
-- Dependencies: 253
-- Name: pre_primary_phase_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pre_primary_phase_master_id_seq', 1, true);


--
-- TOC entry 5832 (class 0 OID 0)
-- Dependencies: 255
-- Name: pre_primary_subject_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pre_primary_subject_master_id_seq', 1, true);


--
-- TOC entry 5833 (class 0 OID 0)
-- Dependencies: 283
-- Name: school_bank_mapping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_bank_mapping_id_seq', 1, true);


--
-- TOC entry 5834 (class 0 OID 0)
-- Dependencies: 297
-- Name: school_enquiry_followups_followup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_enquiry_followups_followup_id_seq', 2, true);


--
-- TOC entry 5835 (class 0 OID 0)
-- Dependencies: 296
-- Name: school_enquiry_siblings_sibling_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_enquiry_siblings_sibling_id_seq', 2, true);


--
-- TOC entry 5836 (class 0 OID 0)
-- Dependencies: 228
-- Name: school_hours_duration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_hours_duration_id_seq', 3, true);


--
-- TOC entry 5837 (class 0 OID 0)
-- Dependencies: 226
-- Name: school_timing_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_timing_master_id_seq', 1, true);


--
-- TOC entry 5838 (class 0 OID 0)
-- Dependencies: 246
-- Name: session_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_master_id_seq', 3, true);


--
-- TOC entry 5839 (class 0 OID 0)
-- Dependencies: 273
-- Name: stream_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stream_master_id_seq', 2, true);


--
-- TOC entry 5840 (class 0 OID 0)
-- Dependencies: 265
-- Name: student_attendance_status_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_attendance_status_master_id_seq', 2, true);


--
-- TOC entry 5841 (class 0 OID 0)
-- Dependencies: 263
-- Name: subject_group_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subject_group_master_id_seq', 2, true);


--
-- TOC entry 5842 (class 0 OID 0)
-- Dependencies: 259
-- Name: subject_type_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subject_type_master_id_seq', 1, true);


--
-- TOC entry 5843 (class 0 OID 0)
-- Dependencies: 238
-- Name: term_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.term_master_id_seq', 2, true);


--
-- TOC entry 5844 (class 0 OID 0)
-- Dependencies: 275
-- Name: transaction_type_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_type_master_id_seq', 2, true);


--
-- TOC entry 5845 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 5846 (class 0 OID 0)
-- Dependencies: 230
-- Name: winter_duration_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.winter_duration_master_id_seq', 2, true);


--
-- TOC entry 5847 (class 0 OID 0)
-- Dependencies: 232
-- Name: winter_timing_gap_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.winter_timing_gap_master_id_seq', 1, true);


--
-- TOC entry 5848 (class 0 OID 0)
-- Dependencies: 242
-- Name: zone_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zone_master_id_seq', 3, true);


--
-- TOC entry 5487 (class 2606 OID 17682)
-- Name: academic_master academic_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_master
    ADD CONSTRAINT academic_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5426 (class 2606 OID 17090)
-- Name: academic_subject_master academic_subject_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_subject_master
    ADD CONSTRAINT academic_subject_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5442 (class 2606 OID 17210)
-- Name: academic_year_master academic_year_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_year_master
    ADD CONSTRAINT academic_year_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5466 (class 2606 OID 17482)
-- Name: admission_inquiry admission_inquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_inquiry
    ADD CONSTRAINT admission_inquiry_pkey PRIMARY KEY (id);


--
-- TOC entry 5383 (class 2606 OID 16765)
-- Name: batch_master batch_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batch_master
    ADD CONSTRAINT batch_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5359 (class 2606 OID 16633)
-- Name: board_master board_master_board_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_master
    ADD CONSTRAINT board_master_board_code_key UNIQUE (board_code);


--
-- TOC entry 5361 (class 2606 OID 16631)
-- Name: board_master board_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_master
    ADD CONSTRAINT board_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5392 (class 2606 OID 16825)
-- Name: brand_master brand_master_brand_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand_master
    ADD CONSTRAINT brand_master_brand_code_key UNIQUE (brand_code);


--
-- TOC entry 5394 (class 2606 OID 16823)
-- Name: brand_master brand_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand_master
    ADD CONSTRAINT brand_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5491 (class 2606 OID 17700)
-- Name: calculation_basis_master calculation_basis_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculation_basis_master
    ADD CONSTRAINT calculation_basis_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5464 (class 2606 OID 17378)
-- Name: cheque_favour_master cheque_favour_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cheque_favour_master
    ADD CONSTRAINT cheque_favour_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5363 (class 2606 OID 16651)
-- Name: course_master course_master_course_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_master
    ADD CONSTRAINT course_master_course_code_key UNIQUE (course_code);


--
-- TOC entry 5365 (class 2606 OID 16649)
-- Name: course_master course_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_master
    ADD CONSTRAINT course_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5381 (class 2606 OID 16751)
-- Name: division_master division_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.division_master
    ADD CONSTRAINT division_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5456 (class 2606 OID 17313)
-- Name: easebuzz_mapping easebuzz_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.easebuzz_mapping
    ADD CONSTRAINT easebuzz_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 5495 (class 2606 OID 17718)
-- Name: fees_category_master fees_category_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees_category_master
    ADD CONSTRAINT fees_category_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5499 (class 2606 OID 17736)
-- Name: fees_sub_type_master fees_sub_type_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees_sub_type_master
    ADD CONSTRAINT fees_sub_type_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5503 (class 2606 OID 17754)
-- Name: fees_type_master fees_type_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees_type_master
    ADD CONSTRAINT fees_type_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5444 (class 2606 OID 17224)
-- Name: gender_master gender_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender_master
    ADD CONSTRAINT gender_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5446 (class 2606 OID 17238)
-- Name: grade_master grade_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grade_master
    ADD CONSTRAINT grade_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5460 (class 2606 OID 17349)
-- Name: grayquest_mapping grayquest_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grayquest_mapping
    ADD CONSTRAINT grayquest_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 5387 (class 2606 OID 16794)
-- Name: house_master house_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.house_master
    ADD CONSTRAINT house_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5508 (class 2606 OID 17778)
-- Name: mode_of_payment_master mode_of_payment_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mode_of_payment_master
    ADD CONSTRAINT mode_of_payment_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5432 (class 2606 OID 17132)
-- Name: parameter_master parameter_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parameter_master
    ADD CONSTRAINT parameter_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5521 (class 2606 OID 17899)
-- Name: password_resets password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- TOC entry 5523 (class 2606 OID 17901)
-- Name: password_resets password_resets_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_token_key UNIQUE (token);


--
-- TOC entry 5452 (class 2606 OID 17278)
-- Name: payment_entity_master payment_entity_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_entity_master
    ADD CONSTRAINT payment_entity_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5454 (class 2606 OID 17295)
-- Name: paytm_mapping paytm_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paytm_mapping
    ADD CONSTRAINT paytm_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 5462 (class 2606 OID 17364)
-- Name: pdc_status_master pdc_status_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdc_status_master
    ADD CONSTRAINT pdc_status_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5512 (class 2606 OID 17796)
-- Name: period_of_service_master period_of_service_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.period_of_service_master
    ADD CONSTRAINT period_of_service_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5436 (class 2606 OID 17162)
-- Name: pp_grade_domain_skill_mapping pp_grade_domain_skill_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pp_grade_domain_skill_mapping
    ADD CONSTRAINT pp_grade_domain_skill_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 5428 (class 2606 OID 17104)
-- Name: pre_primary_phase_master pre_primary_phase_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pre_primary_phase_master
    ADD CONSTRAINT pre_primary_phase_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5430 (class 2606 OID 17118)
-- Name: pre_primary_subject_master pre_primary_subject_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pre_primary_subject_master
    ADD CONSTRAINT pre_primary_subject_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5458 (class 2606 OID 17331)
-- Name: school_bank_mapping school_bank_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_bank_mapping
    ADD CONSTRAINT school_bank_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 5417 (class 2606 OID 17041)
-- Name: school_contacts school_contacts_email_login_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_contacts
    ADD CONSTRAINT school_contacts_email_login_id_key UNIQUE (email_login_id);


--
-- TOC entry 5419 (class 2606 OID 17039)
-- Name: school_contacts school_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_contacts
    ADD CONSTRAINT school_contacts_pkey PRIMARY KEY (contact_id);


--
-- TOC entry 5477 (class 2606 OID 17516)
-- Name: school_enquiries school_enquiries_enquiry_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_enquiries
    ADD CONSTRAINT school_enquiries_enquiry_no_key UNIQUE (enquiry_no);


--
-- TOC entry 5479 (class 2606 OID 17514)
-- Name: school_enquiries school_enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_enquiries
    ADD CONSTRAINT school_enquiries_pkey PRIMARY KEY (enquiry_id);


--
-- TOC entry 5485 (class 2606 OID 17666)
-- Name: school_enquiry_assignment_cursor school_enquiry_assignment_cursor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_enquiry_assignment_cursor
    ADD CONSTRAINT school_enquiry_assignment_cursor_pkey PRIMARY KEY (id);


--
-- TOC entry 5483 (class 2606 OID 17542)
-- Name: school_enquiry_followups school_enquiry_followups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_enquiry_followups
    ADD CONSTRAINT school_enquiry_followups_pkey PRIMARY KEY (followup_id);


--
-- TOC entry 5481 (class 2606 OID 17528)
-- Name: school_enquiry_siblings school_enquiry_siblings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_enquiry_siblings
    ADD CONSTRAINT school_enquiry_siblings_pkey PRIMARY KEY (sibling_id);


--
-- TOC entry 5371 (class 2606 OID 16688)
-- Name: school_hours_duration school_hours_duration_duration_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_hours_duration
    ADD CONSTRAINT school_hours_duration_duration_code_key UNIQUE (duration_code);


--
-- TOC entry 5373 (class 2606 OID 16686)
-- Name: school_hours_duration school_hours_duration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_hours_duration
    ADD CONSTRAINT school_hours_duration_pkey PRIMARY KEY (id);


--
-- TOC entry 5424 (class 2606 OID 17060)
-- Name: school_partners school_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_partners
    ADD CONSTRAINT school_partners_pkey PRIMARY KEY (partner_id);


--
-- TOC entry 5367 (class 2606 OID 16669)
-- Name: school_timing_master school_timing_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_timing_master
    ADD CONSTRAINT school_timing_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5369 (class 2606 OID 16671)
-- Name: school_timing_master school_timing_master_timing_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_timing_master
    ADD CONSTRAINT school_timing_master_timing_code_key UNIQUE (timing_code);


--
-- TOC entry 5406 (class 2606 OID 17015)
-- Name: schools schools_cbse_school_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_cbse_school_code_key UNIQUE (cbse_school_code);


--
-- TOC entry 5408 (class 2606 OID 17013)
-- Name: schools schools_official_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_official_email_key UNIQUE (official_email);


--
-- TOC entry 5410 (class 2606 OID 17009)
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (school_id);


--
-- TOC entry 5412 (class 2606 OID 17011)
-- Name: schools schools_school_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_school_code_key UNIQUE (school_code);


--
-- TOC entry 5414 (class 2606 OID 17017)
-- Name: schools schools_udise_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_udise_code_key UNIQUE (udise_code);


--
-- TOC entry 5516 (class 2606 OID 17814)
-- Name: service_provider_master service_provider_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_provider_master
    ADD CONSTRAINT service_provider_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5396 (class 2606 OID 16839)
-- Name: session_master session_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_master
    ADD CONSTRAINT session_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5448 (class 2606 OID 17252)
-- Name: stream_master stream_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_master
    ADD CONSTRAINT stream_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5440 (class 2606 OID 17196)
-- Name: student_attendance_status_master student_attendance_status_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_attendance_status_master
    ADD CONSTRAINT student_attendance_status_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5438 (class 2606 OID 17182)
-- Name: subject_group_master subject_group_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_group_master
    ADD CONSTRAINT subject_group_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5434 (class 2606 OID 17146)
-- Name: subject_type_master subject_type_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_type_master
    ADD CONSTRAINT subject_type_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5385 (class 2606 OID 16780)
-- Name: term_master term_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.term_master
    ADD CONSTRAINT term_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5450 (class 2606 OID 17265)
-- Name: transaction_type_master transaction_type_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_type_master
    ADD CONSTRAINT transaction_type_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5421 (class 2606 OID 17043)
-- Name: school_contacts uq_school_contact_type; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_contacts
    ADD CONSTRAINT uq_school_contact_type UNIQUE (school_id, contact_type);


--
-- TOC entry 5355 (class 2606 OID 16616)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5357 (class 2606 OID 16614)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5375 (class 2606 OID 16704)
-- Name: winter_duration_master winter_duration_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.winter_duration_master
    ADD CONSTRAINT winter_duration_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5377 (class 2606 OID 16706)
-- Name: winter_duration_master winter_duration_master_winter_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.winter_duration_master
    ADD CONSTRAINT winter_duration_master_winter_code_key UNIQUE (winter_code);


--
-- TOC entry 5379 (class 2606 OID 16738)
-- Name: winter_timing_gap_master winter_timing_gap_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.winter_timing_gap_master
    ADD CONSTRAINT winter_timing_gap_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5390 (class 2606 OID 16808)
-- Name: zone_master zone_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone_master
    ADD CONSTRAINT zone_master_pkey PRIMARY KEY (id);


--
-- TOC entry 5488 (class 1259 OID 17684)
-- Name: idx_academic_master_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_academic_master_deleted ON public.academic_master USING btree (is_deleted);


--
-- TOC entry 5467 (class 1259 OID 17495)
-- Name: idx_admission_inquiry_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admission_inquiry_email ON public.admission_inquiry USING btree (email);


--
-- TOC entry 5468 (class 1259 OID 17494)
-- Name: idx_admission_inquiry_grade_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admission_inquiry_grade_id ON public.admission_inquiry USING btree (grade_id);


--
-- TOC entry 5469 (class 1259 OID 17493)
-- Name: idx_admission_inquiry_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admission_inquiry_school_id ON public.admission_inquiry USING btree (school_id);


--
-- TOC entry 5470 (class 1259 OID 17496)
-- Name: idx_admission_inquiry_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admission_inquiry_status ON public.admission_inquiry USING btree (status);


--
-- TOC entry 5492 (class 1259 OID 17702)
-- Name: idx_calculation_basis_master_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_calculation_basis_master_deleted ON public.calculation_basis_master USING btree (is_deleted);


--
-- TOC entry 5415 (class 1259 OID 17073)
-- Name: idx_contacts_school; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contacts_school ON public.school_contacts USING btree (school_id, contact_type);


--
-- TOC entry 5471 (class 1259 OID 17549)
-- Name: idx_enquiry_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enquiry_branch ON public.school_enquiries USING btree (branch_id);


--
-- TOC entry 5472 (class 1259 OID 17551)
-- Name: idx_enquiry_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enquiry_created ON public.school_enquiries USING btree (created_at);


--
-- TOC entry 5473 (class 1259 OID 17550)
-- Name: idx_enquiry_grade; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enquiry_grade ON public.school_enquiries USING btree (grade_id);


--
-- TOC entry 5474 (class 1259 OID 17548)
-- Name: idx_enquiry_school; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enquiry_school ON public.school_enquiries USING btree (school_id);


--
-- TOC entry 5475 (class 1259 OID 17552)
-- Name: idx_enquiry_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enquiry_status ON public.school_enquiries USING btree (status);


--
-- TOC entry 5496 (class 1259 OID 17720)
-- Name: idx_fees_category_master_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_category_master_deleted ON public.fees_category_master USING btree (is_deleted);


--
-- TOC entry 5500 (class 1259 OID 17738)
-- Name: idx_fees_sub_type_master_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_sub_type_master_deleted ON public.fees_sub_type_master USING btree (is_deleted);


--
-- TOC entry 5504 (class 1259 OID 17756)
-- Name: idx_fees_type_master_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_type_master_deleted ON public.fees_type_master USING btree (is_deleted);


--
-- TOC entry 5506 (class 1259 OID 17780)
-- Name: idx_mode_of_payment_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mode_of_payment_deleted ON public.mode_of_payment_master USING btree (is_deleted);


--
-- TOC entry 5422 (class 1259 OID 17074)
-- Name: idx_partners_school; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_partners_school ON public.school_partners USING btree (school_id);


--
-- TOC entry 5518 (class 1259 OID 17907)
-- Name: idx_password_resets_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_resets_token ON public.password_resets USING btree (token);


--
-- TOC entry 5519 (class 1259 OID 17908)
-- Name: idx_password_resets_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_resets_user_id ON public.password_resets USING btree (user_id);


--
-- TOC entry 5510 (class 1259 OID 17798)
-- Name: idx_period_of_service_master_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_period_of_service_master_deleted ON public.period_of_service_master USING btree (is_deleted);


--
-- TOC entry 5397 (class 1259 OID 17068)
-- Name: idx_schools_board; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_board ON public.schools USING btree (board);


--
-- TOC entry 5398 (class 1259 OID 17067)
-- Name: idx_schools_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_brand ON public.schools USING btree (brand_id);


--
-- TOC entry 5399 (class 1259 OID 17069)
-- Name: idx_schools_city_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_city_state ON public.schools USING btree (state_province, city);


--
-- TOC entry 5400 (class 1259 OID 17071)
-- Name: idx_schools_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_created_at ON public.schools USING btree (created_at);


--
-- TOC entry 5401 (class 1259 OID 17072)
-- Name: idx_schools_name_fts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_name_fts ON public.schools USING gin (to_tsvector('english'::regconfig, (school_name)::text));


--
-- TOC entry 5402 (class 1259 OID 17070)
-- Name: idx_schools_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_status ON public.schools USING btree (status) WHERE (deleted_at IS NULL);


--
-- TOC entry 5403 (class 1259 OID 17066)
-- Name: idx_schools_zone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_zone ON public.schools USING btree (zone_id);


--
-- TOC entry 5514 (class 1259 OID 17816)
-- Name: idx_service_provider_master_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_provider_master_deleted ON public.service_provider_master USING btree (is_deleted);


--
-- TOC entry 5352 (class 1259 OID 17849)
-- Name: idx_users_auth; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_users_auth ON public.users USING btree (school_code, email, role);


--
-- TOC entry 5353 (class 1259 OID 17850)
-- Name: idx_users_login; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_login ON public.users USING btree (school_code, email, role, is_active);


--
-- TOC entry 5404 (class 1259 OID 17075)
-- Name: idx_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_zone_id ON public.schools USING btree (zone_id);


--
-- TOC entry 5388 (class 1259 OID 17076)
-- Name: idx_zone_master_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_zone_master_id ON public.zone_master USING btree (id);


--
-- TOC entry 5489 (class 1259 OID 17683)
-- Name: uq_academic_master_name_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_academic_master_name_active ON public.academic_master USING btree (lower((academic_name)::text)) WHERE (COALESCE(is_deleted, false) = false);


--
-- TOC entry 5493 (class 1259 OID 17701)
-- Name: uq_calculation_basis_master_name_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_calculation_basis_master_name_active ON public.calculation_basis_master USING btree (lower((calculation_basis_name)::text)) WHERE (COALESCE(is_deleted, false) = false);


--
-- TOC entry 5497 (class 1259 OID 17719)
-- Name: uq_fees_category_master_name_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_fees_category_master_name_active ON public.fees_category_master USING btree (lower((fees_category_name)::text)) WHERE (COALESCE(is_deleted, false) = false);


--
-- TOC entry 5501 (class 1259 OID 17737)
-- Name: uq_fees_sub_type_master_name_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_fees_sub_type_master_name_active ON public.fees_sub_type_master USING btree (lower((fees_sub_type_name)::text)) WHERE (COALESCE(is_deleted, false) = false);


--
-- TOC entry 5505 (class 1259 OID 17755)
-- Name: uq_fees_type_master_name_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_fees_type_master_name_active ON public.fees_type_master USING btree (lower((fees_type_name)::text)) WHERE (COALESCE(is_deleted, false) = false);


--
-- TOC entry 5509 (class 1259 OID 17779)
-- Name: uq_mode_of_payment_name_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_mode_of_payment_name_active ON public.mode_of_payment_master USING btree (lower((mode_of_payment_name)::text)) WHERE (COALESCE(is_deleted, false) = false);


--
-- TOC entry 5513 (class 1259 OID 17797)
-- Name: uq_period_of_service_master_name_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_period_of_service_master_name_active ON public.period_of_service_master USING btree (lower((period_of_service_name)::text)) WHERE (COALESCE(is_deleted, false) = false);


--
-- TOC entry 5517 (class 1259 OID 17815)
-- Name: uq_service_provider_master_name_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_service_provider_master_name_active ON public.service_provider_master USING btree (lower((service_provider_name)::text)) WHERE (COALESCE(is_deleted, false) = false);


--
-- TOC entry 5535 (class 2620 OID 17498)
-- Name: admission_inquiry trg_admission_inquiry_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_admission_inquiry_updated_at BEFORE UPDATE ON public.admission_inquiry FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();


--
-- TOC entry 5528 (class 2606 OID 17861)
-- Name: admission_inquiry fk_admission_inquiry_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_inquiry
    ADD CONSTRAINT fk_admission_inquiry_created_by FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 5529 (class 2606 OID 17866)
-- Name: admission_inquiry fk_admission_inquiry_deleted_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_inquiry
    ADD CONSTRAINT fk_admission_inquiry_deleted_by FOREIGN KEY (deleted_by) REFERENCES public.users(id);


--
-- TOC entry 5530 (class 2606 OID 17488)
-- Name: admission_inquiry fk_inquiry_grade; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_inquiry
    ADD CONSTRAINT fk_inquiry_grade FOREIGN KEY (grade_id) REFERENCES public.grade_master(id) ON DELETE CASCADE;


--
-- TOC entry 5531 (class 2606 OID 17483)
-- Name: admission_inquiry fk_inquiry_school; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_inquiry
    ADD CONSTRAINT fk_inquiry_school FOREIGN KEY (school_id) REFERENCES public.schools(school_id) ON DELETE CASCADE;


--
-- TOC entry 5534 (class 2606 OID 17902)
-- Name: password_resets password_resets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5527 (class 2606 OID 17163)
-- Name: pp_grade_domain_skill_mapping pp_grade_domain_skill_mapping_parameter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pp_grade_domain_skill_mapping
    ADD CONSTRAINT pp_grade_domain_skill_mapping_parameter_id_fkey FOREIGN KEY (parameter_id) REFERENCES public.parameter_master(id);


--
-- TOC entry 5525 (class 2606 OID 17044)
-- Name: school_contacts school_contacts_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_contacts
    ADD CONSTRAINT school_contacts_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id) ON DELETE CASCADE;


--
-- TOC entry 5533 (class 2606 OID 17543)
-- Name: school_enquiry_followups school_enquiry_followups_enquiry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_enquiry_followups
    ADD CONSTRAINT school_enquiry_followups_enquiry_id_fkey FOREIGN KEY (enquiry_id) REFERENCES public.school_enquiries(enquiry_id);


--
-- TOC entry 5532 (class 2606 OID 17529)
-- Name: school_enquiry_siblings school_enquiry_siblings_enquiry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_enquiry_siblings
    ADD CONSTRAINT school_enquiry_siblings_enquiry_id_fkey FOREIGN KEY (enquiry_id) REFERENCES public.school_enquiries(enquiry_id);


--
-- TOC entry 5526 (class 2606 OID 17061)
-- Name: school_partners school_partners_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_partners
    ADD CONSTRAINT school_partners_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id) ON DELETE CASCADE;


--
-- TOC entry 5524 (class 2606 OID 17018)
-- Name: schools schools_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_master(id);


-- Completed on 2026-05-14 16:25:05

--
-- PostgreSQL database dump complete
--
