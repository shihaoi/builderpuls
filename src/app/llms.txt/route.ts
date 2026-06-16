import { buildLlmsTxt } from "@/lib/ai-files";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
