import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { SignedBodyType } from "../types/authType.js"
import { loginType } from "../types/loginType.js"
import generateOtp from "../utils/generateOTP.js"

export const postSignup = async (request: FastifyRequest<{ Body: SignedBodyType }>, reply: FastifyReply) => {
    
  const { email, profile_name, mobileNo } = request.body 

  if (mobileNo.length != 10)
    return reply.code(400).send({ "message": "Please enter valid number " });
    const prisma = request.server.prisma;
    try {
    const user = await prisma.user.findUnique({
      where: { mobileNo }
    });
    const generatedOtp: string = await generateOtp(mobileNo);
      if (user) {
        // Case A : User is already registered 

        if (user.is_mobile_verified)
          return reply.code(409).send({ message: " Account already exists .Use another mobile number" });
        //Case B : User exists but not verified hence update details and resend otp
        else {
       
          await prisma.user.update({
            where: { mobileNo},
            data: {
              otp: generatedOtp,
              email: email,
              profile_name : profile_name
            }
          });
          return reply.send({ message: "OTP resent . Verify OTP" });
        }
        }
      // Checks for existing user whose otp was not completed 
        await prisma.user.create({
        data : {
          email: email,
          mobileNo: mobileNo,
          profile_name,
          otp: generatedOtp,
          is_mobile_verified : false
        }
      });
     
        return reply.send({
          message: "OTP sent .Verify otp",
    });
  } catch (error) {
      return reply.code(500).send({ error });
  }
    
  
}

export const postVerify=async (request: FastifyRequest<{ Body: verifyOtpBodyType }>, reply: FastifyReply) => {
    const { otp,mobileNo } = request.body;
    const prisma = request.server.prisma;
    try {
      const user = await prisma.user.findUnique({
        where: { mobileNo}
      });
      if (!user)
        return reply.code(404).send("User not found");

      if (otp !== user.otp)
        return reply.code(400).send({ message: "Invalid OTP. Try again."});

      await prisma.user.update({
        where: { mobileNo },
        data: {
          is_mobile_verified: true,
          otp : ""
        }
       })
       const token = await request.server.jwt.sign({ mobile: user.mobileNo});
        return reply.code(200).send({ message: "OTP verified sucessfully",token });
    } catch (err) {
      return reply.code(500).send({ message: "Internal server error" });
    }

    
}

export const postLogin=async (request: FastifyRequest<{Body : loginType}>, reply:FastifyReply) => {

    const { username, mobileNo } = request.body;
    const prisma = request.server.prisma;
    try {
     
      const user = await prisma.user.findUnique({
        where: { mobileNo }
      });

      if (!user || user.profile_name !== username) {
        return reply.code(401).send({ message: "Invalid Details . User not found" })
      }
      const generatedOtp : string = await generateOtp(mobileNo);
      await prisma.user.update({
        where: { mobileNo },
        data: {
          otp: generatedOtp
        }
      });
      

      return reply.send({
        message: "OTP sent.Verify-otp",
   
      });
    } catch (err) {
      return reply.code(500).send({ message: "Internal server error" });
    }

  }
