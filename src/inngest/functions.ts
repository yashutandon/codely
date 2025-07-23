import { inngest } from "./client";
import {  openai, createAgent } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter"
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event,step}) => {
    const sandboxId=await step.run("get-sandbox-id",async()=>{
      const sandbox=await Sandbox.create("codely-nextjs-test-2");
      return sandbox.sandboxId;
    });
    const codeagent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer.You write readable , maintainable code.You weite simple  Next.js & React snippets.",
      model: openai({ model: "gpt-4o" }),
    });
    const {output}= await codeagent.run(
      `Write the following text:${event.data.value}`,
    )
    const sandboxUrl=await step.run("get-sandbox-url",async()=>{
      const sandbox=await getSandbox(sandboxId);
      const host= sandbox.getHost(3000);
      return `https://${host}`;
    })
    return { output ,sandboxUrl};
  },
);
