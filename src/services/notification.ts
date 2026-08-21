// ============================================================
// CampusCode — Notification Service
// ============================================================

import type { NotificationType } from '@/types';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
}

class NotificationService {
  async send(payload: NotificationPayload): Promise<{ id: string }> {
    // TODO: In production — write to DB + push via WebSocket / SSE / push notification
    console.log('[Notification]', payload.type, payload.title);
    return { id: `notif_${Date.now()}` };
  }

  async sendBulk(payloads: NotificationPayload[]): Promise<{ sent: number }> {
    for (const p of payloads) {
      await this.send(p);
    }
    return { sent: payloads.length };
  }

  async markRead(notificationId: string): Promise<boolean> {
    return true;
  }

  async markAllRead(userId: string): Promise<boolean> {
    return true;
  }

  // Notification factory helpers
  static proposalReceived(userId: string, proposalTitle: string, requestTitle: string): NotificationPayload {
    return {
      userId,
      type: 'proposal',
      title: 'New Proposal Received',
      message: `A new proposal "${proposalTitle}" was submitted for "${requestTitle}"`,
      link: '/proposals',
    };
  }

  static proposalAccepted(userId: string, requestTitle: string): NotificationPayload {
    return {
      userId,
      type: 'contract',
      title: 'Proposal Accepted!',
      message: `Your proposal for "${requestTitle}" has been accepted. A contract has been created.`,
      link: '/contracts',
    };
  }

  static paymentReceived(userId: string, amount: number, description: string): NotificationPayload {
    return {
      userId,
      type: 'payment',
      title: 'Payment Received',
      message: `You received ₹${amount.toLocaleString('en-IN')} for ${description}`,
      link: '/earnings',
    };
  }

  static newMessage(userId: string, senderName: string): NotificationPayload {
    return {
      userId,
      type: 'message',
      title: 'New Message',
      message: `${senderName} sent you a message`,
      link: '/messages',
    };
  }

  static productSold(userId: string, productName: string, buyerName: string): NotificationPayload {
    return {
      userId,
      type: 'purchase',
      title: 'Product Sold!',
      message: `${buyerName} purchased your product "${productName}"`,
      link: '/earnings',
    };
  }

  static matchFound(userId: string, requestTitle: string, score: number): NotificationPayload {
    return {
      userId,
      type: 'match',
      title: 'New Match Found',
      message: `A ${score}% match: "${requestTitle}" matches your skills`,
      link: '/solutions',
    };
  }
}

export const notificationService = new NotificationService();
