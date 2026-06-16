import { buildAboutMd } from "@/lib/ai-files";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildAboutMd(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}
