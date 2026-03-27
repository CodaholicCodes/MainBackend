import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import authRoutes from "./routes/auth.js"
import prismaPlugin from "./plugins/prismaPlugin.js"
import matrimonyRoutes from "./routes/matrimony.routes.js"
import "dotenv/config"

const app = Fastify({ logger: true })

const start = async () => {
  try {
    await app.register(cors());

  
    await app.register(prismaPlugin)

    await app.register(jwt, {
      secret: process.env.JWT_SECRET
    })

    // Register routes
    await app.register(authRoutes, { prefix: "/api/auth" })
    await app.register(matrimonyRoutes, { prefix: "/api/matrimony" })

    const port = Number(process.env.PORT) || 5000
    console.log(`Server running on http://localhost:${port}`)

  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

start()