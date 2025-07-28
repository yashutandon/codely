import {RateLimiterPrisma} from "rate-limiter-flexible"
import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server";

const FreePoints=2;
const Pro=100;
const Duration=30*24*60*60;
const Cost=1;

export  async function getUsageTracker() {
    const {has}=await auth();
    const hasProAccess=has({plan:"pro"})
    const usageTracker=new RateLimiterPrisma({
        storeClient:prisma,
        tableName:"Usage",
        points:hasProAccess ? Pro : FreePoints,
        duration:Duration
    })
    return usageTracker;
}

export async function consumeCredits(){
    const {userId}=await auth();
    if(!userId){
        throw new Error("User not authenticated");
    }
    const usageTracker=await getUsageTracker();
    const result =  await usageTracker.consume(userId,Cost);
    return result;

}

export async function getUsageStatus(){
    const {userId}=await auth();
    if(!userId){
        throw new Error("User not authenticated");
    }
    const usageTracker=await getUsageTracker();
    const result =  await usageTracker.get(userId);
    return result;

}