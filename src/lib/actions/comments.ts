"use server";

import { prisma } from "@/lib/db";
import { createCommentSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function addComment(formData: FormData) {
  const raw = {
    issueId: formData.get("issueId"),
    body: formData.get("body"),
  };

  const parsed = createCommentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Use first manager as commenter — will be replaced with session user
  const user = await prisma.user.findFirst({ where: { role: "MANAGER" } });
  if (!user) return { error: "No user found" };

  await prisma.comment.create({
    data: {
      ...parsed.data,
      userId: user.id,
    },
  });

  revalidatePath("/projects");
  return { success: true };
}

export async function deleteComment(id: string) {
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/projects");
}
