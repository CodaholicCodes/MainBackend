import { FastifyInstance } from "fastify";
import * as matrimonyController from "../controllers/matrimony.controller";

export default async function matrimonyRoutes(app: FastifyInstance) {

  app.get("/matrimony-data", matrimonyController.getMatrimonyData);

}