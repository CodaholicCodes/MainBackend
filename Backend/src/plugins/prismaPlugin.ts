import fp from "fastify-plugin"
import { FastifyPluginAsync } from "fastify"
import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaPg} from "@prisma/adapter-pg"

// This plugin is used to to connect to auth database before server starts
declare module 'fastify' {
    interface FastifyInstance {
        prisma : PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
    const adapter = new PrismaPg({connectionString :process.env.DATABASE_URL})
    const prisma = new PrismaClient({adapter})
    await prisma.$connect()
    //Attaching prisma to server


    server.decorate('prisma', prisma)
    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect()
    })
})

export default fp(prismaPlugin)