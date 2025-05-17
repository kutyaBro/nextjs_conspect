import { NextResponse } from 'next/server';
import { prisma } from '../../db/db';

export async function GET() {
  const discounts = await prisma.discount.findMany();
  return NextResponse.json(discounts);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newDiscount = await prisma.discount.create({ data });
  return NextResponse.json(newDiscount);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const updated = await prisma.discount.updateMany({ data });
  return NextResponse.json(updated);
}

export async function DELETE() {
  const deleted = await prisma.discount.deleteMany();
  return NextResponse.json(deleted);
}
