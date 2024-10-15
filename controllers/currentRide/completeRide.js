const ConfirmedRide = require('../../models/ConfirmedRide');
const Wallet = require('../../models/Wallet');
const Ride = require('../../models/RideOffer');
const CurrentHolding = require('../../models/CurrentHolding'); // Import CurrentHolding model
const { sendNotification } = require('../../controllers/notifications/sendnotifications');

const completeRide = async (req, res) => {
    const { rideId, driverProfileId } = req.body;

    try {
        // Find the confirmed ride
        const confirmedRide = await ConfirmedRide.findOne({ rideId }).populate('offeredRideId passengers.profileId');
        if (!confirmedRide) {
            return res.status(404).json({ message: 'Confirmed ride not found' });
        }

        // Check if the ride is already completed
        if (confirmedRide.status === 'completed') {
            return res.status(400).json({ message: 'Ride is already completed' });
        }

        // Calculate the amount to transfer after deducting the commission
        const rideTotal = confirmedRide.rideTotal;
        const commission = 0.10 * rideTotal; // 10% commission
        const amountToTransfer = rideTotal - commission;

        // Find the driver's wallet
        const driverWallet = await Wallet.findOne({ userId: driverProfileId });
        if (!driverWallet) {
            return res.status(404).json({ message: 'Driver\'s wallet not found' });
        }

        // Find the company's current holding
        const companyHolding = await CurrentHolding.findOne();
        if (!companyHolding) {
            return res.status(404).json({ message: 'Company\'s current holding not found' });
        }

        // Check if the company's holding has enough balance
        if (companyHolding.Amount < amountToTransfer) {
            return res.status(400).json({ message: 'Not enough balance in company\'s current holding' });
        }

        // Deduct 90% of the ride amount from the company's current holding
        companyHolding.Amount -= amountToTransfer;
        await companyHolding.save();

        // Update the driver's wallet balance
        driverWallet.rewardsPoints += amountToTransfer;
        await driverWallet.save();

        // Update the confirmed ride status to completed
        confirmedRide.status = 'completed';
        await confirmedRide.save();

        // Update the ride status to completed
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        ride.status = 'completed';
        ride.markAsComplete = true;
        ride.markAsCompleteTime = Date.now();
        await ride.save();

        // Send notification to the driver about ride completion
        await sendNotification({
            token: confirmedRide.offeredRideId.driverProfile.fcmToken, // Ensure driver's deviceToken is present
            title: 'Ride Completed',
            body: `Your ride from ${ride.pickupPoint} to ${ride.dropoffPoint} has been successfully completed.`,
            data: { rideId: ride._id.toString() }
        });

        // Send notification to all passengers about ride completion
        const passengerNotifications = confirmedRide.passengers.map(passenger => {
            return sendNotification({
                token: passenger.profileId.fcmToken, // Ensure passenger's deviceToken is present
                title: 'Ride Completed',
                body: `Your ride from ${ride.pickupPoint} to ${ride.dropoffPoint} has been successfully completed.`,
                data: { rideId: ride._id.toString() }
            });
        });
        await Promise.all(passengerNotifications); // Send notifications to all passengers

        res.status(200).json({ message: 'Ride completed successfully', amountTransferred: amountToTransfer });

    } catch (error) {
        console.error('Error completing ride:', error);
        res.status(500).json({ message: 'Failed to complete ride', error: error.message });
    }
};

module.exports = {
    completeRide
};
