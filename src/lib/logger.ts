// Minimal structured logger. On Vercel, console output is captured into the
// function logs; emitting JSON keeps those lines queryable. This is the
// ephemeral observability layer (see src/lib/audit.ts for durable records).

type Level = "info" | "warn" | "error";

function emit(level: Level, msg: string, meta: Record<string, unknown> = {}) {
  // eslint-disable-next-line no-console
  console[level](
    JSON.stringify({ level, msg, ts: new Date().toISOString(), ...meta }),
  );
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => emit("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => emit("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) =>
    emit("error", msg, meta),
};
