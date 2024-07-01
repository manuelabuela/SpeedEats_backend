import { FastifyInstance } from "fastify";
import { userRoutes } from "./user";
import { restaurantRoutes } from "./restaurant";
import { errorHandler } from "../middleware/errorHandler";
import fastifyMultipart from "@fastify/multipart";

export async function routes(fastify: FastifyInstance) {

  fastify.setErrorHandler(errorHandler)
  fastify.register(fastifyMultipart, {attachFieldsToBody: true})
  fastify.register(userRoutes, { prefix: "/user" });
  fastify.register(restaurantRoutes, {prefix: "/restaurant"});
}
