const express = require('express');
const {
    createService,
    getProviderServices,
    updateService,
    getAllServices
} = require('../controllers/serviceController');

const auth = require('../middleware/auth');

const router = express.Router();

// Create a New Service
router.post('/', auth(['Provider']), createService);

// Get Services Created by the Provider
router.get('/', auth(['Provider']), getProviderServices);

// Update a Service
router.put('/:id', auth(['Provider']), updateService);

// Get All Services
router.get('/all', auth(['Admin', 'Provider']), getAllServices); // Ensure 'Provider' is in quotes

module.exports = router;