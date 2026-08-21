// ============================================================
// CampusCode — Payments API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/payment';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...data } = body;

  switch (action) {
    case 'create_order': {
      const order = await paymentService.createOrder(data.amount, data.receipt);
      return NextResponse.json({ order, key: paymentService.getClientKey() });
    }
    case 'verify': {
      const result = await paymentService.verifyPayment(data.orderId, data.paymentId, data.signature);
      return NextResponse.json(result);
    }
    case 'refund': {
      const refund = await paymentService.refund(data.paymentId, data.amount);
      return NextResponse.json(refund);
    }
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
