"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import React, { useContext, useState } from "react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Hero = () => {
  const [userInput, setUserInput] = useState();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);

  const router = useRouter();

  const onGenerate = async (input) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    if (userDetail?.token < 10) {
      toast("You don't have enough token!");
      return;
    }

    const msg = {
      role: "user",
      content: input,
    };

    setMessages(msg);

    const workspaceId = await CreateWorkspace({
      user: userDetail._id,
      messages: [msg],
    });

    router.push("/workspace/" + workspaceId);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c]"
    >
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <h2 className="font-bold text-4xl text-white text-center leading-tight">
          {Lookup.HERO_HEADING}
        </h2>
        <p className="text-gray-400 font-medium text-center leading-relaxed">
          {Lookup.HERO_DESC}
        </p>

        {/* Prompt Input Box */}
        <div
          className="p-5 rounded-xl w-full shadow-xl border border-gray-800 backdrop-blur-md bg-white/5"
        >
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              onChange={(event) => setUserInput(event.target.value)}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none text-white placeholder-gray-400"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-600 hover:bg-blue-700 transition text-white p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="h-5 w-5 text-gray-500 mt-2" />
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {Lookup?.SUGGSTIONS.map((suggestion, index) => (
            <h2
              onClick={() => onGenerate(suggestion)}
              className="p-1 px-3 border border-gray-600 rounded-full text-sm text-gray-400 hover:text-white hover:border-white cursor-pointer transition"
              key={index}
            >
              {suggestion}
            </h2>
          ))}
        </div>

        <SignInDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </div>
    </div>
  );
};

export default Hero;
