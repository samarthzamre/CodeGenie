"use client";
import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

const options = [
  { name: "Settings", icon: Settings },
  { name: "Help Center", icon: HelpCircle },
  { name: "My Subscription", icon: Wallet, path: "/pricing" },
  { name: "Sign Out", icon: LogOut },
];

export default function SideBarFooter({ className = "" }) {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);

  const onOptionClick = (option) => {
    if (option?.path) {
      router.push(option.path);
    } else if (option.name === "Sign Out") {
      // ✅ Sign-out logic
      localStorage.removeItem("user");          // Clear localStorage
      setUserDetail(null);                      // Clear context state
      router.push("/");                         // Redirect to home
    } else {
      console.log(`Clicked on: ${option.name}`);
    }
  };

  return (
    <div className={`px-4 py-2 ${className}`}>
      {options.map((opt, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-2 py-2 hover:bg-gray-900 rounded cursor-pointer"
          onClick={() => onOptionClick(opt)}
        >
          <opt.icon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{opt.name}</span>
        </div>
      ))}
    </div>
  );
}
