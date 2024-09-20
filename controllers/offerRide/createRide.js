const Ride = require('../../models/RideOffer');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

exports.createRide = async (req, res) => {
    try {
        // Fetch the user by ID from req.user
        const userId = req.user.id; // Assuming req.user.id is the authenticated user's ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch the driver profile associated with the user
        const driver = await Profile.findOne({ userId: user._id });

        // Check if the driver profile exists
        if (!driver) {
            return res.status(404).json({ success: false, message: 'Driver profile not found' });
        }

        const { 
            sourceName, 
            sourcePoint, 
            addStopName, 
            addStopPoint, 
            destinationName, 
            destinationPoint, 
            routes, 
            tripDistance, 
            tripDuration, 
            time, 
            date, 
            seatsOffered, 
            noOfSeat,
            pricePerSeat, 
            status, 
            vehicle, 
            recurringRide, 
            selectedDays ,
            gender,
        } = req.body;

        // Ensure all required fields are filled out
        if (!sourceName || !sourcePoint || !destinationName || !destinationPoint || !routes || !tripDistance || !tripDuration || !time || !date || !seatsOffered || !pricePerSeat || !vehicle) {
            return res.status(400).json({ success: false, message: "Please fill all the required fields" });
        }

        // Create a new ride instance with the entire vehicle object
        const newRide = new Ride({
            driver: driver._id,
            sourceName,
            sourcePoint,
            addStopName,
            addStopPoint,
            destinationName,
            destinationPoint,
            routes,
            vehicle,  
            tripDistance,
            tripDuration,
            time,
            date,
            seatsOffered,
            noOfSeat,
            pricePerSeat,
            status: status || 'pending',
            recurringRide,
            selectedDays,
            gender
        });

        // Save the new ride to the database
        await newRide.save();

        // Respond with success
        res.status(201).json({ success: true, message: 'Ride created successfully', ride: newRide });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ success: false, message: 'Failed to create ride', error: error.message });
    }
};