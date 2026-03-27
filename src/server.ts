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
   const JWT_SECRET=process.env.JWT_SECRET;
   if (!JWT_SECRET)
     return;
    await app.register(cors)
  await app.register(prismaPlugin)
    await app.register(jwt, {
      secret: JWT_SECRET
    })
   
   await app.register(authRoutes, { prefix: "/api/auth" });
   await app.register(matrimonyRoutes, { prefix: "/api/matrimony" });
   const PORT : number = Number(process.env.PORT);
  await app.listen({ port: PORT }, () => {
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