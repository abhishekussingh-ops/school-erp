import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "School" CASCADE;`);

  const school = await prisma.school.create({
    data: {
      name: "Greenwood International School",
      subdomain: "greenwood",
      users: {
        create: [
          {
            name: "School Administrator",
            email: "admin@greenwood.edu",
            role: "ADMIN",
          },
        ],
      },
      admissions: {
        create: [
          {
            studentName: "Aarav Sharma",
            parentName: "Rajesh Sharma",
            phone: "+91 9876543210",
            grade: "Grade 6",
            status: "INQUIRY",
          },
          {
            studentName: "Ananya Patel",
            parentName: "Suresh Patel",
            phone: "+91 9876543211",
            grade: "Grade 8",
            status: "SCHEDULED",
          },
        ],
      },
    },
  });

  console.log(`Database seeded for school: ${school.name} (ID: ${school.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });