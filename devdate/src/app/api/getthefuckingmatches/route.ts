import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnect()
   try {
     const {email}=await req.json()
 
     const findUSer=await UserModel.findOne({email})
 
     if (!findUSer) {
         return NextResponse.json({
             message:"user not found"
         },{
             status:400
         })
     }

     return NextResponse.json({
         data:findUSer.matches
     },{
         status:200
     })
   } catch (error:any) {
    console.log(error);
    return NextResponse.json({
        message:"something went wrong"
    },{
        status:400
    })
    
   }
}