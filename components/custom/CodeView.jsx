"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon, LucideDownload, Rocket } from "lucide-react";
import { countToken } from "./ChatView";
import { UserDetailContext } from "@/context/UserDetailContext";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { ActionContext } from "@/context/ActionContext";

const CodeView = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup.DEFAULT_FILE);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages = [] } = useContext(MessagesContext);
  const { action, setAction } = useContext(ActionContext);

  const updateFilesMutation = useMutation(api.workspace.UpdateFiles);
  const updateTokensMutation = useMutation(api.users.UpdateToken);

  const { id } = useParams();
  const convex = useConvex();
  const [loading, setLoading] = useState(false);

  // Load workspace files on mount
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      setFiles({ ...Lookup.DEFAULT_FILE, ...(result?.fileData || {}) });
      setLoading(false);
    })();
  }, [id, convex]);

  // Trigger AI code gen when latest message is from user
  useEffect(() => {
    if (messages.length && messages.at(-1).role === "user") {
      generateAiCode();
    }
  }, [messages]);

  const generateAiCode = async () => {
    let aiResp = null;
    setLoading(true);
    try {
      const prompt = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      const { data } = await axios.post("/api/gen-ai-code", { prompt });
      aiResp = data;

      const merged = { ...Lookup.DEFAULT_FILE, ...(aiResp.files || {}) };
      if (aiResp.files?.["/App.js"]) {
        merged["/App.js"] = aiResp.files["/App.js"];
      }

      setFiles(merged);

      await updateFilesMutation({
        workspaceId: id,
        files: aiResp.files || {},
      });
    } catch (e) {
      console.error("Code generation error:", e);
      setFiles({
        "/App.js": {
          code: `// Error generating code. Please retry later.\nconsole.log("Error");`,
        },
      });
    } finally {
      if (aiResp) {
        const tokensUsed = countToken(JSON.stringify(aiResp));
        const tokenLeft = Number(userDetail?.token || 0) - tokensUsed;
        await updateTokensMutation({
          userId: userDetail?._id,
          token: tokenLeft,
        });
        setUserDetail((prev) => ({
          ...prev,
          token: tokenLeft,
        }));
      }
      setLoading(false);
    }
  };

  const onActionBtn = (type) => {
    setAction({
      actionType: type,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="relative">
      {/* Tabs and Buttons */}
      <div className="bg-[#181818] w-full p-2 border-b border-gray-800">
        <div className="flex items-center justify-center gap-3">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${
              activeTab === "code"
                ? "text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full"
                : "text-white"
            }`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${
              activeTab === "preview"
                ? "text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full"
                : "text-white"
            }`}
          >
            Preview
          </h2>
          <button
            onClick={() => onActionBtn("export")}
            className="text-sm text-white hover:text-blue-500 cursor-pointer p-1 px-2 rounded-full flex items-center gap-1 transition"
          >
            <LucideDownload className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={() => onActionBtn("deploy")}
            className="text-sm text-white hover:text-blue-500 cursor-pointer p-1 px-2 rounded-full flex items-center gap-1 transition"
          >
            <Rocket className="w-4 h-4" />
            Deploy
          </button>
        </div>
      </div>

      {/* Sandpack Code/Preview */}
      <SandpackProvider
        files={files}
        template="react"
        theme="dark"
        customSetup={{ dependencies: { ...Lookup.DEPENDANCY } }}
        options={{
          activeFile: "/App.js",
          externalResources: [
            "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
          ],
        }}
      >
        <SandpackLayout className="overflow-y-auto scrollbar-hide">
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <SandpackPreviewClient />
          )}
        </SandpackLayout>
      </SandpackProvider>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-50 rounded-lg">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white ml-2">Generating your files...</h2>
        </div>
      )}
    </div>
  );
};

export default CodeView;
