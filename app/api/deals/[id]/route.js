import { connectToDatabase } from '../../../../lib/db';
import Deal from '../../../../models/Deal';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// PUT — Update deal
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const updatedFields = await req.json();

    // Avoid updating immutable fields
    delete updatedFields._id;
    delete updatedFields.createdAt;

    const updatedDeal = await Deal.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

// DELETE — Delete deal
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deletedDeal = await Deal.findByIdAndDelete(id);

    if (!deletedDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }
}
