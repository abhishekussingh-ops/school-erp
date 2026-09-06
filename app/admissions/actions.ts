"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdmissions(subdomain = "greenwood") {
  const school = await prisma.school.findUnique({
    where: { subdomain },
    include: {
      admissions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return school?.admissions || [];
}

export async function createAdmission(
  data: {
    studentName: string;
    parentName: string;
    phone: string;
    grade: string;
    source?: string;
    status?: string;
  },
  subdomain = "greenwood"
) {
  const school = await prisma.school.findUnique({
    where: { subdomain },
  });

  if (!school) throw new Error("School not found");

  const newAdmission = await prisma.admission.create({
    data: {
      schoolId: school.id,
      studentName: data.studentName,
      parentName: data.parentName,
      phone: data.phone,
      grade: data.grade,
      source: data.source || "Walk-in",
      status: data.status || "New",
    },
  });

  revalidatePath("/admissions");
  return newAdmission;
}

export async function updateAdmissionStatus(id: string, status: string) {
  const updated = await prisma.admission.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admissions");
  return updated;
}