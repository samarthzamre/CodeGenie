"use client";
import { ActionContext } from "@/context/ActionContext";
import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import React, { useContext, useEffect, useRef } from "react";

const SandpackPreviewClient = () => {
  const previewRef = useRef(null);
  const { sandpack } = useSandpack();
  const { action } = useContext(ActionContext);

  useEffect(() => {
    if (!previewRef.current || !action?.actionType) return;

    const handleClientAction = async () => {
      try {
        const client = await previewRef.current?.getClient?.();
        if (!client) return;

        const result = await client.getCodeSandboxURL?.();
        if (!result) return;

        if (action.actionType === "deploy") {
          window.open(`https://${result?.sandboxId}.csb.app/`, "_blank");
        } else if (action.actionType === "export") {
          window.open(result?.editorUrl, "_blank");
        }
      } catch (err) {
        console.error("Sandpack client error:", err);
      }
    };

    handleClientAction();
  }, [action]);

  return (
    <div className="w-full">
      <SandpackPreview
        ref={previewRef}
        showNavigator
        style={{ height: "80vh", width: "100%" }}
        className="w-full"
      />
    </div>
  );
};

export default SandpackPreviewClient;
