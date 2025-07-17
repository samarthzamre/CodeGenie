"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Lookup from "@/data/Lookup";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useMutation } from "convex/react";
import React, { useContext } from "react";
import uuid4 from "uuid4";
import { LogIn, X } from "lucide-react"; 

const SignInDialog = ({ openDialog, setOpenDialog }) => {
  const { setUserDetail } = useContext(UserDetailContext);
  const createUser = useMutation(api.users.createUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: "Bearer " + tokenResponse?.access_token,
          },
        }
      );

      const user = userInfo.data;

      await createUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        uid: uuid4(),
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
      }

      setUserDetail(user);
      setOpenDialog(false);
    },
    onError: (errorResponse) => console.log("Google Login Error:", errorResponse),
  });

  if (!openDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-[#1f1f1f] text-white rounded-2xl w-full max-w-md p-8 shadow-2xl border border-white/10 relative transition-all duration-300 ease-out scale-100">

        {/* Close Button */}
        <button
          onClick={() => setOpenDialog(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center mb-2">
          {Lookup.SIGNIN_HEADING || "Welcome Back!"}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-center mb-6 text-sm">
          {Lookup.SIGNIN_SUBHEADING || "Sign in to continue using CodeGenie"}
        </p>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <button
            onClick={googleLogin}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 focus:outline-none active:scale-100
            cursor-pointer"
          >
            <LogIn className="h-5 w-5"/>
            Sign in with Google
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-gray-500 text-xs text-center mt-6">
          {Lookup.SIGNIn_AGREEMENT_TEXT ||
            "By continuing, you agree to our Terms and Privacy Policy."}
        </p>
      </div>
    </div>
  );
};

export default SignInDialog;
