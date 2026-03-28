import { FastifyInstance } from "fastify";
import * as matrimonyController from "../controllers/matrimony.controller.js";

export default async function matrimonyRoutes(app: FastifyInstance) {

  // POST: Create Profile
  app.post<{Body : MatrimonyProfileBodyType}>("/create-profile", matrimonyController.createProfile);

}