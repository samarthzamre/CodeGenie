"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import SignInDialog from "./SignInDialog";

const Header = () => {
  const { userDetail } = useContext(UserDetailContext);
  const pathname = usePathname();
  const [openDialog, setOpenDialog] = useState(false);

  const isAuthenticated = userDetail?.email;
  const isHomePage = pathname === "/";

  if (!isHomePage) return null;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-gradient-to-b from-black/80 to-transparent border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-white font-bold text-lg">CodeGenie</span>
          </div>

          {/* Auth Buttons */}
          {!isAuthenticated && (
            <div className="flex gap-4">
              <button
                onClick={handleOpenDialog}
                className="px-4 py-2 text-white font-semibold border border-white/30 rounded-full hover:bg-white hover:text-black transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={handleOpenDialog}
                className="px-4 py-2 font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                style={{ backgroundColor: Colors.BLUE }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sign In Modal */}
      <SignInDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </>
  );
};

export default Header;
