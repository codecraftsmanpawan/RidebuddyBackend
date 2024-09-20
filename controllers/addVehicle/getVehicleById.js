const Vehicle = require('../../models/Vehicle');

const getVehicleById = async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await Vehicle.findById(id).populate('ownerId', 'name email');
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
    }
};

module.exports = getVehicleById;