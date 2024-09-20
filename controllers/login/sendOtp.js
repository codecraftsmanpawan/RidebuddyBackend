require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const generateOTP = require('../../utils/generateOTP');
const sendOtp = require('../../utils/sendOtp');

const OTP_HASH_SALT_ROUNDS = 10; // Salt rounds for bcrypt

exports.login = async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }
    try {
        let user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ message: 'No account found with this mobile number. Please create an account.' });
        } else {
            const otp = generateOTP();
            const otpExpiry = Date.now() + 5 * 60 * 1000;
            const hashedOtp = await bcrypt.hash(otp, OTP_HASH_SALT_ROUNDS);

            user.otp = hashedOtp;
            user.otpExpiry = otpExpiry;
            await user.save();

            // Send OTP via Textify Digitals API
            try {
                await sendOtp({ mobile, otp });
                res.status(200).json({ message: 'OTP sent successfully' });
                console.log(`OTP ${otp} sent to mobile number ${mobile}`);
            } catch (error) {
                console.error('Error during OTP sending:', error);
                res.status(500).json({ message: 'Error sending OTP via SMS', error: error.message || error });
            }
        }
    } catch (error) {
        console.error('Error processing login request:', error);
        res.status(500).json({ message: 'Error processing login request', error });
    }
};