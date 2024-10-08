import { createBlogInput, updateBlogInput } from "@hrudayvv/common";
import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();

blogRouter.use("/*", async (c, next) => {
    console.log("Verifying if the user is authorized.")
    // bearer + the token for auth
    const authHeader = c.req.header("authorization") || "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user){
            c.set("userId", String(user.id));
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            })
        }    
    }   catch(e){
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
    
    next();
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json(); 
    const {success} = createBlogInput.safeParse(body);
    if (!success){
      c.status(411);
      return c.json({
        message: "Inputs are not correct friend"
      })
    }
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const blog = await prisma.blog.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    })
    
    return c.json({
        id: blog.id
    })
  });
  
blogRouter.put('/', async (c) => {
    const body = await c.req.json(); 
    const {success} = updateBlogInput.safeParse(body);
    if (!success){
      c.status(411);
      return c.json({
        message: "Inputs are not correct friend"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const blog = await prisma.blog.update({
        where:{
            id: body.id
        },
        data:{
            title: body.title,
            content: body.content
        }
    })
    
    return c.json({
        id: blog.id
    })  
});

// TODO: pagination needs to be implemented
blogRouter.get('/bulk', async (c) => {
    console.log("Retrieving posts in bulk")
    // const body = await c.req.json(); 
    console.log("Setting the Prisma client")
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    console.log("Querying the DB for bulk posts")
    const blogs = await prisma.blog.findMany({
        select:{
            content: true,
            title: true,
            id: true,
            author:{
                select:{
                    name: true
                }
            }
        }
    });
    console.log(`Retrieved ${blogs.length} posts.`)
    var a = c.json({
        blogs
    })
    console.log(a)
    return a;

});
  
  
blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");  // dynamic parameter
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    try {
        const blog = await prisma.blog.findFirst({
            where:{
                id: Number(id)
            },
            select: {
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        
        return c.json({
            blog
        })
    } catch(e){
        c.status(411);
        return c.json({
            message: "Error while fetching blog post"
        })
    }

});


  