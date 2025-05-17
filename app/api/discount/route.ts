import { prisma } from '../../db/db';
import { NextResponse } from 'next/server';

// GET all discounts
export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({
      select: {
        id: true,
        name: true,
        percentage: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(discounts);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

// POST create a new discount
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    const { name, percentage, active } = body;

    if (!name || typeof percentage !== 'number') {
      return NextResponse.json(
        { error: 'Name and numeric percentage are required' },
        { status: 400 }
      );
    }

    const discount = await prisma.discount.create({
      data: {
        name,
        percentage,
        active: active ?? true,
      },
    });

    return NextResponse.json(discount, { status: 201 });
  } catch (error: any) {
    console.error('Error creating discount:', error);
    return NextResponse.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}


