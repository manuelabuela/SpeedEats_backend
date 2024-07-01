import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { returnUser } from "../../utils/returnUser";
import { prismaClient } from "../../utils/prismaClient";
import { UserRepository } from "../../Repository/UserRepository";

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const userRepo = new UserRepository();

  try {
    if (!id) throw new Error("Error on authentication!");

    const user = await prismaClient.user.findUnique({ where: { id } });

    if (!user) throw new Error("Error on authentication!");

    const deletedUser = await userRepo.remove({ id });

    return reply.send({
      message: "User deleted successfully!",
      user: returnUser(deletedUser),
    });
  } catch (error) {
    console.log(error);

    reply.send(error);
  }
}
