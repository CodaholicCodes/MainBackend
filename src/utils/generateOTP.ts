export default function generateOtp(mobileNo: string): string {

    const otp = mobileNo.slice(-5)
    return otp
}