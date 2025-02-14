const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

// User registration
// const registerUser = async (req, res) => {
//     const { name, email, password, userType } = req.body;

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ name, email, password: hashedPassword, userType });

//         await user.save();

//         const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(201).json({
//             userId: user._id,
//             name: user.name,
//             email: user.email,
//             userType,
//             token
//         });
//     } catch (error) {
//         console.error('Registration Error:', error); // Log the error
//         res.status(500).json({ message: 'Service error' });
//     }
// };
const registerUser = async (req, res) => {
    const { name, email, password, userType } = req.body;

    console.log(req.body); // Log the input values

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
        const hashedPassword = await bcrypt.hash(password, 10); // Ensure password is a valid string
        const user = new User({ name, email, password: hashedPassword, userType });

        await user.save();

        const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            userId: user._id,
            name: user.name,
            email: user.email,
            userType,
            token
        });
    } catch (error) {
        console.error('Registration Error:', error); 
        res.status(500).json({ message: 'Service error' });
    }
};

// User login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({
            userId: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get services (for clients)
const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Book an appointment
const bookAppointment = async (req, res) => {
    const { service, date } = req.body;
    const userId = req.user.id; // Getting the user ID from token

    try {
        const appointment = new Appointment({
            user: userId,
            service,
            date
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// View appointments
const viewAppointments = async (req, res) => {
    const userId = req.user.id; // Get user ID from token

    try {
        const appointments = await Appointment.find({ user: userId }).populate('service');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true } // return the updated document
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getServices,
    bookAppointment,
    viewAppointments,
    updateProfile,
};