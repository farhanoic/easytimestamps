/**
 * Billing Service
 * Infrastructure for payment processing and subscription management
 */

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

class BillingService {
  async createPaymentIntent(_planId: string, _userId: string): Promise<PaymentIntent> {
    // Mock implementation
    return {
      id: `pi_mock_${Date.now()}`,
      clientSecret: 'pi_mock_secret',
      amount: 999,
      currency: 'usd',
      status: 'requires_confirmation'
    };
  }

  async getPaymentMethods(_userId: string): Promise<PaymentMethod[]> {
    // Mock implementation
    return [
      {
        id: 'pm_mock_1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        isDefault: true
      }
    ];
  }

  async startTrial(_userId: string, _planId: string): Promise<{ trialEndsAt: string }> {
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    return { trialEndsAt };
  }
}

export const billingService = new BillingService();