import fp from "fastify-plugin"
import { FastifyPluginAsync } from "fastify"
import { PrismaClient } from "@prisma/client"


// This plugin is used to to connect database before server starts
declare module 'fastify' {
    interface FastifyInstance {
        prisma : PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
    const prisma =new PrismaClient()
    await prisma.$connect()
    //Attaching prisma to server


    server.decorate('prisma', prisma)
    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect()
    })
})

export default fp(prismaPlugin)