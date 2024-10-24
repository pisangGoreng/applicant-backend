import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://root:password@127.0.0.1:3306/nestjs_applicant?schema=public',
    },
  },
});

async function main() {
  // * Delete existing data
  await prisma.applicant.deleteMany({});
  await prisma.applicantRole.deleteMany({});
  await prisma.applicantStatus.deleteMany({});

  console.log('Existing data deleted....');

  // * Seed data for ApplicantRole table
  const roles = [
    { description: 'System Architect' },
    { description: 'Project Manager' },
    { description: 'Product Designer' },
    { description: 'QA Engineer' },
    { description: 'Data Engineer' },
    { description: 'Full Stack Developer' },
    { description: 'DevOps Engineer' },
    { description: 'Backend Engineer' },
    { description: 'Frontend Engineer' },
    { description: 'UX Designer' },
    { description: 'System Administrator' },
    { description: 'Data Scientist' },
    { description: 'Data Analyst' },
    { description: 'Software Developer' },
  ];
  for (const role of roles) {
    await prisma.applicantRole.create({ data: role });
  }

  // * Seed data for ApplicantStatus table
  const statusList = [
    { description: 'Candidate Rejected' },
    { description: 'Offer Accepted' },
    { description: 'Inteview Done' },
    { description: 'Applied' },
    { description: 'Contacted' },
    { description: 'Offer Rejected' },
    { description: 'Hired' },
    { description: 'Offer Made' },
    { description: 'Interview Scheduled' },
  ];
  for (const status of statusList) {
    await prisma.applicantStatus.create({ data: status });
  }

  const softwareEngineer = await prisma.applicantRole.upsert({
    where: { description: 'Software Engineer' },
    update: {},
    create: { description: 'Software Engineer' },
  });

  const pendingStatus = await prisma.applicantStatus.upsert({
    where: { description: 'Applied' },
    update: {},
    create: { description: 'Applied' },
  });

  // Seed Applicants
  const applicants = Array.from({ length: 10 }).map(() => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number({ style: 'national' }),
    yoe: faker.number.int({ min: 1, max: 10 }), // Years of experience between 1-10
    location: faker.address.city(),
    resumeLink: faker.internet.url(),
    applicantRoleId: softwareEngineer.id,
    applicantStatusId: pendingStatus.id,
  }));
  await prisma.applicant.createMany({ data: applicants });

  console.log(
    'Seeding completed: Applicant ,ApplicantRole and ApplicantStatus data added.',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
