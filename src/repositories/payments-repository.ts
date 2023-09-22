import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function insertPayment(payment: CreatePayment) {
  return prisma.payment.create({ data: payment });
}

export type CreatePayment = Omit<Payment, 'id' | 'createdAt'>;
export type IncompleteCreatePayment = Omit<CreatePayment, 'updatedAt'>;

export type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};
export type PaymentRequestBody = {
  ticketId: number;
  cardData: CardData;
};

export const paymentRepository = {
  insertPayment,
};
