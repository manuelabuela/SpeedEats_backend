import Bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../utils/prismaClient";

export async function log(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as User;
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) return reply.status(404).send("User not found");

  if (!(await Bcrypt.compare(password, user.password))) {
    return reply.status(404).send("Email or password is incorrect");
  }
}
