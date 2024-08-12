import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/models/messages";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnect()
    try {
        const {fromUser,toUser}=await req.json()
    
        const findSavedMessages=await MessageModel.findOne({toUser:fromUser,fromUser:toUser})
    
        if (!findSavedMessages) {
            return NextResponse.json({
                message:"no communication between this two parties"
            })
        }
    
        return NextResponse.json({
            success:true,
            message:"data recived success fully",
            data:findSavedMessages.message
        },{status:200})
    
    } catch (error:any) {
        console.error("Error in the receving message route:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
        }, { status: 400 });
    }
}