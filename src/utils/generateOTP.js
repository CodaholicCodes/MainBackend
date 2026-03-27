export default function generateOtp(mobileNo) {
    const otp = mobileNo.slice(-5);
    return otp;
}
