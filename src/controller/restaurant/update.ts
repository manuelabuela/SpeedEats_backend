import { restaurant } from "@prisma/client";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Schema, z } from "zod";

export async function update(request: FastifyRequest, reply: FastifyReply) {
    const { id, contact, description, email, hallal, latitude, longitude, name } =
    request.body as restaurant;


    const mySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        description: z.string().nullable(),
        hallal: z.boolean(),
        contact: z.string().regex(RegExp("")),
        latitude: z.string(),
        longitude: z.string(),
     })

    if (!id) throw new Error("Id cant be null!")

    if (name)mySchema.parse({name})
    
 }
    