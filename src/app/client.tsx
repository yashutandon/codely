"use client"
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'


export 
const Client = () => {
    const trpc=useTRPC();
    const {data}=useSuspenseQuery(trpc.createAi.queryOptions({text:"YashuTandon"}))
  return (
    <div>{JSON.stringify(data,null,2)}</div>
  )
}