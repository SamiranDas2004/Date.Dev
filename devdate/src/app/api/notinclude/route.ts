import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { email, data } = await req.json();
    
    // Debugging logs
    console.log('Received email:', email);
    console.log('Received data:', data);
    console.log('Type of data:', typeof data);
    console.log('Is data an object:', data && typeof data === 'object');

    // Check if data is an object and has an array property
    if (data && typeof data === 'object' && Array.isArray(data.users)) {
      data = data.users; // Extract the array
    } else if (!Array.isArray(data)) {
      return NextResponse.json({
        success: false,
        message: "Invalid data format. Expected an array.",
      }, {
        status: 400,
      });
    }

    await dbConnect(); // Ensure database connection

    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      }, {
        status: 404,
      });
    }

    const notIncludeThis = findUser.dislikeby || [];
    const result: any[] = [];

    data.forEach((element: { _id: string }) => {
      if (!notIncludeThis.includes(element._id)) {
        result.push(element);
      }
    });

    console.log('Filtered result:', result);

    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: result,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in notinclude:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
