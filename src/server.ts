import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import authRoutes from "./routes/auth.js"
import prismaPlugin from "./plugins/prismaPlugin.js"
import matrimonyRoutes from "./routes/matrimony.routes";

import "dotenv/config";
import { defineConfig ,env } from "prisma/config"
const app = Fastify()

// Register Routes


const start = async () => 
{
 try {
  
    await app.register(cors)
  await app.register(prismaPlugin)
    await app.register(jwt, {
      secret: "DialUrbanoSecret"
    })
   
   await app.register(authRoutes, { prefix: "/api/auth" });
   await app.register(matrimonyRoutes, { prefix: "/api/matrimony" });
   
  await app.listen({ port: 5000 }, () => {
      console.log("Server running on http://localhost:5000")
  })
   app.get("/", (req,reply) => {
  reply.send("Hello");
   })
   
 } catch (error) {
   console.log(error);
 }
}
  start()
