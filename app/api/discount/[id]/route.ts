import { NextResponse } from 'next/server';
import { prisma } from '../../../db/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const discount = await prisma.discount.findUnique({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(discount);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updated = await prisma.discount.update({
    where: { id: parseInt(params.id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const deleted = await prisma.discount.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(deleted);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const result = await prisma.discount.update({
    where: { id: parseInt(params.id) },
    data,
  });
  return NextResponse.json(result);
}
