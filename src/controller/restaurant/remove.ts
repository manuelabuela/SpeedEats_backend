import { PrismaClient, restaurant } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import {string, z} from "zod"
import {prismaClient} from "../../utils/prismaClient"

export async function remove (request:FastifyRequest, reply: FastifyReply) {

    const {id} = request.params as {id: string}

    const mySchema = z.object({
        id: z.string()
    })

    mySchema.parse(id)

    const userId = request.userId

    if(!userId)throw new Error("");

    const user = await prismaClient.user.findUnique({where: {id:userId}})

    if(!user)throw new Error("");

    const rest = await prismaClient.restaurant.findUnique({where: {id:id}})
    
    if(!rest)throw new Error("Restaurant not found!");

    if(rest.UserId !== request.userId)throw new Error("Restaurant can't be removed!");

    const removeRestaurant = await prismaClient.restaurant.delete({where: {id}})

    reply.send({messag:"OK", removeRestaurant})
    
    
    
    
}