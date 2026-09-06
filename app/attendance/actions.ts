"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { classSections } from "@/lib/mock-data";

export async function getClassAttendance(
  classSectionId: string,
  dateStr: string,
  subdomain = "greenwood"
) {
  const school = await prisma.school.findUnique({
    where: { subdomain },
  });

  if (!school) return [];

  // 1. Find what Grade and Section this dropdown selection actually represents
  const matchedSection = classSections.find((c) => c.id === classSectionId);
  const targetGrade = matchedSection?.className; // e.g. "Grade 10"
  const targetSection = matchedSection?.section; // e.g. "A"

  // 2. Normalize "c1" -> "cs1", "c9" -> "cs9"
  const normalizedId =
    classSectionId.startsWith("c") && !classSectionId.startsWith("cs")
      ? classSectionId.replace(/^c(\d+)$/, "cs$1")
      : classSectionId;

  const targetDate = new Date(dateStr);

  // 3. Query students matching either the classSectionId OR the grade + section combination
  const orConditions: any[] = [
    { classSectionId: normalizedId },
    { classSectionId: classSectionId },
  ];

  if (targetGrade && targetSection) {
    orConditions.push({
      AND: [
        { grade: { equals: targetGrade, mode: "insensitive" } },
        { section: { equals: targetSection, mode: "insensitive" } },
      ],
    });
  }

  const students = await prisma.student.findMany({
    where: {
      schoolId: school.id,
      OR: orConditions,
    },
    include: {
      attendance: {
        where: {
          date: targetDate,
        },
      },
    },
    orderBy: { rollNumber: "asc" },
  });

  return students.map((s) => ({
    id: s.id,
    name: s.name,
    rollNo: s.rollNumber,
    classSectionId: s.classSectionId,
    avatar: s.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2),
    status: (s.attendance[0]?.status as "Present" | "Absent" | "Late" | "Half-day") || "Present",
  }));
}

export async function markClassAttendance(
  records: { studentId: string; status: string }[],
  dateStr: string,
  subdomain = "greenwood"
) {
  const school = await prisma.school.findUnique({ where: { subdomain } });
  if (!school) throw new Error("School not found");

  const targetDate = new Date(dateStr);

  await prisma.$transaction(
    records.map((r) =>
      prisma.attendanceRecord.upsert({
        where: {
          studentId_date: {
            studentId: r.studentId,
            date: targetDate,
          },
        },
        update: {
          status: r.status,
        },
        create: {
          schoolId: school.id,
          studentId: r.studentId,
          date: targetDate,
          status: r.status,
        },
      })
    )
  );

  revalidatePath("/attendance");
  return { success: true };
}