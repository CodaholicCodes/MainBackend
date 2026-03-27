import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import jwt from "@fastify/jwt"
import authRoutes from "./routes/auth.js"
import prismaPlugin from "./plugins/prismaPlugin.js"
import matrimonyRoutes from "./routes/matrimony.routes.js"
import "dotenv/config"

const app = Fastify({ logger: true })

const start = async () => {
  try {

await app.register(fastifyCors, {
  // Specify allowed origins as an array of strings or RegExp
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  // Specify allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Allow cookies or authentication tokens to be sent with requests
  credentials: true,
  // Configure the Access-Control-Allow-Headers CORS header
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Set the maxAge for preflight requests to be cached by the browser
  maxAge: 86400 // in seconds (24 hours)
});

   

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