import { User } from "@prisma/client";

export function returnUser(user: User) {
  const { password, ...rest } = user;
  return rest;
}
