export default function generateOtp(mobileNo : string) {
    return mobileNo.slice(-5);
}