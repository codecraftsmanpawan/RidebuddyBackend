const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../config/multerConfig'); // Import the multer configuration

// Import controllers from separate files
const addVehicle = require('../controllers/addVehicle/addVehicle');
const getAllVehicles = require('../controllers/addVehicle/getAllVehicles');
const getVehicleById = require('../controllers/addVehicle/getVehicleById');
const deleteVehicle = require('../controllers/addVehicle/deleteVehicle');

// Define routes for vehicle management
router.post('/add', authenticateToken, upload.single('vehiclePicture'), addVehicle); // Route to add a new vehicle
router.get('/', authenticateToken, getAllVehicles); // Route to get all vehicles
router.get('/:id', authenticateToken, getVehicleById); // Route to get a single vehicle by ID
router.delete('/delete/:id', authenticateToken, deleteVehicle); // Route to delete a vehicle by ID

module.exports = router;