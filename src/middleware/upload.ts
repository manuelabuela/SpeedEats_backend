import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { error } from "console";

export function uploadhMiddleware(field: string){
  return(
      request: FastifyRequest,
      reply: FastifyReply,
      done: (error?: FastifyError) => void,
    ) => {
      const avatar = request.body.field;
      const filename = `${randomUUID()}-${avatar.filename}`;
      const filepath = path.resolve(__dirname,"..","..", "Uploads", filename);
      
      console.log(filepath)
      fs.promises.writeFile(filepath, avatar._buf).then((res) =>{
        const body = Object.fromEntries(Object.keys(request.body).map((key) =>[key, request.body[key].value]))
        body.field = {
          filename: filename,
          originalName: avatar.filename
        }
        console.log("Imprimiu!")
        request.body = body
        done();
      })
      .catch((error)=>{
        reply.status(400).send({error: "Upload failed"})
      })

      console.log("OKy");
    }
  }
