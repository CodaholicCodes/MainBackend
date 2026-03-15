import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import authRoutes from "./routes/auth.js"
import prismaPlugin from "./plugins/prismaPlugin.js"

const app = Fastify()

app.register(cors)
app.register(prismaPlugin)
app.register(jwt, {
  secret: "supersecret"
})

app.register(authRoutes, {
  prefix: "/api"
})

 app.listen({ port: 5000 },  () => {
  console.log("Server running on http://localhost:5000")
})