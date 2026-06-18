import Link from "next/link";
import { RootRedirect } from "./root-redirect";

export default function RootLandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <RootRedirect />
      <Link
        href="/en"
        className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-foreground/30"
      >
        Continue to BuilderPulse
      </Link>
    </main>
  );
}
