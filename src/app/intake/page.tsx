import { IntakeFlow } from "@/components/features/intake/intake-flow";

export const metadata = {
  title: "Veteran Intake",
  description: "Veteran services intake form",
};

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-gov-50">
      <IntakeFlow />
    </main>
  );
}
