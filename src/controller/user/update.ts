import Bcrypt, { hash } from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { returnUser } from "../../utils/returnUser";
import { prismaClient} from "../../utils/prismaClient";
import { IUpdateUser } from "../../@types/app";
import { UserRepository } from "../../Repository/UserRepository";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { name, surname, email, newPassword, password, contact } =
    request.body as IUpdateUser;

  const id = request.userId;

  const userRepo = new UserRepository();

  try {
    if (!request.headers.authorization) throw new Error("Token not found");

    const user = await userRepo.find({ id });

    const splited = request.headers.authorization.split(" ");
    console.log(splited);

    if (!id) throw new Error("Error on authentication!");

    if (!user) throw new Error("Error on authentication!");

    if (newPassword || email) {
      if (!password) throw new Error("Please, send the old password!");

      const match = await Bcrypt.compareSync(password, user.password);

      if (!match) throw new Error("Old password is incorrect!");
    }

    if (newPassword) {
      const salt = Bcrypt.genSaltSync();
      const hash = Bcrypt.hashSync(newPassword, salt);
      await prismaClient.user.update({
        where: { id },
        data: { password: hash },
      });

      await userRepo.update({ id, password: hash });
    }

    const updatedUser = await userRepo.update({
      id,
      name /*surname*/,
      email,
      contact,
    });

    return reply.send({
      message: "User updated successfully!",
      data: { user: returnUser(user) },
    });
  } catch (error) {
    //console.log(erro);

    reply.send(error);
  }
}
