const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorMiddleware } = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const schoolRoutes = require('./routes/school.routes');
const schoolEnquiryRoutes = require('./routes/school-enquiry.routes');
const schoolEnquiryFollowupRoutes = require('./routes/school-enquiry-followup.routes');
const admissionInquiryRoutes = require('./routes/admission-inquiry.routes');
const studentAdmissionsRoutes = require('./routes/student-admissions.routes');
const lookupRoutes = require('./routes/lookup.routes');
const registrationRoutes = require('./routes/registration.routes');
const masterRoutes = require('./modules/masters/master.module');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:4028',
    'http://localhost:3000',
    'http://127.0.0.1:4028',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// API Routes
// Legacy / Module-based Routes (Consistency with Frontend)
app.use('/api/enquiry-management/admission-inquiries', admissionInquiryRoutes);
app.use('/api/enquiry-management/admission-inquiry', admissionInquiryRoutes);
app.use('/api/enquiry-management/school-enquiries', schoolEnquiryRoutes);
app.use('/api/enquiry-management/lookups', lookupRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/enquiries/school', schoolEnquiryRoutes);
app.use('/api/v1/enquiries/follow-up', schoolEnquiryFollowupRoutes);
app.use('/api/v1/enquiries/admission', admissionInquiryRoutes);
app.use('/api/v1/admissions/student', studentAdmissionsRoutes);
app.use('/api/v1/enquiries/lookups', lookupRoutes);
app.use('/api/v1/registration', registrationRoutes);
app.use('/api/v1/masters', masterRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running successfully' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
