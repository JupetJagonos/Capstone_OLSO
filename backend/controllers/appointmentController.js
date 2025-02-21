const Appointment = require('../models/Appointment'); 

// Create an Appointment
const createAppointment = async (req, res) => {
    const { service, date } = req.body;
    const userId = req.user.id;

    try {
        const appointment = new Appointment({ user: userId, service, date });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Appointments
const getUserAppointments = async (req, res) => {
    const userId = req.user.id;

    try {
        const appointments = await Appointment.find({ user: userId }).populate('service');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//Booking an appointment 

const bookAppointment = async (req, res) => {
    const { service, date } = req.body;
    const userId = req.user.id; 
    try {
        const appointment = new Appointment({
            user: userId,
            service,
            date
        });
        await appointment.save();  
        res.status(201).json(appointment); 
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//for view appointment 
const viewAppointments = async (req, res) => {
    const userId = req.user.id; 
    try {
        const appointments = await Appointment.find({ user: userId }).populate('service'); 
        res.status(200).json(appointments); 
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createAppointment,
    getUserAppointments,
    bookAppointment,
    viewAppointments,

};