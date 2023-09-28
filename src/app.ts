import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { handleApplicationErrors } from '@/middlewares';
import {
  usersRouter,
  authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
  ticketsRouter,
  paymentsRouter,
  hotelsRouter,
} from '@/routers';
import { loadEnv, connectDb, disconnectDB } from '@/config';
// import { paymentService } from './services/payments-service';
// import { PaymentRequestBody } from './repositories';

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/event', eventsRouter)
  .use('/enrollments', enrollmentsRouter)
  .use('/tickets', ticketsRouter)
  .use('/payments', paymentsRouter)
  .use('/hotels', hotelsRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

// (async () => {
//   const pay: PaymentRequestBody & { userId: number } = {
//     cardData: {
//       cvv: 999,
//       expirationDate: new Date('2023-09-23'),
//       issuer: 'MASTER',
//       name: 'Gabriel',
//       number: 12312321,
//     },
//   };
//   await paymentService.createPayment();
// })();

export default app;
