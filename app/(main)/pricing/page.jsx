"use client";
import PricingModel from "@/components/custom/PricingModel";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import React, { useContext } from "react";

const Pricing = () => {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div className="mt-2 flex flex-col items-center w-full p-10 md:px-32 lg:px-48">
      <h2 className="font-bold text-5xl">Pricing</h2>
      <p className="text-gray-400 max-w-xl text-center mt-4">
        {Lookup.PRICING_DESC}
      </p>
      <div className="p-5 rounded-xl w-full flex justify-between mt-7 items-center"
      style={{
        backgroundColor:Colors.BACKGROUND
      }}
      >
        <h2 className="text-white mt-5 text-lg">
          <span className="font-bold">{userDetail?.token ?? "Loading..."}</span>
          Token Left
        </h2>
        <div>
            <h2 className="font-medium">Need more token?</h2>
            <p>Upgrade your plan below</p>
        </div>
      </div>
      <PricingModel/>
    </div>
  );
};

export default Pricing;
