import { prisma } from '../../../db/db';
import { NextResponse } from 'next/server';

// GET single discount
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const discount = await prisma.discount.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        percentage: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!discount) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }

    return NextResponse.json(discount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch discount' }, { status: 500 });
  }
}

// PUT update discount
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, percentage, active } = body;

    const existingDiscount = await prisma.discount.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDiscount) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (typeof percentage === 'number') updateData.percentage = percentage;
    if (typeof active === 'boolean') updateData.active = active;

    const updatedDiscount = await prisma.discount.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        percentage: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedDiscount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

// DELETE discount
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existingDiscount = await prisma.discount.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDiscount) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }

    await prisma.discount.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
}
