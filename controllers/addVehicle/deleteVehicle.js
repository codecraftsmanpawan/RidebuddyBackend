const Vehicle = require('../../models/Vehicle');

const deleteVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
};

module.exports = deleteVehicle;