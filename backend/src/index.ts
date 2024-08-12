import { Hono } from 'hono';
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

const app = new Hono<{
  Bindings:{
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
}>();

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
 
//postgres://avnadmin:AVNS_2etP9a_gpeQCiWdHybM@hruday-hrudayvv-cdd1.i.aivencloud.com:13765/defaultdb?sslmode=require
// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMmI4MjIzMGEtYmY4ZS00ZGE5LWI0ZDYtZjc2Y2VjNWZlYTU0IiwidGVuYW50X2lkIjoiMmE4ZDg0YmJmZGFkNjViNGNlNzVmMDE3YjM5OTM4NzY5NGM5ZTgzZGQ1Zjg1NzQ0NWJmNGYwZTA3YWIxNGJhMiIsImludGVybmFsX3NlY3JldCI6IjY5NTEwNDg1LTE1ZDUtNGY4Mi1hYWRhLTZhYjM0YzZhZWViMiJ9.6BgzOz7GwGa9_UEQT6p33p0Rkvg6sqzxFs4BbZO5ErE"
