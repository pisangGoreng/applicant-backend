import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://root:password@127.0.0.1:3306/nestjs_applicant?schema=public',
    },
  },
});

async function main() {
  // Delete existing data
  await prisma.applicantRole.deleteMany({});
  await prisma.applicantStatus.deleteMany({});

  console.log('Existing data deleted....');

  // * Seed data for Applicant_Role table
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

  // * Seed data for Applicant_Status table
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

  for (const role of roles) {
    await prisma.applicantRole.create({ data: role });
  }

  for (const status of statusList) {
    await prisma.applicantStatus.create({ data: status });
  }

  console.log(
    'Seeding completed: ApplicantRole and ApplicantStatus data added.',
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
