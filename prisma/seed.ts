import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with explicit classSectionId...");

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "School" CASCADE;`);

  const school = await prisma.school.create({
    data: {
      name: "Greenwood International School",
      subdomain: "greenwood",
      users: {
        create: [
          {
            name: "Admin Office",
            email: "admin@greenwood.edu",
            role: "ADMIN",
          },
          {
            name: "Sunita Rao",
            email: "sunita.rao@greenwood.edu",
            role: "TEACHER",
          },
        ],
      },
      admissions: {
        create: [
          {
            studentName: "Devansh Patel",
            parentName: "Sanjay Patel",
            phone: "+91 9123456780",
            grade: "Grade 8",
            status: "INQUIRY",
          },
        ],
      },
    },
  });

  const studentList = [
    // cs1 -> Grade 6 A
    { name: "Arjun Nair", rollNumber: "GW-06-001", grade: "Grade 6", section: "A", classSectionId: "cs1", gender: "Male", status: "Present" },
    { name: "Ananya Iyer", rollNumber: "GW-06-002", grade: "Grade 6", section: "A", classSectionId: "cs1", gender: "Female", status: "Absent" },
    { name: "Saanvi Patel", rollNumber: "GW-06-003", grade: "Grade 6", section: "A", classSectionId: "cs1", gender: "Female", status: "Present" },

    // cs2 -> Grade 6 B
    { name: "Aditya Singh", rollNumber: "GW-06B-001", grade: "Grade 6", section: "B", classSectionId: "cs2", gender: "Male", status: "Present" },
    { name: "Ishaan Rao", rollNumber: "GW-06B-002", grade: "Grade 6", section: "B", classSectionId: "cs2", gender: "Male", status: "Late" },

    // cs9 -> Grade 10 A
    { name: "Kabir Mehta", rollNumber: "GW-10-001", grade: "Grade 10", section: "A", classSectionId: "cs9", gender: "Male", status: "Present" },
    { name: "Riya Sen", rollNumber: "GW-10-002", grade: "Grade 10", section: "A", classSectionId: "cs9", gender: "Female", status: "Present" },
    { name: "Sanya Malhotra", rollNumber: "GW-10-003", grade: "Grade 10", section: "A", gender: "Female", classSectionId: "cs9", status: "Absent" },
  ];

  const today = new Date("2026-09-06");

  for (const s of studentList) {
    await prisma.student.create({
      data: {
        schoolId: school.id,
        name: s.name,
        rollNumber: s.rollNumber,
        grade: s.grade,
        section: s.section,
        classSectionId: s.classSectionId,
        gender: s.gender,
        fees: {
          create: [
            {
              schoolId: school.id,
              title: "Tuition Fee Q1",
              amount: 15000.0,
              dueDate: new Date("2026-10-15"),
              status: "PENDING",
            },
          ],
        },
        attendance: {
          create: [
            {
              schoolId: school.id,
              date: today,
              status: s.status,
            },
          ],
        },
      },
    });
  }

  console.log("Seeded successfully with explicit classSectionId!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });