import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    dbConnect()
try {
        const {gender}=await req.json()
    
        const findResult= await UserModel.find({gender})
    
        if (!findResult) {
            return NextResponse.json({
                success:false,
                message:"result not found",
            },{
                status:401
            })
        }
    
        if (findResult) {
            return NextResponse.json({
                success:true,
                message:"all userrs according to the gender",
                data:findResult
            },{
                status:200
            })
        }
} catch (error:any) {
    console.error("Error during login:", error);

    return NextResponse.json({
      success: false,
      message: "An error occurred during login"
   
    }, {
      status: 500
    });
}
}