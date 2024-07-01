import { PrismaClient, restaurant } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AppErrors } from "../../errors/AppErros";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { contact, description, email, hallal, latitude, longitude, name } =
    request.body as restaurant;

  const userId = request.userId;
  const prismaClient = new PrismaClient();

  const mySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    description: z.string().nullable(),
    hallal: z.boolean(),
    contact: z.string().regex(RegExp("")),
    latitude: z.string(),
    longitude: z.string(),
  });

  mySchema.parse(request.body);

  if (!userId) throw new AppErrors("Authentication Error!", 401);

  const restaurant = await prismaClient.restaurant.create({
    data: {
      contact,
      email,
      hallal,
      latitude,
      longitude,
      name,
      description,
      User: { connect: { id: userId } },
    },
  });

  reply.send({ message: "Ok", restaurant });
}
