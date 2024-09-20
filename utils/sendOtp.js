require('dotenv').config();
const axios = require('axios');

// Function to send OTP to mobile
const sendOtp = async ({ mobile, otp }) => {
    if (!mobile) {
        throw new Error('Mobile number is required');
    }

    const apiKey = process.env.API_KEY;
            const senderId = 'APMOBL';
            const templateId = '1707170806586426117';
            const message = `Your One Time Password (OTP) for your RideBuddy account is ${otp} . Please validate it on authentication page and do not share it with anyone. Regards Team AP Mobility India Private Limited`;
            const url = `https://sms.textifydigitals.com/vb/apikey.php?apikey=${apiKey}&senderid=${senderId}&templateid${templateId}=&number=${mobile}&message=${message}`;

    try {
        const response = await axios.get(url);
        if (response.data.status !== 'Success') {
            throw new Error('Failed to send OTP to mobile');
        }
        console.log(`OTP ${otp} sent to mobile number ${mobile}`);
    } catch (error) {
        console.error('Error sending OTP to mobile:', error.message || error);
        throw new Error('Failed to send OTP to mobile');
    }
};

module.exports = sendOtp;