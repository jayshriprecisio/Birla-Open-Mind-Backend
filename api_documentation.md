# API Endpoints Documentation

This document lists all the available API endpoints in the new Express.js backend along with their expected JSON payloads.

> [!IMPORTANT]
> All endpoints under `Schools`, `School Enquiries`, and `Admission Inquiries` (except `POST /api/v1/enquiries/admission`) require an `Authorization` header containing the JWT token received from the Login API:
> `Authorization: Bearer <your_jwt_token>`

---

## 1. Authentication

### Login
- **URL:** `POST /api/v1/auth/login`
- **Auth Required:** No
- **Payload:**
```json
{
  "email": "superadmin@birlaopenminds.com",
  "password": "your_password"
}
```

---

## 2. Master Data (Schools)

### Create School
- **URL:** `POST /api/v1/schools`
- **Auth Required:** Yes
- **Payload:**
```json
{
  "zone_id": 1,
  "brand_id": 1,
  "brand_code": "BOMIS",
  "school_name": "Birla Open Minds International School",
  "school_code": "BOMIS01",
  "board": "CBSE",
  "session_month": 4,
  "total_capacity": 1000,
  "operational_capacity": 800,
  "address_line1": "123 Education Lane",
  "address_line2": "Building A",
  "address_line3": "",
  "pin_code": "400001",
  "country": "IN",
  "state_province": "Maharashtra",
  "city": "Mumbai",
  "phone_number": "9876543210",
  "official_email": "admin@bomis.edu.in",
  "website_url": "https://bomis.edu.in",
  "billing_same_as_school": true,
  "status": "active",
  "partners": [
    {
      "partner_name": "John Partner",
      "partner_email": "john@example.com",
      "partner_mobile": "9876543211",
      "sort_order": 0
    }
  ],
  "centre_head": {
    "full_name": "Jane Head",
    "email_login_id": "jane.head@bomis.edu.in",
    "phone_number": "9876543212"
  },
  "principal": {
    "full_name": "Robert Principal",
    "email_login_id": "robert.p@bomis.edu.in",
    "phone_number": "9876543213"
  }
}
```

### List Schools
- **URL:** `GET /api/v1/schools`
- **Auth Required:** Yes
- **Query Params:** `?page=1&limit=20&q=Birla&status=active&zone=West&board=CBSE&brand=BOMIS&mapping=mapped`

### Get Schools Dashboard Summary
- **URL:** `GET /api/v1/schools/summary`
- **Auth Required:** Yes

### Get School by ID
- **URL:** `GET /api/v1/schools/:schoolId`
- **Auth Required:** Yes

### Update School
- **URL:** `PUT /api/v1/schools/:schoolId`
- **Auth Required:** Yes
- **Payload:** *(Same as Create Payload)*

### Update School Status
- **URL:** `PATCH /api/v1/schools/:schoolId/status`
- **Auth Required:** Yes
- **Payload:**
```json
{
  "status": "inactive"
}
```

### Delete School (Soft Delete)
- **URL:** `DELETE /api/v1/schools/:schoolId`
- **Auth Required:** Yes

---

## 3. School Enquiries (Admin/Counselor Side)

### Create School Enquiry
- **URL:** `POST /api/v1/enquiries/school`
- **Auth Required:** Yes
- **Payload:**
```json
{
  "school_id": "00000000-0000-0000-0000-000000000001",
  "branch_id": 1,
  "enquiry_purpose_id": 1,
  "enquiry_for_id": 1,
  "academic_year_id": 1,
  "board_id": 1,
  "grade_id": 1,
  "batch_id": 1,
  "school_type_id": 1,
  "source_id": 1,
  "sub_source_id": 1,
  "lead_stage_id": 1,
  "contact_mode_id": 1,
  "student_name": "John Junior",
  "dob": "2018-05-15",
  "gender_id": 1,
  "aadhaar_no": "123456789012",
  "current_school": "Little Hearts Pre-school",
  "current_board_id": 1,
  "current_grade_id": 1,
  "father_name": "John Doe",
  "father_mobile": "9876543210",
  "father_email": "john@example.com",
  "mother_name": "Jane Doe",
  "mother_mobile": "9876543211",
  "mother_email": "jane@example.com",
  "address_line1": "123 Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "is_concession": false,
  "is_referral": false,
  "priority_tag": "WARM",
  "status": "NEW",
  "siblings": [
    {
      "sibling_name": "Alice Doe",
      "enrollment_no": "ENR123",
      "school_name": "BOMIS",
      "grade_id": 2
    }
  ],
  "followup": {
    "interaction_mode_id": 1,
    "interaction_status_id": 1,
    "followup_date": "2026-05-20",
    "followup_time": "10:00",
    "remarks": "Initial call done",
    "followup_with": "Father"
  }
}
```

### List School Enquiries
- **URL:** `GET /api/v1/enquiries/school`
- **Auth Required:** Yes
- **Query Params:** `?page=1&pageSize=10&search=John&status=NEW&priority=WARM`

### Phone Lookup (Pre-fill from Admission)
- **URL:** `GET /api/v1/enquiries/school/phone-lookup`
- **Auth Required:** Yes
- **Query Params:** `?phone=9876543210`

### Update School Enquiry Status
- **URL:** `PUT /api/v1/enquiries/school`
- **Auth Required:** Yes
- **Payload:**
```json
{
  "enquiry_id": "uuid-here",
  "status": "FOLLOW_UP"
}
```

### Delete School Enquiry
- **URL:** `DELETE /api/v1/enquiries/school`
- **Auth Required:** Yes
- **Query Params:** `?enquiry_id=uuid-here`

---

## 4. Admission Inquiries (Public Website Side)

### Create Admission Inquiry (Public Form)
- **URL:** `POST /api/v1/enquiries/admission`
- **Auth Required:** No
- **Payload:**
```json
{
  "school": "BOMIS Mumbai",
  "grade": "Grade 1",
  "parent_first_name": "Michael",
  "parent_last_name": "Scott",
  "relation": "Father",
  "email": "michael.scott@example.com",
  "phone_number": "9876543210",
  "comment": "Interested in 2026-2027 batch.",
  "captcha_token": "eyJhbGciOiJIUzI1NiIsInR...",
  "captcha_answer": "A2X8Z"
}
```

### List Admission Inquiries
- **URL:** `GET /api/v1/enquiries/admission`
- **Auth Required:** Yes
- **Query Params:** `?page=1&limit=20&q=Michael&status=NEW`

### Update Admission Inquiry Status
- **URL:** `PUT /api/v1/enquiries/admission/:id/status`
- **Auth Required:** Yes
- **Payload:**
```json
{
  "status": "CONTACTED"
}
```

### Delete Admission Inquiry
- **URL:** `DELETE /api/v1/enquiries/admission/:id`
- **Auth Required:** Yes

---

## 5. Inquiry Lookups (Dropdown Data)

### Get Active Schools
- **URL:** `GET /api/v1/enquiries/lookups/schools`
- **Auth Required:** No

### Get Active Grades
- **URL:** `GET /api/v1/enquiries/lookups/grades`
- **Auth Required:** No
