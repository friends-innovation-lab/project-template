import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Innovation Lab";

  return (
    <main className="min-h-screen bg-gov-50">
      <nav className="border-b border-gov-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <span className="text-lg font-semibold text-gov-900">
              {appName}
            </span>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/intake">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4">Veteran Services Portal</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gov-900 sm:text-5xl">
            {appName}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gov-500">
            Connecting veterans with the services and resources they need.
            Complete our intake form to get started.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/intake">Get Started</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-gov-200 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gov-600">
          Built by{" "}
          <a
            href="https://cityfriends.tech"
            className="font-medium text-gov-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Friends Innovation Lab
          </a>
        </div>
      </footer>
    </main>
  );
}
