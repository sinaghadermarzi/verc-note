import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Durable, queryable record of meaningful actions ("who did what"). Each call
// also emits an observability log line, so #1 (logs) and #2 (audit table) stay
// in sync from a single call site.

export type AuditAction =
  | "auth.signin"
  | "auth.signup"
  | "auth.signout"
  | "note.create"
  | "note.update"
  | "note.delete";

export async function recordAudit(params: {
  action: AuditAction;
  userId?: string | null;
  targetId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  const { action, userId = null, targetId = null, meta } = params;

  logger.info(action, { userId, targetId, ...meta });

  // Best-effort: an audit-write failure must never break the user's action.
  try {
    await prisma.auditLog.create({ data: { action, userId, targetId } });
  } catch (error) {
    logger.error("audit.write_failed", { action, error: String(error) });
  }
}
