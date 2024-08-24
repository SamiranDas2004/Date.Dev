import MatchesModel from "@/models/matches";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email } = await req.json();
console.log("email",email);

    // Find the user by email
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return NextResponse.json(
        {
          message: "No user found",
        },
        {
          status: 400,
        }
      );
    }
    // Find all matches where the user is liked by others
    const findMatches = await MatchesModel.find({ likeTO: findUser._id });
    if (!findMatches.length) {
      return NextResponse.json(
        {
          message: "No matches for this user",
        },
        {
          status: 200,
        }
      );
    }
console.log("data",findMatches);

    // Collect all users who liked the current user
    let showAllMatches = [];
    for (const match of findMatches) {
      const likedByUser = await UserModel.findById(match.likeBy);
      if (likedByUser) {
        showAllMatches.push(likedByUser);
      }
    }

    return NextResponse.json(
      {
        data: showAllMatches,
        user:findUser
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
