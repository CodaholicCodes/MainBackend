import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { SignedBodyType } from "../types/authType.js";
import { loginType } from "../types/loginType.js";
import * as  authController from "../controllers/authController.js"



export default async function authRoutes(app: FastifyInstance) {

  // SIGNUP
  app.post<{ Body: SignedBodyType }>("/signup", authController.postSignup)

//Verify OTP
  app.post<{ Body: verifyOtpBodyType }>("/verify-otp", authController.postVerify);


  // LOGIN
  app.post<{ Body: loginType }>("/login", authController.postLogin);
}