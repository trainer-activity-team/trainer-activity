import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is missing. Please define it before running the seed.',
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function ensureRole(name: string) {
  const existing = await prisma.role.findFirst({ where: { name } });
  if (!existing) {
    await prisma.role.create({ data: { name } });
  }
}

async function ensureStatus(name: string) {
  const existing = await prisma.status.findFirst({ where: { name } });
  if (!existing) {
    await prisma.status.create({ data: { name } });
  }
}

async function ensurePricingMode(name: string) {
  const existing = await prisma.pricingMode.findFirst({ where: { name } });
  if (!existing) {
    await prisma.pricingMode.create({ data: { name } });
  }
}

async function ensureInterventionType(name: string) {
  const existing = await prisma.interventionType.findFirst({ where: { name } });
  if (!existing) {
    await prisma.interventionType.create({ data: { name } });
  }
}

async function ensureTimescale(name: string) {
  const existing = await prisma.timescale.findFirst({ where: { name } });
  if (!existing) {
    await prisma.timescale.create({ data: { name } });
  }
}

async function ensureSubject(name: string) {
  const existing = await prisma.subject.findFirst({ where: { name } });
  if (!existing) {
    await prisma.subject.create({ data: { name } });
  }
}

async function ensureInstitution(
  name: string,
  address: string,
  requiresDeclaration: boolean,
) {
  const existing = await prisma.institution.findFirst({ where: { name } });
  if (!existing) {
    await prisma.institution.create({
      data: { name, address, requiresDeclaration },
    });
  }
}

async function ensureUser(
  email: string,
  password: string,
  roleId: number,
  firstName: string,
  lastName: string,
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: { email, password, roleId, firstName, lastName },
    });
  }
}

async function ensureClass(
  name: string,
  institutionId: number,
  classLevel: string,
  studentCount: number,
  teacherId: number,
) {
  const existing = await prisma.class.findFirst({ where: { name } });
  if (!existing) {
    await prisma.class.create({
      data: { name, institutionId, classLevel, studentCount, teacherId },
    });
  }
}

async function ensureContract(
  contractNumber: string,
  institutionId: number,
  pricingModeId: number,
  startDate: Date,
  endDate: Date,
  hourlyVolumePlanned: number,
  unitPrice: number,
) {
  const existing = await prisma.contract.findFirst({ where: { contractNumber } });
  if (!existing) {
    await prisma.contract.create({
      data: {
        contractNumber,
        institutionId,
        pricingModeId,
        startDate,
        endDate,
        hourlyVolumePlanned,
        unitPrice,
      },
    });
  }
}

async function ensureInvoice(
  invoiceNumber: string,
  invoiceDate: Date,
  paymentDate: Date | null,
  status: string,
) {
  const existing = await prisma.invoice.findFirst({ where: { invoiceNumber } });
  if (!existing) {
    await prisma.invoice.create({
      data: { invoiceNumber, invoiceDate, paymentDate, status },
    });
  }
}

async function ensureIntervention(
  subjectId: number,
  classId: number,
  institutionId: number,
  contractId: number,
  statusId: number,
  userId: number,
  interventionTypeId: number,
  timescaleId: number,
  date: Date,
  start: Date,
  end: Date,
  invoiceId?: number,
) {
  const existing = await prisma.intervention.findFirst({
    where: { classId, userId, date, start, end },
  });
  if (!existing) {
    await prisma.intervention.create({
      data: {
        subjectId,
        classId,
        institutionId,
        contractId,
        statusId,
        userId,
        interventionTypeId,
        timescaleId,
        date,
        start,
        end,
        invoiceId,
      },
    });
  }
}

async function main() {
  const roles = ['intervenant'];

  const statuses = [
    'finished',
    'planned',
    'pending',
    'canceled',
    'declared',
    'charges',
    'settles',
  ];

  const pricingModes = ['prix horarire', 'demi journee', 'journee', 'forfait'];

  const interventionTypes = [
    'course',
    'judge',
    'conference',
    'meeting',
    'admission',
    'seminar',
    'workshop',
    'bootcamp',
    'coaching',
  ];

  const timescales = [
    'year_1',
    'year_2',
    'demi_1',
    'demi_2',
    'tier_1',
    'tier_2',
    'tier_3',
    'quart_1',
    'quart_2',
    'quart_3',
    'quart_4',
  ];

  const subjects = ['Mathematiques', 'Francais', 'Informatique'];

  for (const name of roles) {
    await ensureRole(name);
  }

  for (const name of statuses) {
    await ensureStatus(name);
  }

  for (const name of pricingModes) {
    await ensurePricingMode(name);
  }

  for (const name of interventionTypes) {
    await ensureInterventionType(name);
  }

  for (const name of timescales) {
    await ensureTimescale(name);
  }

  for (const name of subjects) {
    await ensureSubject(name);
  }

  await ensureInstitution(
    'Lycée Victor Hugo',
    '10 rue de la Republique, Paris',
    true,
  );

  const role = await prisma.role.findFirst({ where: { name: 'intervenant' } });
  const institution = await prisma.institution.findFirst({
    where: { name: 'Lycée Victor Hugo' },
  });

  if (!role || !institution) {
    throw new Error('Unable to seed user dependencies (role/institution).');
  }

  await ensureUser(
    'alice.dupont@trainer-activity.local',
    'seed-password-change-me',
    role.id,
    'Alice',
    'Dupont',
  );

  const teacher = await prisma.user.findUnique({
    where: { email: 'alice.dupont@trainer-activity.local' },
  });

  if (!teacher) {
    throw new Error('Unable to seed class dependency (teacher).');
  }

  await ensureClass('BTS SIO 1', institution.id, 'BTS', 28, teacher.id);

  const pricingMode = await prisma.pricingMode.findFirst({
    where: { name: 'prix horarire' },
  });
  if (!pricingMode) {
    throw new Error('Unable to seed contract dependency (pricing mode).');
  }

  await ensureContract(
    'CTR-2026-001',
    institution.id,
    pricingMode.id,
    new Date('2026-01-01'),
    new Date('2026-12-31'),
    120,
    75,
  );

  await ensureInvoice(
    'INV-2026-001',
    new Date('2026-02-10'),
    new Date('2026-03-05'),
    'paid',
  );

  const subject = await prisma.subject.findFirst({
    where: { name: 'Informatique' },
  });
  const classItem = await prisma.class.findFirst({ where: { name: 'BTS SIO 1' } });
  const contract = await prisma.contract.findFirst({
    where: { contractNumber: 'CTR-2026-001' },
  });
  const status = await prisma.status.findFirst({ where: { name: 'planned' } });
  const interventionType = await prisma.interventionType.findFirst({
    where: { name: 'course' },
  });
  const timescale = await prisma.timescale.findFirst({ where: { name: 'year_1' } });
  const invoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: 'INV-2026-001' },
  });

  if (
    !subject ||
    !classItem ||
    !contract ||
    !status ||
    !interventionType ||
    !timescale
  ) {
    throw new Error('Unable to seed intervention dependencies.');
  }

  await ensureIntervention(
    subject.id,
    classItem.id,
    institution.id,
    contract.id,
    status.id,
    teacher.id,
    interventionType.id,
    timescale.id,
    new Date('2026-02-12'),
    new Date('1970-01-01T09:00:00.000Z'),
    new Date('1970-01-01T12:00:00.000Z'),
    invoice?.id,
  );
}

void main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
