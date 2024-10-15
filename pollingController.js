const Profile = require('./models/Profile'); 
const Wallet = require('./models/Wallet'); 
const User = require('./models/User');       

// Polling function to check and create missing wallets
const checkAndCreateWallets = async () => {
    try {
        // Find profiles that don't have a corresponding wallet
        const profilesWithoutWallets = await Profile.aggregate([
            {
                $lookup: {
                    from: 'wallets', 
                    localField: '_id', 
                    foreignField: 'userId',
                    as: 'wallets'
                }
            },
            {
                $match: {
                    'wallets.0': { $exists: false } 
                }
            }
        ]);

        // Loop through profiles without wallets
        for (const profile of profilesWithoutWallets) {
            // Find the corresponding User by the userId in the Profile
            const user = await User.findById(profile.userId);

            // Check if the User exists
            if (user) {
                // Create a new wallet for the User
                const wallet = new Wallet({
                    userId: user._id, 
                    balance: 10 
                });

                await wallet.save();
                // console.log(`Wallet created for user: ${user._id}`);
            } else {
                // console.log(`User not found for profileId: ${profile._id}`);
            }
        }

        if (profilesWithoutWallets.length === 0) {
            // console.log('All profiles have wallets');
        }

    } catch (error) {
        // console.error('Error in wallet creation polling:', error);
    }
};

const startPolling = () => {
    setInterval(checkAndCreateWallets, 1000); 
};

module.exports = {
    startPolling
};
