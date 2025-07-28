"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplore } from "@/components/file-explorer";
import { UserControl } from "@/components/user-control";
import { useAuth } from "@clerk/nextjs";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
   const {has}=useAuth();
      const hasProAccess=has?.({plan:"pro"});

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading project...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>Loading messages...</p>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle className="hover:bg-primary transition-colors" />

        <ResizablePanel defaultSize={65} minSize={50} className="flex flex-col">
          <Tabs
            className="flex flex-col flex-1"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            {/* Header with Tabs */}
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="flex gap-x-1 border rounded-md px-1 py-0.5">
                <TabsTrigger value="preview" className="flex items-center gap-1 rounded-md px-3 py-1.5">
                  <EyeIcon className="w-4 h-4" /> <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-1 rounded-md px-3 py-1.5">
                  <CodeIcon className="w-4 h-4" /> <span>Code</span>
                </TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (<Button asChild size="sm" variant="default">
                  <Link href="/pricing">
                    <CrownIcon className="w-4 h-4 mr-1" />
                    Upgrade
                  </Link>
                </Button>)}
                <UserControl/>
              </div>
            </div>

            {/* Content */}
            <TabsContent value="preview" >
              {!!activeFragment ? (
                <FragmentWeb data={activeFragment} />
              ) : (
                <p>Select a fragment to preview</p>
              )}
            </TabsContent>

            <TabsContent value="code" className="min-h-0">
              <FileExplore
              files={activeFragment?.files as {[path:string]:string}}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
