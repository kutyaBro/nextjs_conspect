export const runtime = 'nodejs';
import { prisma } from "../../db/db" 
import { NextResponse } from 'next/server';

// GET all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST create a new order
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items } = body;
    
    // Validate input
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'User ID and at least one item are required' }, { status: 400 });
    }
    
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Fetch products to verify and calculate total
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });
    
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more products not found' }, { status: 404 });
    }
    
    // Create a map for quick product lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product;
    });
    
    // Calculate total and prepare order items
    let total = 0;
    const orderItems = items.map(item => {
      const product = productMap[item.productId];
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });
    
    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

