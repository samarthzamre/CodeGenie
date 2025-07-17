"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { useSidebar } from "@/context/SidebarContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export const countToken = (inputText) => {
  return inputText.trim().split(/\s+/).filter(Boolean).length;
};

const ChatView = () => {
  const { id } = useParams();
  const convex = useConvex();

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const updateMessages = useMutation(api.workspace.updateMessages);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const { toggleSideBar } = useSidebar();

  useEffect(() => {
    if (id) GetWorkspaceData();
  }, [id]);

  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0 && messages.at(-1)?.role === "user") {
      GetAiResponse();
    }
  }, [messages]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(Array.isArray(result?.messages) ? result.messages : []);
  };

  const GetAiResponse = async () => {
    try {
      setLoading(true);
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const response = await axios.post("/api/ai-chat", { prompt: PROMPT });
      const aiResp = {
        role: "ai",
        content: response.data.result,
      };

      const updatedMessages = [...messages, aiResp];
      setMessages(updatedMessages);

      await updateMessages({
        messages: updatedMessages,
        workspaceId: id,
      });

      const tokenLeft = Number(userDetail?.token) - countToken(JSON.stringify(aiResp));
  
      setUserDetail(prev=>({
        ...prev,
        token:tokenLeft
      }));

      // ✅ update database
      await UpdateTokens({
        userId: userDetail?._id,
        token: tokenLeft,
      });

      // ✅ update context so Pricing page shows updated token
      setUserDetail((prev) => ({
        ...prev,
        token: tokenLeft,
      }));
    } catch (error) {
      console.error("AI Response Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = (input) => {
    if(userDetail?.token<10){
      toast("You don't have enough token!")
      return ;
    }
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[88vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide px-5">
        {Array.isArray(messages) ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
              style={{ backgroundColor: Colors.BACKGROUND }}
            >
              {msg.role === "user" && userDetail?.picture && (
                <Image
                  src={userDetail.picture}
                  alt="userImage"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-red-400 mt-5">
            Too many users right now. Please try again shortly.
          </div>
        )}
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-center"
            style={{ backgroundColor: Colors.BACKGROUND }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating Response...</h2>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="relative max-w-xl w-full mt-3">
        {userDetail?.picture && (
          <div className="absolute -bottom-0 -left-7">
            <Image
              src={userDetail.picture}
              alt="user"
              width={25}
              height={25}
              className="rounded-full cursor-pointer"
              onClick={toggleSideBar}
            />
          </div>
        )}
        <div
          className="p-5 border-2 rounded-xl w-full"
          style={{ backgroundColor: Colors.BACKGROUND }}
        >
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              onChange={(e) => setUserInput(e.target.value)}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
              value={userInput}
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
