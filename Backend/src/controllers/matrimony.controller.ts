import { FastifyReply, FastifyRequest } from "fastify";
import * as matrimonyService from "../services/matrimony.service";

export const createProfile = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { full_name, gender, age, education, user_id } = req.body as any;

    // Validation (basic)
    if (!full_name || !gender || !age || !education || !user_id) {
      return reply.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await matrimonyService.createProfileService({
      full_name,
      gender,
      age,
      education,
      user_id,
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