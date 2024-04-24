
    import Fastify from "fastify";
    import Bcrypt from "bcrypt" ;
    import { PrismaClient } from "@prisma/client";
    import { match } from "assert";


    const prisma = new PrismaClient();

    const validnumber = /^((\+258\s?)|0)?8[2-7]\d{7}$/;
    const validpassword = /[A-Za-z\d@$!%*?&]{8,}/;


    interface IUser {
        id?: string
        name: string;
        email: string;
        password: string;
        contact: string;
    }

    interface IUpdateUser extends IUser{
        newPassword: string;
        oldPassword: string;
    }

    const db = new Map<String, IUser>();

    const fastify = Fastify();

    fastify.get('/', (request, reply) => {
        reply.send({ hello: 'world' });
    });


    fastify.post('/user', async (request, reply) =>{
        const {name, email, password, contact} = request.body as IUser;

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
            })

         reply.send({
                message:"User created successfuly!",
                user: user,
            });
            
        } catch (error) {
            // console.log(error);

            return reply.send(error);
            
        }

    });

    fastify.put('/user', (request, reply) =>{
        const {id, name, email, newPassword, oldPassword, contact} = request.body as IUpdateUser;
    

        try {
            if (!id) throw new Error("Error on authentication!");
            
            const user = db.get(id);

            if (!user) throw new Error("Error on authentication!");

            if(newPassword){
                if(!oldPassword) throw new Error("Please, send the old password!");
                if (user.password !== oldPassword) throw new Error("Old password is incorrect!");
                
            }

            const newUser:IUser = {
                id: id? id : user.id,
                email: email? email :  user.email, 
                name: name? name : user.name, 
                password: newPassword? newPassword : user.password, 
                contact: contact? contact : user.contact
            };
            console.log(newUser);
            db.set(id, newUser)

    return reply.send({
        message : "User updated successfully!",
        user: newUser
    });

        } catch (error) {
            //console.log(erro);

            reply.send(error);
        }
    });

    fastify.delete('/user', (request, reply) => {

    });

    fastify.post('/auth', async (request, reply) => {
        const {email, password} = request.body as IUser;

        try {
            
            if (!email) throw new Error("Email can't be empty")
            if (!password) throw new Error("Password can't be empty")

            const user = await prisma.user.findUnique({where: {email}}) 

            if (!user) throw new Error("This user doesn't exit!");

            const match = await Bcrypt.compare(password, user.password); 
            //compara a senha enviada pelo user um a senha criptografada

            if (!match) throw new Error("Email or password is incorrect!");

            return reply.send({
                message : "Ok!",
                user: user
            });
            
            
        } catch (error) {
            console.log(error);

            reply.send(error);
        }
    });

    fastify.post('/log', async (request, reply) => {
        const {email, password} = request.body as IUser
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