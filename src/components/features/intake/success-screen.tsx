import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type IntakeFormData } from "@/lib/validations/intake";

interface SuccessScreenProps {
  data: IntakeFormData;
  onReset: () => void;
}

export function SuccessScreen({ data, onReset }: SuccessScreenProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4">
      <Card className="w-full border-gov-200 bg-gov-50 text-center shadow-card">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
            <svg
              className="h-6 w-6 text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <CardTitle className="text-xl text-gov-900">
            Application Submitted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gov-500">
            Thank you, {data.firstName}. Your veteran intake form has been
            received. A member of our team will reach out to you at{" "}
            <span className="font-medium text-gov-800">{data.email}</span>{" "}
            within 2 business days.
          </p>
          <Badge variant="success">Submitted Successfully</Badge>
        </CardContent>
        <CardFooter className="justify-center border-t border-gov-200 pt-6">
          <Button variant="ghost" onClick={onReset}>
            Start New Application
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
