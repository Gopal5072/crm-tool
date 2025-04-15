import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@models/User'; // Assuming you have a User model
import { connectToDatabase } from '@lib/db';


export const POST = async (request) => {
  await connectToDatabase();

  try {
    const { fullName, username, password, confirmPassword, role } = await request.json();

    // Validate that password and confirm password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
};
