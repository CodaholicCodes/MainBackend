import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { SignedBodyType } from "../types/authType";
import { loginType } from "../types/loginType";
import * as  authController from "../controllers/authController"
interface otpType{
  otp: string,
  mobileNo : string
}



export default async function authRoutes(app: FastifyInstance) {

  // SIGNUP
  app.post<{ Body: SignedBodyType }>("/signup", authController.postSignup)

//Verify OTP
  app.post<{ Body: otpType }>("/verify-otp", authController.postVerify);


  // LOGIN
  app.post<{ Body: loginType }>("/login", authController.postLogin);
}