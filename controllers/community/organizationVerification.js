require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const generateOTP = require('../../utils/generateOTP');
const sendOtp = require('../../utils/sendOtp');
const sendEmail = require('../../config/nodemailer');
const jwt = require('jsonwebtoken');

const OTP_HASH_SALT_ROUNDS = 10;

exports.sendOtp = async (req, res) => {
    const {  email ,userId} = req.body;
console.log(email,userId)
    let user = await User.findById(userId);
    console.log(user)

    if (user) {

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
    } else {
        return res.status(404).json({ message: 'User not found' });
    }

    await user.save();
    res.status(200).json({ message: 'OTP sent successfully' });
};

exports.verifyOtp = async (req, res) => {
    const { userId, emailOtp } = req.body;

    let user = await User.findById(userId);

if (!user) {
    return res.status(404).json({ message: 'User not found' });
}

    if (emailOtp) {
        if (!user.emailOtp || user.emailOtpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired email OTP' });
        }

        const emailOtpMatch = await bcrypt.compare(emailOtp, user.emailOtp);

        if (emailOtpMatch) {
            user.isEmailVerified = true;
            user.emailOtp = null; // Clear email OTP after verification
            user.emailOtpExpiry = null;

            // Optionally, send profile creation confirmation email
            try {
                await sendEmail(user.email, 'OTP Verified', `Your OTP for RideBuddy has been successfully verified.`);
                console.log(`OTP verification email sent to ${user.email}`);
            } catch (error) {
                console.error('Error sending OTP verification email:', error);
            }
        } else {
            return res.status(400).json({ message: 'Invalid email OTP' });
        }
    }

    await user.save();
    res.status(200).json({
        message: 'OTP verified successfully.',
        isEmailVerified: user.isEmailVerified,
        
    });
};