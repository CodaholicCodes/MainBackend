import { FastifyReply, FastifyRequest } from "fastify";
import * as matrimonyService from "../services/matrimony.service";

export const getMatrimonyData = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = await matrimonyService.fetchMatrimonyData();

    return reply.send({
      success: true,
      data,
    });

  } catch (error: any) {
    return reply.status(500).send({
      success: false,
      message: error.message,
    });
  }
};