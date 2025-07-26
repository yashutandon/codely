import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react'
import MessageCard from './message-card';
import { MessageForm } from './message-form';
import { Fragment } from '@/generated/prisma';
import { MessageLoading } from './message-loading';



interface Props {
  projectId: string;
  activeFragment:Fragment | null;
  setActiveFragment:(fragment:Fragment | null) => void;
}
export const MessagesContainer = ({projectId,activeFragment,setActiveFragment}:Props) => {
  const bottomRef=useRef<HTMLDivElement>(null);
    const trpc=useTRPC();
      const { data: messages } = useSuspenseQuery(
        trpc.messages.getMany.queryOptions({
          projectId: projectId,
        },{
          refetchInterval:5000,
        })
      );


      useEffect(() => {
        const lastAssistantMessageWithFragment=messages.findLast(
          (message)=>message.role==="ASSISTANT" && !!message.fragment,
        )     
        if(lastAssistantMessageWithFragment){
          setActiveFragment(lastAssistantMessageWithFragment.fragment)
        }   
      }, [messages,setActiveFragment])
      
      useEffect(() => {
      bottomRef.current?.scrollIntoView();
      }, [messages.length])
      
      const lastMessage=messages[messages.length-1];
      const isLastMessageUser=lastMessage?.role==="USER"

  return (
    <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex-1 min-h-0 overflow-y-auto'>
            <div className='pt-2 pr-1'>
                {messages.map((message)=>(
                    <MessageCard key={message.id} content={message.content} role={message.role} fragment={message.fragment} createdAt={message.createdAt} isActiveFragment={activeFragment?.id===message.fragment?.id} onFragmentClick={()=>{setActiveFragment(message.fragment)}} type={message.type} />
                ))}
                {isLastMessageUser && <MessageLoading/>}
                <div ref={bottomRef}/>
            </div>
        </div>
        <div className='relative p-3 pt-1.5'>
          <div className='absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none'/>
            <MessageForm projectId={projectId}/>
        </div>
    </div>
  )
}
