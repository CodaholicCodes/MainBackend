import { FastifyReply, FastifyRequest } from "fastify";
import * as matrimonyService from "../services/matrimony.service.js";

export const createProfile = async (
  req: FastifyRequest<{Body : MatrimonyProfileBodyType}>,
  reply: FastifyReply
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const prisma = req.server.prisma;
  if (!token)
    return reply.send({ message: "Please Login again " });
  try {
    const { full_name, gender, age, education } = req.body;
    await req.jwtVerify();
    const  mobile  = req.user.mobile;
    const user = await prisma.user.findUnique({
      where: { mobileNo:mobile}
    });
    // Validation (basic)
    if (!full_name || !gender || !age || !education) {
      return reply.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (!user || !user.id)
      return reply.send("Invalid login");    

    const result = await matrimonyService.createProfileService({
      full_name,
      gender,
      age,
      education,
      user_id : user?.id,
    });

    return reply.status(201).send({
      success: true,
      message: "Profile created successfully",
      data: result,
    });

  } catch (error: any) {
    return reply.status(500).send({
      success: false,
      message: error.message,
    });
  }
};