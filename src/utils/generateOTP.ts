export default function generateOtp(mobileNo : string) {
    const mobNo: number = Number(mobileNo);
    const code: number = mobNo % Math.pow(10, 5);
    return String(code);
}