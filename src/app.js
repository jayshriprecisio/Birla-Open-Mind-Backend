const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorMiddleware } = require('./middlewares/error.middleware');

// Routes
const schoolsRoutes = require('./modules/schools/schools.routes');
const authRoutes = require('./modules/auth/auth.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/schools', schoolsRoutes);

// Enquiries Routes
app.use('/api/v1/enquiries/school', require('./modules/enquiries/school/school-enquiries.routes'));
app.use('/api/v1/enquiries/admission', require('./modules/enquiries/admission/admission-inquiries.routes'));
app.use('/api/v1/enquiries/lookups', require('./modules/enquiries/lookups/lookups.routes'));
app.use('/api/v1/registration', require('./modules/enquiries/registration/registration.routes'));


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
