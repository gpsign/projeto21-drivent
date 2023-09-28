import { Enrollment } from '@prisma/client';
import { prisma } from '@/config';

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findIdByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    select: { id: true },
  });
}

async function findWithTicketByUserId(userId: number) {
  return prisma.enrollment.findUnique({
    where: { userId },
    select: {
      id: true,
      birthday: true,
      cpf: true,
      name: true,
      phone: true,
      Ticket: { select: { TicketType: true, status: true } },
    },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;

export const enrollmentRepository = {
  findWithAddressByUserId,
  findIdByUserId,
  upsert,
  findWithTicketByUserId,
};
