import { FastifyInstance } from "fastify"
import { SignedBodyType } from "../types/authType";


export default async function authRoutes(app: FastifyInstance) {

  // SIGNUP
  app.post<{ Body: SignedBodyType }>("/signup", async (request, reply) => {

    const { username, mobileNo, password } = request.body 
    const prisma = request.server.prisma;
    const mobNo:number=Number(mobileNo)
    const code: number = mobNo % Math.pow(10, 5)
    const user = await prisma.user.create({
      data: {
        username,
         mobileNo : String(mobileNo) ,
        password,
        otp : String(code),
        verified: false
      }
    })

    return reply.send({
      message: "Signup successful",
     user
    })

  })


  //// OTP VERIFY
  //app.post("/verify-otp", async (request, reply) => {

  //  const { mobile, otp } = request.body as any
  //  const prisma = request.server.prisma;
  //  const user = await prisma.user.findFirst({
  //    where: { mobileNo }
  //  })

  //  if (!user) {
  //    return reply.send({ message: "User not found" })
  //  }

  //  if (user.otp !== otp) {
  //    return reply.send({ message: "Invalid OTP" })
  //  }

  //  await prisma.user.update({
  //    where: { id: user.id },
  //    data: { verified: true }
  //  })

  //  return reply.send({
  //    message: "OTP verified"
  //  })

  //})


  //// LOGIN
  //app.post("/login", async (request, reply) => {

  //  const { username, password } = request.body as any
  //  const prisma = request.server.prisma;
  //  const user = await prisma.user.findUnique({
  //    where: { username }
  //  })

  //  if (!user) {
  //    return reply.send({ message: "User not found" })
  //  }

  //  if (!user.verified) {
  //    return reply.send({ message: "Verify OTP first" })
  //  }

  //  if (user.password !== password) {
  //    return reply.send({ message: "Invalid password" })
  //  }

  //  const token = app.jwt.sign({
  //    id: user.id,
  //    username: user.username
  //  })

  //  return reply.send({
  //    message: "Login successful",
  //    token
  //  })

  //})

}