import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { authMiddleware } from "../middleware/auth";
import * as controller from "../controller/user";
import multer from "multer";
import { uploadhMiddleware } from "../middleware/upload";

// const upload = multer({dest: "upload"})

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/", controller.create);
  fastify.post("/auth", controller.auth);

  // fastify.addHook("preHandler", authMiddleware)

  fastify.delete("/", controller.remove);
  fastify.put("/", { preHandler: authMiddleware }, controller.update);
  fastify.patch("/avatar", { preHandler: [uploadhMiddleware('avatar')] }, controller.avatar);
}

const upload = (field: string) => {
  return (
    req: FastifyRequest,
    rep: FastifyReply,
    done: (err?: FastifyError) => void,
  ) => {
    const file = req.file;
    console.log(file);

    done();
  };
};

function name() {
  console.log("hello");
}
