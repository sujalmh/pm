"use server";

import { prisma } from "@/lib/db";
import { createCommentSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function addComment(formData: FormData) {
  const sessionUser = await requireAuth();

  const raw = {
    issueId: formData.get("issueId"),
    body: formData.get("body"),
  };

  const parsed = createCommentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const comment = await prisma.comment.create({
    data: {
      ...parsed.data,
      userId: sessionUser.id,
    },
  });

  // Parse @mentions (single-token handles like @username or @[Full Name])
  // Use explicit wrapped form @[...] for multi-word names to prevent greedy matches
  const mentionPattern = /@\[([^\]]+)\]|@(\w+)/g;
  const mentionedNames = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = mentionPattern.exec(parsed.data.body)) !== null) {
    const name = match[1] ?? match[2];
    if (name) mentionedNames.add(name);
  }

  if (mentionedNames.size > 0) {
    // Find mentioned users by exact name match, excluding the commenter
    const mentionedUsers = await prisma.user.findMany({
      where: {
        name: { in: Array.from(mentionedNames) },
        id: { not: sessionUser.id },
      },
      select: { id: true },
    });

    // Deduplicate by userId before inserting
    const uniqueUserIds = [...new Set(mentionedUsers.map((u) => u.id))];

    if (uniqueUserIds.length > 0) {
      await prisma.notification.createMany({
        data: uniqueUserIds.map((userId) => ({
          userId,
          issueId: comment.issueId,
          type: "MENTIONED" as const,
          message: `You were mentioned in a comment on issue ${parsed.data.issueId}`,
        })),
        skipDuplicates: true,
      });
    }
  }

  revalidatePath("/projects");
  return { success: true };
}

export async function deleteComment(id: string) {
  const sessionUser = await requireAuth();

  const comment = await prisma.comment.findUniqueOrThrow({ where: { id } });
  if (comment.userId !== sessionUser.id) {
    throw new Error("Not authorized");
  }

  await prisma.comment.delete({ where: { id } });
  revalidatePath("/projects");
}
