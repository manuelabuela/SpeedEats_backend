
import Fastify from "fastify";
import Bcrypt from "bcrypt" ;
import { PrismaClient, User } from "@prisma/client";
import { match } from "assert";
import jwt from "jsonwebtoken"
import { json } from "stream/consumers";
import { secret } from "./Const/security_passwords";
import { authMiddleware } from "./middleware/auth";


    const prisma = new PrismaClient();

    const validnumber = /^((\+258\s?)|0)?8[2-7]\d{7}$/;
    const validpassword = /[A-Za-z\d@$!%*?&]{8,}/;


    interface IUpdateUser extends User{
        newPassword: string;
        password: string;
        surname: string;
    }

    const db = new Map<String, User>();

    const fastify = Fastify();

    fastify.get('/', (request, reply) => {
        reply.send({ hello: 'world' });
    });


    fastify.post('/user', async (request, reply) =>{
        const {name, email, password, contact} = request.body as User;

        try {
            console.log({name, email, password, contact});

            if (!email) {
                throw new Error("Email can't be empty")
            }
            if (!password) {
                throw new Error("Password can't be empty")
            }
            if (!contact) {
                throw new Error("Contact can't be empty")
            }
        const salt = Bcrypt.genSaltSync(10);
        //Vai gerar uma chave aleatoria
        const hashedPassword = Bcrypt.hashSync(password, salt)

        console.log("PASSWORD: ",password)
        console.log("SALT: ",salt)
        console.log("hASHESPASSWORD: ",hashedPassword)

        const user = await prisma.user.create({
                data:{
                    contact:contact,
                    email: email,
                    name: name,
                    password: hashedPassword
                    
                }
            });

         reply.send({
                message:"User created successfuly!",
                user: returnUser(user),
            });
            
        } catch (error) {
            // console.log(error);

            return reply.send(error);
            
        }

    });

    fastify.put('/user',  {preHandler: authMiddleware}, async (request, reply) =>{
        const {id, name, surname, email, newPassword, password, contact} = request.body as IUpdateUser;

        try {
            
            if(!request.headers.authorization) throw new Error("Token not found");

            const user = await prisma.user.findUnique({where:{id}});

            const splited = request.headers.authorization.split(" ");
            console.log(splited)

            if (!id) throw new Error("Error on authentication!");

            if (!user) throw new Error("Error on authentication!");

            if(newPassword || email){
                if(!password) throw new Error("Please, send the old password!");
               
                const match = await Bcrypt.compareSync(password, user.password)

                if (!match) throw new Error("Old password is incorrect!");
                
            }

            if (newPassword){
                const salt = Bcrypt.genSaltSync();
                const hash = Bcrypt.hashSync(newPassword, salt)
                await prisma.user.update({
                    where: {id}, 
                    data: {password: hash},
                });
    
            }

            const updatedUser = await prisma.user.update({
                where: {id}, 
                data: {name, /*surname*/ email, contact},
            })

            return reply.send({
                message : "User updated successfully!",
                data: {user: returnUser(user)},
            });

                } catch (error) {
                    //console.log(erro);

                    reply.send(error);
                }
            });

    fastify.delete('/user/:id', async (request, reply) => {
        const {id} = request.params as {id:string};

        try {
            if (!id) throw new Error("Error on authentication!");
           
            const user = await prisma.user.findUnique({where: {id}})

            if (!user) throw new Error("Error on authentication!");

            const deletedUser = await prisma.user.delete({where: {id}})
            
            return reply.send({
                message : "User deleted successfully!",
                user: returnUser(deletedUser),
            });

        } catch (error) {
            console.log(error);

            reply.send(error);   
        }
    });

    fastify.post('/auth', async (request, reply) => {
        const {email, password} = request.body as User;

        try {
            
            if (!email) throw new Error("Email can't be empty")
            if (!password) throw new Error("Password can't be empty")

            const user = await prisma.user.findUnique({where: {email}}) 

            if (!user) throw new Error("This user doesn't exit!");

            const match = await Bcrypt.compare(password, user.password); 
            //compara a senha enviada pelo user um a senha criptografada

            if (!match) throw new Error("Email or password is incorrect!");

            const token = jwt.sign({id: user.id, name: user.name}, secret, {expiresIn: "7d"})

            return reply.send({
                message : "Ok!",
                data: {user: returnUser(user), token}
            });
            
            
        } catch (error) {
            console.log(error);

            reply.send(error);
        }
    });

    fastify.post('/log', async (request, reply) => {
        const {email, password} = request.body as User
        const user = await prisma.user.findFirst({where:{email}});

        if(!user) 
            return reply.status(404).send("User not found");

        if (!(await Bcrypt.compare(password, user.password))) {
            return reply.status(404).send("Email or password is incorrect");
        };
    });

    fastify.listen({ port: 3000 }, (err, address) => {
        if (err) throw err;
        console.log("Server is now listening on 3000");
    });


    function returnUser(user: User){
        const {password, ...rest} = user;
        return rest;
    }