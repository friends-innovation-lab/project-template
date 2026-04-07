"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <Badge variant="info" className="mb-4">
        Veteran Services
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight text-gov-900 sm:text-4xl">
        Veteran Intake Form
      </h1>
      <p className="mt-4 text-base leading-7 text-gov-500">
        Welcome to the Innovation Lab veteran services portal. This short form
        collects your personal and service information so we can connect you
        with the right resources.
      </p>
      <Button size="lg" onClick={onStart} className="mt-8">
        Get Started
      </Button>
      <p className="mt-4 text-xs text-gov-400">
        Takes approximately 2 minutes to complete
      </p>
    </div>
  );
}
