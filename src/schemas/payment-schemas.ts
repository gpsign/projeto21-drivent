import Joi from 'joi';
import { CardData, PaymentRequestBody } from '@/repositories/payments-repository';

export const createPaymentSchema = Joi.object<PaymentRequestBody>({
  ticketId: Joi.number().required(),
  cardData: Joi.object<CardData>({
    cvv: Joi.number().required(),
    expirationDate: Joi.string().required(),
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
  }).required(),
});
