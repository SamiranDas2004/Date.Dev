import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req:NextResponse){
    await dbConnect()
try {
        const {email, id}=await req.json()
    
        const findID=await UserModel.findById(id)
    const findUser=await UserModel.findOne({email})
    
    if (!findUser) {
        return NextResponse.json({
            message:"User is not found"
        })
    }
        if (!findID) {
            return NextResponse.json({
                message:"no user found"
            },{
                status:400
            })
        }
    let likePeople=[...findUser.likeby]
        for(let i=0; i<likePeople.length;i++){
            if (id==likePeople[i]) {
                return NextResponse.json({
                    data:findID,findUser
                },{
                    status:200
                })
            }
        }
} catch (error:any) {
    console.error("Error in both matching route:", error);
    return NextResponse.json({
        success: false,
        message: "Something went wrong",
    }, { status: 400 });
}
} 