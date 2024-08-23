import dbConnect from "@/lib/dbConnect";
import MatchesModel from "@/models/matches";
import UserModel from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  await dbConnect();

  try {
    const { email, id } = await req.json();

    // Find the user by email and the target user by ID
    const findUser = await UserModel.findOne({ email });
    const findID = await UserModel.findById(id);

    if (!findUser) {
      return NextResponse.json({
        message: "User is not found",
      });
    }

    if (!findID) {
      return NextResponse.json(
        {
          message: "No user found",
        },
        {
          status: 400,
        }
      );
    }

    // Check if the liked user is in the likeBy array
    let likePeople = [...findUser.likeby];
    for (let i = 0; i < likePeople.length; i++) {
      if (id == likePeople[i].toString()) {
        // Save the match in MatchesModel
        const newMatch = new MatchesModel({
          likeBy: findUser._id,
          likeTO: findID._id,
        });
        await newMatch.save();

        return NextResponse.json(
          {
            message: "Match saved successfully",
            match: newMatch,
          },
          {
            status: 200,
          }
        );
      }
    }

    return NextResponse.json(
      {
        message: "No match found in likeBy array",
      },
      {
        status: 400,
      }
    );
  } catch (error: any) {
    console.error("Error in both matching route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 400 }
    );
  }
}