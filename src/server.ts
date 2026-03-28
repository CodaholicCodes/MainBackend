import "dotenv/config"

import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import authRoutes from "./routes/auth.js"
import prismaPlugin from "./plugins/prismaPlugin.js"
import matrimonyRoutes from "./routes/matrimony.routes.js"

const app = Fastify({ logger: true })

const start = async () => {
  try {
    console.log(process.env.DATABASE_URL);
    // Configure CORS properly
    await app.register(cors, {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    })

    // Register plugins
    await app.register(prismaPlugin)

    await app.register(jwt, {
      secret: process.env.JWT_SECRET || "DialUrbanoSecret"
    })

    // Register routes
    await app.register(authRoutes, { prefix: "/api/auth" })
    await app.register(matrimonyRoutes, { prefix: "/api/matrimony" })

   


    const port = Number(process.env.PORT) || 5000
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`Server running on http://localhost:${port}`)

  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

start()