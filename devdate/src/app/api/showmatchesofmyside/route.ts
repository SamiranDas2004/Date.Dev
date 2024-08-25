import dbConnect from "@/lib/dbConnect"; // Ensure this is correctly implemented
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure database connection
  try {
    const { id, email } = await req.json();

    if (!id || !email) {
      return NextResponse.json(
        { message: "ID and email are required" },
        { status: 400 }
      );
    }

    const findId = await UserModel.findById(id);
    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return NextResponse.json({ message: "No user found with this email" }, { status: 400 });
    }

    if (!findId) {
      return NextResponse.json({ message: "No user found with this ID" }, { status: 400 });
    }

    // Push the photo from the found user's photos array to the matches array
    if (findId.photos.length > 0) {
      findUser.matches.push(findId.photos[0]);
      await findUser.save(); // Save changes to the database
    } else {
      return NextResponse.json({ message: "No photos found for the provided ID" }, { status: 400 });
    }

    return NextResponse.json({
      message: "Match added successfully",
      data: findUser.matches,
    }, { status: 200 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}