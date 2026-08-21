// ============================================================
// CampusCode — Payment Service (Razorpay Mock Abstraction)
// ============================================================

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
}

export interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
  verified: boolean;
}

export interface PayoutRequest {
  userId: string;
  amount: number;
  accountId: string;
  status: 'queued' | 'processing' | 'processed' | 'failed';
}

class PaymentService {
  private isLive = false;

  constructor() {
    this.isLive = !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;
  }

  async createOrder(amount: number, receipt: string): Promise<PaymentOrder> {
    if (this.isLive) {
      // TODO: Call Razorpay API
      // const razorpay = new Razorpay({ key_id, key_secret });
      // return razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt });
    }

    // Mock implementation
    return {
      id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount,
      currency: 'INR',
      receipt,
      status: 'created',
    };
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<PaymentVerification> {
    if (this.isLive) {
      // TODO: Verify Razorpay signature using crypto
    }

    return {
      orderId,
      paymentId,
      signature,
      verified: true,
    };
  }

  async createPayout(userId: string, amount: number, accountId: string): Promise<PayoutRequest> {
    if (this.isLive) {
      // TODO: Call Razorpay Payout API
    }

    return {
      userId,
      amount,
      accountId,
      status: 'processed',
    };
  }

  async refund(paymentId: string, amount: number): Promise<{ id: string; status: string }> {
    return {
      id: `rfnd_${Date.now()}`,
      status: 'processed',
    };
  }

  getClientKey(): string {
    return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key';
  }
}

export const paymentService = new PaymentService();
