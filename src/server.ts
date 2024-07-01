import Fastify from "fastify";
import { routes } from "./routes";
import multipart from "@fastify/multipart";

const fastify = Fastify();

fastify.register(multipart, {attachFieldsToBody: true});
fastify.register(routes, { prefix: "/api/v1" });

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log("Server is now listening on 3000");
});

/**
 * controllers - logica de negocio: regras de utilizacao, sem o name, email ou password e obrigatorio ou nao...
 * repositories - rotas de comunicacao com a DB
 * Routes - rotas para pagina de login, homepage...
 * Models/entity
 * Middleware-
 * Constants- todos os valores que serao constantes, erros...
 * Utils/functions
 */
