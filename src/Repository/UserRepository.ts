import { User } from "@prisma/client";
import { prismaClient } from "../utils/prismaClient";

interface IUser {
  id?: string;
  name?: string;
  email?: string;
  surname?: string;
  password?: string;
  contact?: string;
}

export class UserRepository {
  async find({ id, email }: IUser) {
    const user = await prismaClient.user.findUnique({ where: { id, email } });

    return user;
  }

  async create({ contact, email, name, password }: User) {
    const user = await prismaClient.user.create({
      data: { contact, email, name, password },
    });

    return user;
  }

  async update({ id, contact, email, name, password }: IUser) {
    const user = await prismaClient.user.update({
      where: { id, email },
      data: { contact, email, name, password },
    });

    return user;
  }

  async remove({ id, email }: IUser) {
    const deletedUser = await prismaClient.user.delete({ where: { id, email } });

    return deletedUser;
  }
}
