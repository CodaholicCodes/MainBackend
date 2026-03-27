import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { SignedBodyType } from "../types/authType"
import { loginType } from "../types/loginType"
import generateOtp from "../utils/generateOTP"

export const postSignup = async (request: FastifyRequest<{ Body: SignedBodyType }>, reply: FastifyReply) => {
  const { email, profile_name, mobileNo, referral_code } = request.body
  const prisma = request.server.prisma;

  try {
    console.log('Signup attempt for mobile:', mobileNo)

    // Validate input
    if (!mobileNo || mobileNo.length !== 10) {
      return reply.code(400).send({ message: "Invalid mobile number" })
    }

    const user = await prisma.user.findUnique({
      where: { mobileNo }
    })

    if (user) {
      if (user.is_mobile_verified) {
        return reply.send({ message: "Account already exists. Use another mobile number" })
      } else {
        const generatedOtp: string = generateOtp(mobileNo)
        await prisma.user.update({
          where: { mobileNo },
          data: {
            otp: generatedOtp,
            updated_at: new Date()
          }
        })
        console.log('📱 OTP resent for:', mobileNo)
        return reply.send({ message: "OTP resent. Verify OTP" })
      }
    }

    const generatedOtp: string = generateOtp(mobileNo)

    await prisma.user.create({
      data: {
        email: email || null,
        mobileNo: mobileNo,
        profile_name: profile_name,
        otp: generatedOtp,
        referral_code: referral_code || "DialUrbano",
        is_mobile_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    console.log('User created successfully:', mobileNo)
    return reply.send({
      message: "OTP sent. Verify OTP",
    })

  } catch (error: any) {
    console.error('Signup error:', error)
    return reply.code(500).send({
      message: "Internal server error",
      error: error.message
    })
  }
}

export const postVerify = async (request: FastifyRequest<{ Body: verifyOtpBodyType }>, reply: FastifyReply) => {
  const { otp, mobileNo } = request.body
  const prisma = request.server.prisma

  try {
    console.log('Verification attempt for:', mobileNo)

    const user = await prisma.user.findUnique({
      where: { mobileNo }
    })

    if (!user) {
      return reply.code(404).send({ message: "User not found" })
    }

    if (otp !== user.otp) {
      // Increment failed attempts
      await prisma.user.update({
        where: { mobileNo },
        data: {
          failed_attempts: (user.failed_attempts || 0) + 1
        }
      })
      return reply.code(400).send({ message: "Wrong OTP" })
    }

    // Update user as verified
    await prisma.user.update({
      where: { mobileNo },
      data: {
        is_mobile_verified: true,
        otp: "",
        failed_attempts: 0,
        updated_at: new Date()
      }
    })

    // Generate JWT token
    const token = await request.server.jwt.sign({
      mobile: user.mobileNo,
      id: user.id
    })

    console.log('OTP verified successfully for:', mobileNo)
    return reply.code(200).send({
      message: "OTP verified successfully",
      token
    })

  } catch (err: any) {
    console.error('Verification error:', err)
    return reply.code(500).send({
      message: "Internal server error",
      error: err.message
    })
  }
}

export const postLogin = async (request: FastifyRequest<{ Body: loginType }>, reply: FastifyReply) => {
  const { username, mobileNo } = request.body
  const prisma = request.server.prisma

  try {
    console.log('Login attempt for:', mobileNo)

    const user = await prisma.user.findUnique({
      where: { mobileNo }
    })

    if (!user) {
      return reply.code(401).send({ message: "User not found" })
    }

    if (!user.is_mobile_verified) {
      return reply.code(401).send({ message: "Please verify your mobile number first" })
    }

    if (user.profile_name !== username) {
      return reply.code(401).send({ message: "Invalid credentials" })
    }

    const generatedOtp: string = generateOtp(mobileNo)
    await prisma.user.update({
      where: { mobileNo },
      data: {
        otp: generatedOtp,
        updated_at: new Date()
      }
    })

    console.log('Login OTP sent for:', mobileNo)
    return reply.send({
      message: "OTP sent. Verify OTP",
    })

  } catch (err: any) {
    console.error('Login error:', err)
    return reply.code(500).send({
      message: "Internal server error",
      error: err.message
    })
  }
}