import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, name } = body; // Unpacks parameter from inbound payload configurations

    // Parameter presence validation checks
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All required form fields must be completed." },
        { status: 400 }
      );
    }

    // Backend security guard: Refuse account instantiation if strings mismatch
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match. Please re-enter your password." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
