"use client";
import { useSidebar } from "@/context/SidebarContext";
import { MessageCircleCode } from "lucide-react";
import Image from "next/image";
import React from "react";
import WorkspaceHistory from "./WorkspaceHistory";
import SideBarFooter from "./SideBarFooter";

const AppSideBar = () => {
  const { isSidebarOpen } = useSidebar();
  if (!isSidebarOpen) return null;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-5 flex items-center gap-2 border-b border-gray-800">
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <h1 className="text-lg font-semibold">My App</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:shadow-md transition">
          <MessageCircleCode className="h-5 w-5" />
          Start New Chat
        </button>
      </div>

      {/* Scrollable Middle */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-2">
        <WorkspaceHistory />
      </div>

      {/* Fixed Footer */}
      <div className="border-t border-gray-800">
        <SideBarFooter className="py-4" />
      </div>
    </div>
  );
};

export default AppSideBar;
