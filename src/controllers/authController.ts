import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { SignedBodyType } from "../types/authType";
import { loginType } from "../types/loginType";
import generateOtp from "../utils/generateOTP";


export const postSignup = async (request: FastifyRequest<{ Body: SignedBodyType }>, reply: FastifyReply) => {
    
  const { email, profile_name, mobileNo } = request.body 
  if (mobileNo.length != 10)
    return reply.code(400).send({ "message": "Please enter valid number " });
    const prisma = request.server.prisma;
    try {
    const user = await prisma.user.findUnique({
      where: { mobileNo }
    });

      if (user) {
        if (user.is_mobile_verified)
          return reply.send({ message: " Account already exists .Use another mobile number" })
        else {
          const generatedOtp: string = await generateOtp(mobileNo);
          await prisma.user.update({
            where: { mobileNo },
            data: {
              otp: generatedOtp
            }
          });
          return reply.send({ message: "OTP resent . Verify OTP" });
        }
        }
    
        const generatedOtp: string = await generateOtp(mobileNo);
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
        return reply.code(400).send({ message: "Wrong Otp" });

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
      return reply.code(500).send({ message: "Internal server error",err });
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
      return reply.code(500).send({ message: err });
    }

  }
