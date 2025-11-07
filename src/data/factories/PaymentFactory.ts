import { BaseEntityFactory } from './BaseEntityFactory'
import type { Payment } from '../../types/portal'
import { daysFromNow, daysAgo, todayISO } from '../../utils/demoDateHelpers'

/**
 * Factory for creating Payment test data.
 */
export class PaymentFactory extends BaseEntityFactory<Payment> {
  private descriptions = [
    'Monthly subscription',
    'Annual license fee',
    'Consulting services',
    'Software maintenance',
    'Cloud hosting',
    'Professional services',
    'Support package',
    'Training session',
    'Custom development',
    'Integration fee'
  ]

  private categories = [
    'Subscription',
    'Services',
    'Hosting',
    'Support',
    'Development',
    'Licensing',
    'Training',
    'Consulting'
  ]

  private paymentMethods = [
    'Credit Card',
    'Bank Transfer',
    'PayPal',
    'Wire Transfer',
    'ACH',
    'Check'
  ]

  create(overrides?: Partial<Payment>): Payment {
    const amount = Math.floor(Math.random() * 5000) + 100 // $100 - $5100

    return {
      id: overrides?.id || this.generateId(),
      description: overrides?.description || this.getRandomDescription(),
      amount: overrides?.amount ?? amount,
      dueDate: overrides?.dueDate || daysFromNow(30), // Dynamic: 30 days from today
      status: overrides?.status || 'pending',
      category: overrides?.category || this.getRandomCategory(),
      paidDate: overrides?.paidDate,
      paymentMethod: overrides?.paymentMethod,
      ...overrides
    }
  }

  protected getPrefix(): string {
    return 'pay'
  }

  createVariant(index: number, overrides?: Partial<Payment>): Payment {
    const statuses: Payment['status'][] = ['pending', 'paid', 'overdue']
    const status = statuses[index % statuses.length]
    const category = this.categories[index % this.categories.length]
    const amount = (index + 1) * 250 // $250, $500, $750, etc.

    return this.create({
      status,
      category,
      amount,
      ...overrides
    })
  }

  /**
   * Creates a paid payment
   */
  createPaid(overrides?: Partial<Payment>): Payment {
    return this.create({
      status: 'paid',
      paidDate: todayISO(), // Dynamic: today's date
      paymentMethod: this.getRandomPaymentMethod(),
      ...overrides
    })
  }

  /**
   * Creates an overdue payment
   */
  createOverdue(overrides?: Partial<Payment>): Payment {
    return this.create({
      status: 'overdue',
      dueDate: daysAgo(15), // Dynamic: 15 days ago
      ...overrides
    })
  }

  /**
   * Creates a pending payment
   */
  createPending(overrides?: Partial<Payment>): Payment {
    return this.create({
      status: 'pending',
      ...overrides
    })
  }

  /**
   * Creates a high-value payment (over $1000)
   */
  createHighValue(overrides?: Partial<Payment>): Payment {
    return this.create({
      amount: Math.floor(Math.random() * 9000) + 1000, // $1000 - $10000
      ...overrides
    })
  }

  private getRandomDescription(): string {
    return this.descriptions[Math.floor(Math.random() * this.descriptions.length)]
  }

  private getRandomCategory(): string {
    return this.categories[Math.floor(Math.random() * this.categories.length)]
  }

  private getRandomPaymentMethod(): string {
    return this.paymentMethods[Math.floor(Math.random() * this.paymentMethods.length)]
  }
}

/**
 * Singleton instance for convenient usage throughout the app
 */
export const paymentFactory = new PaymentFactory()
