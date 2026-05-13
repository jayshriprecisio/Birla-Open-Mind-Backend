const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorMiddleware } = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const schoolRoutes = require('./routes/school.routes');
const schoolEnquiryRoutes = require('./routes/school-enquiry.routes');
const admissionInquiryRoutes = require('./routes/admission-inquiry.routes');
const lookupRoutes = require('./routes/lookup.routes');
const masterRoutes = require('./modules/masters/master.module');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/enquiries/school', schoolEnquiryRoutes);
app.use('/api/v1/enquiries/admission', admissionInquiryRoutes);
app.use('/api/v1/enquiries/lookups', lookupRoutes);
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
