import { prisma } from "./prisma";
import type { AuditAction, AuditEntity } from "@prisma/client";

export async function writeAuditLog(args: {
  entity: AuditEntity;
  action: AuditAction;
  actor: string;
  summary: string;
  href?: string;
  clerkUserId?: string;
}) {
  const adminUser = args.clerkUserId
    ? await prisma.adminUser.upsert({
        where: { clerkId: args.clerkUserId },
        create: { clerkId: args.clerkUserId },
        update: {},
      })
    : null;

  await prisma.auditLog.create({
    data: {
      entity: args.entity,
      action: args.action,
      actor: args.actor,
      summary: args.summary,
      href: args.href,
      adminUserId: adminUser?.id,
    },
  });
}
