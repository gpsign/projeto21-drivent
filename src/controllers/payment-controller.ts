import { Response } from 'express';
import httpStatus from 'http-status';
import { paymentService } from '@/services/payments-service';
import { AuthenticatedRequest } from '@/middlewares';
import { PaymentRequestBody } from '@/repositories/payments-repository';

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const payment = req.body as PaymentRequestBody & { userId: number };
  payment.userId = req.userId;
  const result = await paymentService.createPayment(payment);
  return res.status(httpStatus.OK).send(result);
}
