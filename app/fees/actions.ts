"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFees(subdomain = "greenwood") {
  const school = await prisma.school.findUnique({
    where: { subdomain },
    include: {
      fees: {
        include: {
          student: true,
        },
        orderBy: { dueDate: "asc" },
      },
    },
  });

  return school?.fees ?? [];
}

export async function recordPayment(feeId: string) {
  const updated = await prisma.feeRecord.update({
    where: { id: feeId },
    data: { status: "PAID" },
  });

  revalidatePath("/fees");
  return updated;
}

export async function submitFeePayment(feeId: string, _mode: string) {
  const updated = await prisma.feeRecord.update({
    where: { id: feeId },
    data: {
      status: "PAID",
    },
  });

  revalidatePath("/fees");
  return updated;
}