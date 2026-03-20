import "@fastify/jwt"

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            mobile: string,
         
        }
        user: {
            mobile: string,
     
        };
    }
}