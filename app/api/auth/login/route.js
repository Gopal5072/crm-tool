// app/api/auth/login/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';
import { connectToDatabase } from '../../../../lib/db';

export const POST = async (request) => {
  await connectToDatabase();

  try {
    const { username, password } = await request.json();

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      token,
      role: user.role,
      fullName: user.fullName, // ✅ Include full name
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};
