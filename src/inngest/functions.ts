import { inngest } from "./client";
import {  openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event}) => {
    const codeagent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer.You write readable , maintainable code.You weite simple  Next.js & React snippets.",
      model: openai({ model: "gpt-4o" }),
    });
    const {output}= await codeagent.run(
      `Write the following text:${event.data.value}`,
    )
    console.log(output);
    return { output };
  },
);
