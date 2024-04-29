import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken"
import { secret } from "../Const/security_passwords";

export async function authMiddleware (
    request: FastifyRequest, 
    reply: FastifyReply, 
    done: (error?: FastifyError) => void){

    const userId = request.userId

    console.log(userId)

    try {
        const auth = request.headers.authorization

        if(!auth) throw new Error("Token not found!");
        
        const [__, token] =  auth.split(" ")

        if(!token) throw new Error("Token not found!");

        const {id} = jwt.verify(token, secret) as {id: string}

        request.userId = id;

        done();
        
    } catch (error) {
        console.log(error);
        reply.send(error)
    }

}
 