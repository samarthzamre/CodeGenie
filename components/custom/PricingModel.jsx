"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Lookup from '@/data/Lookup'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { useMutation } from 'convex/react';
import React, { useContext, useEffect, useState } from 'react'

const PricingModel = () => {

    const{userDetail,setUserDetail}=useContext(UserDetailContext);
    const[selectedOption,setSelectedOption]=useState();
    const UpdateToken=useMutation(api.users.UpdateToken)

    const onPaymentSuccess=async()=>{
      const token=userDetail?.token+Number(selectedOption?.value);
      console.log(token);
      await UpdateToken({
        token:token,
        userId:userDetail?._id
      })
    }
  return (
    <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
       {Lookup.PRICING_OPTIONS.map((pricing,index)=>{
        return(
            <div key={index} className='border p-5 rounded-xl flex flex-col gap-3'
            >
              <h2 className='font-bold text-2xl'>{pricing.name}</h2>
              <h2 className='font-medium text-lg'>{pricing.tokens} Tokens</h2>
              <p className='text-gray-400'>{pricing.desc}</p>
              <h2 className='font-bold text-4xl  text-center mt-6'>${pricing.price}</h2>
              {/* <button className='bg-white text-black font-bold py-2 rounded-3xl cursor-pointer'>Upgrade to {pricing.name}</button> */}
              <PayPalButtons 
              onClick={()=>setSelectedOption(pricing)}
              disabled={!userDetail}
              style={{ layout: "horizontal" }} 
              onApprove={()=>onPaymentSuccess()}
              onCancel={()=>console.log("Payment cancel")}
              createOrder={(data,actions)=>{
                return actions.order.create({
                    purchase_units:[
                        {
                            amount:{
                                value:pricing.price,
                                currency_code:'USD',
                            }
                        }
                    ]
                })
              }}
              />
            </div>
        )
       })}
    </div>
  )
}

export default PricingModel