import * as authController from "../controllers/authController.js";
export default async function authRoutes(app) {
    // SIGNUP
    app.post("/signup", authController.postSignup);
    //Verify OTP
    app.post("/verify-otp", authController.postVerify);
    // LOGIN
    app.post("/login", authController.postLogin);
}
