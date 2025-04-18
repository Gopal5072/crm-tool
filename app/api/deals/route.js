import { connectToDatabase } from '../../../lib/db';
import Deal from '../../../models/Deal';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const addedBy = searchParams.get('addedBy');
    const query = addedBy ? { addedBy } : {};
    const deals = await Deal.find(query).sort({ createdAt: -1 });
    return NextResponse.json(deals, { status: 200 });
  } catch (error) {
    console.error("GET /api/deals error:", error);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { companyName, pocs, stage, addedBy, comments } = await req.json();
    const newDeal = new Deal({
      companyName,
      pocs,
      stage,
      addedBy,
      comments,
    });
    const savedDeal = await newDeal.save();
    return NextResponse.json(savedDeal, { status: 201 });
  } catch (error) {
    console.error("POST /api/deals error:", error);
    return NextResponse.json({ error: "Failed to create a new deal" }, { status: 500 });
  }
}
