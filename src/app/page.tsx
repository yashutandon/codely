import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

const Page = async() => {
    const queryClient=getQueryClient();
    void queryClient.prefetchQuery(trpc.createAi.queryOptions({text:"YashuTandon"}));
  return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<p>loading...</p>}>
    <Client/>
    </Suspense>
  </HydrationBoundary>
  )
}
 
export default Page;