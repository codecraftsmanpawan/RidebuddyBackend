// controllers/verifyOtp.js
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const sendEmail = require('../../config/nodemailer');
const jwt = require('jsonwebtoken');

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { mobile, otp, emailOtp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    const user = await User.findOne({ mobile });

    if (!user || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Verify the OTP
    console.log(otp, user.otp)
    const otpMatch = await bcrypt.compare(otp, user.otp);

    if (!otpMatch) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid
    user.isMobileVerified = true;
    user.otp = null; // Clear OTP after verification
    user.otpExpiry = null;

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

    const token = jwt.sign({ mobile: user.mobile, email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
    // res.cookie("token", token, options).status(200).json({
    //     message: 'OTP verified successfully. You can now create your profile.',
    //     isMobileVerified: user.isMobileVerified,
    //     isEmailVerified: user.isEmailVerified
    // })
    res.status(200).json({
        message: 'OTP verified successfully. You can now create your profile.',
        isMobileVerified: user.isMobileVerified,
        isEmailVerified: user.isEmailVerified,
        token
    });
};