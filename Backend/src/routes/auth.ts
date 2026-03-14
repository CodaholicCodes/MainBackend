import { FastifyInstance } from "fastify"
import prisma from "../plugins/prisma.js"

export default async function authRoutes(app: FastifyInstance) {

  // SIGNUP
  app.post("/signup", async (request, reply) => {

    const { username, email, mobile, password } = request.body as any

    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    const user = await prisma.user.create({
      data: {
        username,
        email,
        mobile,
        password,
        otp,
        verified: false
      }
    })

    return reply.send({
      message: "Signup successful",
      otp
    })

  })


  // OTP VERIFY
  app.post("/verify-otp", async (request, reply) => {

    const { mobile, otp } = request.body as any

    const user = await prisma.user.findFirst({
      where: { mobile }
    })

    if (!user) {
      return reply.send({ message: "User not found" })
    }

    if (user.otp !== otp) {
      return reply.send({ message: "Invalid OTP" })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true }
    })

    return reply.send({
      message: "OTP verified"
    })

  })


  // LOGIN
  app.post("/login", async (request, reply) => {

    const { username, password } = request.body as any

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return reply.send({ message: "User not found" })
    }

    if (!user.verified) {
      return reply.send({ message: "Verify OTP first" })
    }

    if (user.password !== password) {
      return reply.send({ message: "Invalid password" })
    }

    const token = app.jwt.sign({
      id: user.id,
      username: user.username
    })

    return reply.send({
      message: "Login successful",
      token
    })

  })

}