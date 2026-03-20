import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { SignedBodyType } from "../types/authType";
import { loginType } from "../types/loginType";

interface otpType{
  otp: string,
  mobileNo : string
}
export const postSignup = async (request: FastifyRequest<{ Body: SignedBodyType }>, reply: FastifyReply) => {
    
    const {email,profile_name,mobileNo } = request.body 
    const prisma = request.server.prisma;
    try {
    const user = await prisma.user.findFirst({
      where: { mobileNo }
    });

    if (user) {
      return reply.send({ message: " Account already exists .Use another mobile number"})
    }
    const mobNo: number = Number(mobileNo);
    const code: number = mobNo % Math.pow(10, 5);

      const newUser = await prisma.user.upsert({
        where: { mobileNo: mobileNo },
        update: { otp: String(code) },
        create: {
          email: email,
          mobileNo: mobileNo,
          profile_name,
          otp: String(code),
        }
      });
        return reply.send({
          message: "Verify otp",
          newUser
    });
  } catch (error) {
      return reply.code(500).send({ error });
  }
    
  
}


export const postVerify=async (request: FastifyRequest<{ Body: otpType }>, reply: FastifyReply) => {
    const { otp,mobileNo } = request.body;
    const prisma = request.server.prisma;
    try {
      const user = await prisma.user.findUnique({
        where: { mobileNo}
      });
      if (!user)
        return reply.code(404).send("User not found");

      if (otp != user.otp)
        return reply.code(400).send({ message: "Wrong Otp" });

       const token = await request.server.jwt.sign({ mobile: user.mobileNo});
        return reply.code(200).send({ message: "OTP verified sucessfully",token });
    } catch (err) {
      return reply.code(401).send({ message: err });
    }

    
}
  

export const postLogin=async (request: FastifyRequest<{Body : loginType}>, reply:FastifyReply) => {

    const { username, mobileNo } = request.body;
    const prisma = request.server.prisma;
    try {
     
      const user = await prisma.user.findUnique({
        where: { mobileNo }
      });

      if (!user) {
        return reply.code(401).send({ message: "User not found" })
      }

      return reply.send({
        message: "verify-otp",
   
      });
    } catch (err) {
      return reply.code(500).send({ message: err });
    }

  }
