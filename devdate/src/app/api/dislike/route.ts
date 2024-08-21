import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
export async function POST(req: NextRequest) {
 await dbConnect();
  try {
    const { email, userId } = await req.json();

    const Id = userId;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid userId format",
        },
        { status: 400 }
      );
    }

    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid userId format",
        },
        { status: 400 }
      );
    }

    const objectId = new mongoose.Types.ObjectId(Id);

    if (!findUser.dislikeby) {
      findUser.dislikeby = [];
    }

    // Update dislikeby array
    if (!findUser.dislikeby.includes(objectId)) {
      findUser.dislikeby.push(objectId);
    }

    await findUser.save();

    return NextResponse.json({
      success: true,
      message: "User updated  successfully",
      data: findUser.dislikeby,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during updating the user",
      },
      { status: 500 }
    );
  }
}
