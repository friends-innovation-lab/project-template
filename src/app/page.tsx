import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Project Name</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Your project description goes here. This template includes Next.js, TypeScript, Tailwind
          CSS, and shadcn/ui.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </main>
  )
}
