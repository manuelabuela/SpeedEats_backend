import { FastifyReply, FastifyRequest } from "fastify";
import fs from "node:fs";
import util from "node:util";
import { pipeline } from "node:stream";
const pump = util.promisify(pipeline);

export async function avatar(request: FastifyRequest, reply: FastifyReply) {
  // console.log(request.body);
  const data = await request.file();

  const file = data!.file;

  await pump(file, fs.createWriteStream("sdsdfsdf" + data!.filename));

  reply.send({ message: "OK" });
}
