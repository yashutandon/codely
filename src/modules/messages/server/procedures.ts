import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { consumeCredits } from "@/lib/usage";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init"
import { TRPCError } from "@trpc/server";
import z from "zod";
export const messagesRouter = createTRPCRouter({
    getMany:protectedProcedure
     .input(
            z.object({
                projectId:z.string().min(1,{message:"Project ID is required"}),
            }),
        )
    .query(async ({input,ctx}) =>{
        const messages=await prisma.message.findMany({
            where:{
                projectId:input.projectId,
                project:{
                    userId:ctx.auth.userId,
                },
            },
            include:{
                fragment:true,
            },
            orderBy:{
                updatedAt:"asc"
            },
        });
        return messages;
    }),
    create: protectedProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "value is required" }).max(10000,{message:"value is too long"}),
                projectId:z.string().min(1,{message:"Project ID is required"}),
            }),
        )
        .mutation(async ({ input,ctx }) => {
            const existingProject=await prisma.project.findUnique({
                where:{
                    id:input.projectId,
                    userId:ctx.auth.userId,
                }
            })

            if(!existingProject){
                throw new TRPCError({code:"NOT_FOUND",message:"Project not found"})
            }
            try{
                await consumeCredits();
            }catch(error){
                if(error instanceof Error){
                    throw new TRPCError({code:"BAD_REQUEST",message:"Something went wrong"})
                }else {
                    throw new TRPCError({code:"TOO_MANY_REQUESTS",message:"You have run out of credits"})
                }
            }
            const createdMessage = await prisma.message.create({
                data: {
                    projectId:existingProject.id,
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                },
            });
            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId:input.projectId,
                },
            })
            return createdMessage;
        }),
});