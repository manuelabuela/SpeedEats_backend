import { FastifyInstance } from "fastify";
import * as controller from "../controller/restaurant"
import { authMiddleware } from "../middleware/auth";

export async function restaurantRoutes(fastify: FastifyInstance){
    fastify.post('/',{preHandler:authMiddleware} ,controller.create)
}