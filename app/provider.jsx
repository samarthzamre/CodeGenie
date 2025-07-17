"use client";
import AppSideBar from "@/components/custom/AppSideBar";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { api } from "@/convex/_generated/api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import React, { useEffect, useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ActionContext } from "@/context/ActionContext";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/custom/Header";

const Provider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const [action, setAction] = useState();
  const convex = useConvex();
  const router = useRouter();
  const pathname = usePathname(); // ✅ detect route

  useEffect(() => {
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    if (typeof window !== "undefined") {
      const userRaw = localStorage.getItem("user");
      let user = null;
      try {
        user = JSON.parse(userRaw);
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
      }

      if (user?.email) {
        const result = await convex.query(api.users.GetUser, {
          email: user.email,
        });
        setUserDetail(result);
      }

      if (!user || !user.email) {
        setUserDetail(null);
        router.push("/");
        return;
      }
    }
  };

  return (
    <div className="bg-black text-white h-screen overflow-hidden">
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
      >
        <PayPalScriptProvider
          options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
        >
          <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <MessagesContext.Provider value={{ messages, setMessages }}>
              <ActionContext.Provider value={{ action, setAction }}>
                <SidebarProvider>
                  {userDetail?.email ? (
                    // ✅ Show full app when authenticated
                    <div className="flex h-full">
                      <AppSideBar />
                      <main className="flex-1 overflow-y-auto p-4 bg-zinc-950">
                        {children}
                      </main>
                    </div>
                  ) : (
                    // ✅ Show landing layout when not authenticated
                    <main className="flex-1 overflow-y-auto bg-zinc-950">
                      {pathname === "/" && <Header />} {/* ✅ Show only on home */}
                      {children}
                    </main>
                  )}
                </SidebarProvider>
              </ActionContext.Provider>
            </MessagesContext.Provider>
          </UserDetailContext.Provider>
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Provider;
