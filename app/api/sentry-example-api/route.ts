import * as Sentry from "@sentry/nextjs";
import { connection } from "next/server";

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

/** Demo-only intentional throw; production returns 503 unless ?demo=1 */
export async function GET(request: Request) {
  await connection();
  const { searchParams } = new URL(request.url);
  const isDemoTrigger = searchParams.get("demo") === "1";

  if (!isDemoTrigger && process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "Sentry example disabled in production. Use ?demo=1 for demo trigger." },
      { status: 503 },
    );
  }

  Sentry.logger.info("Sentry example API called", { demo: isDemoTrigger });
  throw new SentryExampleAPIError(
    "This error is raised on the backend called by the example page.",
  );
}
