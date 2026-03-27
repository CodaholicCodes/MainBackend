import fp from "fastify-plugin";
import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
const prismaPlugin = fp(async (server, options) => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not defined in environment variables');
    }
    console.log('Connecting to database...');
    console.log('URL:', databaseUrl.replace(/:[^:@]*@/, ':****@')); // Hide password in logs
    try {
        const adapter = new PrismaPg({
            connectionString: databaseUrl
        });
        const prisma = new PrismaClient({
            adapter,
            log: ['query', 'info', 'warn', 'error']
        });
        await prisma.$connect();
        console.log('Database connected successfully');
        server.decorate('prisma', prisma);
        server.addHook('onClose', async (server) => {
            await server.prisma.$disconnect();
            console.log('Database disconnected');
        });
    }
    catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
});
export default fp(prismaPlugin);
