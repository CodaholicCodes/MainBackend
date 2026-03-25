import { FastifyInstance } from "fastify";
import * as matrimonyController from "../controllers/matrimony.controller";

export default async function matrimonyRoutes(app: FastifyInstance) {

  // POST: Create Profile
  app.post<{Body : MatrimonyProfileBodyType}>("/create-profile", matrimonyController.createProfile);

}