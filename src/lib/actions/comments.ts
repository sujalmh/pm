"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { createCommentSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

/** Parse @Name mentions from a comment body and return matched user IDs. */
async function extractMentionedUserIds(
  body: string,
  authorId: string
): Promise<string[]> {
  // Match @Word or @First Last patterns (e.g. @Alice or @Alice Smith)
  const mentions = body.match(/@[\w]+(?: [\w]+)*/g) ?? [];
  if (mentions.length === 0) return [];

  const names = mentions.map((m) => m.slice(1).trim()); // strip @

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: authorId } }, // don't notify the author
        {
          OR: names.flatMap((n) => [
            { name: { equals: n, mode: "insensitive" } },
            { name: { startsWith: n, mode: "insensitive" } },
          ]),
        },
      ],
    },
    select: { id: true },
  });

  return users.map((u) => u.id);
}

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
    include: { issue: { select: { title: true, issueKey: true } } },
  });

  // Create MENTIONED notifications
  const mentionedIds = await extractMentionedUserIds(
    parsed.data.body,
    sessionUser.id
  );

  if (mentionedIds.length > 0) {
    await prisma.notification.createMany({
      data: mentionedIds.map((userId) => ({
        userId,
        type: "MENTIONED" as const,
        message: `${sessionUser.name ?? "Someone"} mentioned you in a comment on "${comment.issue.title}" (${comment.issue.issueKey})`,
        issueId: parsed.data.issueId,
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/projects");
  return { success: true };
}

export async function deleteComment(id: string) {
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/projects");
}
