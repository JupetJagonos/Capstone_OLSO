const express = require('express');
const {
    registerUser,
    loginUser,
    getServices,
    bookAppointment,
    viewAppointments,
    updateProfile
} = require('../controllers/userController');

const auth = require('../middleware/auth'); 
const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Get All Services (for Clients)
router.get('/services', getServices);

// Book an Appointment
router.post('/appointments', auth(['Client']), bookAppointment);

// View User's Appointments
router.get('/appointments', auth(['Client']), viewAppointments);

// Update User Profile
router.put('/profile', auth(['Client']), updateProfile);

module.exports = router;