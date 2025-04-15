// app/api/auth/register/route.js

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  const { fullName, username, password, confirmPassword, role, founderCode } = body;

  if (password !== confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
  }

  // 🔐 Check founderCode only if role is Founder
  if (role === "Founder") {
    if (!founderCode || founderCode !== process.env.FOUNDER_SECRET_CODE) {
      return NextResponse.json({ message: "Invalid founder code" }, { status: 403 });
    }
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return NextResponse.json({ message: "Username already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    fullName,
    username,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
}
