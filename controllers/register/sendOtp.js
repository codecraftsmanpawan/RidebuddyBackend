require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const generateOTP = require('../../utils/generateOTP');
const sendOtp = require('../../utils/sendOtp');
const sendEmail = require('../../config/nodemailer');

const OTP_HASH_SALT_ROUNDS = 10;

exports.sendOtp = async (req, res) => {
    const { mobile, email } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    const hashedOtp = await bcrypt.hash(otp, OTP_HASH_SALT_ROUNDS);

    let user = await User.findOne({ mobile });

    if (user) {
        user.otp = hashedOtp;
        user.otpExpiry = otpExpiry;
    } else {
        user = new User({ mobile, otp: hashedOtp, otpExpiry });
    }

    if (email) {
        const emailOtp = generateOTP();
        const emailOtpExpiry = Date.now() + 5 * 60 * 1000;
        const hashedEmailOtp = await bcrypt.hash(emailOtp, OTP_HASH_SALT_ROUNDS);

        user.email = email;
        user.emailOtp = hashedEmailOtp;
        user.emailOtpExpiry = emailOtpExpiry;

        try {
            await sendEmail(email, 'Your RideBuddy OTP', `Your OTP for RideBuddy is ${emailOtp}. Please do not share it with anyone.`);
            console.log(`OTP ${emailOtp} sent to email ${email}`);
        } catch (error) {
            console.error('Error sending email OTP:', error);
            return res.status(500).json({ message: 'Failed to send OTP to email' });
        }
    }

    await user.save();

    try {
        await sendOtp({ mobile, otp });
        res.status(200).json({ message: 'OTP sent to mobile number and email (if provided)' });
    } catch (error) {
        console.error('Error during OTP sending:', error);
        res.status(500).json({ message: 'Error sending OTP via SMS', error: error.message || error });
    }
};