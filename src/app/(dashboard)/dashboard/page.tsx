import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to your project dashboard."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["Metric 1", "Metric 2", "Metric 3", "Metric 4"].map((metric) => (
          <Card key={metric}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">&mdash;</div>
              <p className="text-xs text-muted-foreground">
                Replace with real data
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
