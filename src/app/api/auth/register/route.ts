import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/db";
import User from "../../../../../models/user.model";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email is already present",
        },
        { status: 400 }
      );
    }

    await User.create({
      email,
      password,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "Email registered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      {
        error: "Failed to register user",
      },
      { status: 501 }
    );
  }
}
