"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  intakeFormSchema,
  personalInfoSchema,
  serviceInfoSchema,
  type IntakeFormData,
} from "@/lib/validations/intake";
import { PersonalInfoStep } from "./personal-info-step";
import { ServiceInfoStep } from "./service-info-step";
import { ReviewStep } from "./review-step";
import { SuccessScreen } from "./success-screen";
import { LandingScreen } from "./landing-screen";

const STEPS = [
  { label: "Personal Info", number: 1 },
  { label: "Service Info", number: 2 },
  { label: "Review", number: 3 },
];

type Screen = "landing" | "form" | "success";

export function IntakeFlow() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      branch: "",
      yearsOfService: "",
      dischargeStatus: "",
    },
    mode: "onTouched",
  });

  const stepSchemas = [personalInfoSchema, serviceInfoSchema];

  async function handleNext() {
    if (currentStep < 2) {
      const schema = stepSchemas[currentStep];
      const fields = Object.keys(schema.shape) as (keyof IntakeFormData)[];
      const isValid = await form.trigger(fields);
      if (isValid) setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  function handleSubmit() {
    form.handleSubmit(() => {
      setScreen("success");
    })();
  }

  if (screen === "landing") {
    return <LandingScreen onStart={() => setScreen("form")} />;
  }

  if (screen === "success") {
    return (
      <SuccessScreen
        data={form.getValues()}
        onReset={() => {
          form.reset();
          setCurrentStep(0);
          setScreen("landing");
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-16">
      {/* Step indicator */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <li key={step.number} className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  i <= currentStep
                    ? "bg-fftc-yellow text-fftc-black"
                    : "bg-gov-200 text-gov-400"
                }`}
              >
                {step.number}
              </span>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  i <= currentStep ? "text-gov-800" : "text-gov-400"
                }`}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 hidden h-px w-8 sm:block ${
                    i < currentStep ? "bg-fftc-yellow" : "bg-gov-200"
                  }`}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <Card className="border-gov-200 bg-gov-50 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg text-gov-900">
              {STEPS[currentStep].label}
            </CardTitle>
            <Badge>Step {currentStep + 1} of 3</Badge>
          </div>
          <CardDescription className="text-gov-400">
            {currentStep === 0 && "Tell us about yourself so we can reach you."}
            {currentStep === 1 && "Share your military service background."}
            {currentStep === 2 && "Review your information before submitting."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {currentStep === 0 && <PersonalInfoStep form={form} />}
          {currentStep === 1 && <ServiceInfoStep form={form} />}
          {currentStep === 2 && <ReviewStep data={form.getValues()} />}
        </CardContent>

        <CardFooter className="flex justify-between gap-3 border-t border-gov-200 pt-6">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {currentStep < 2 ? (
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Application</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
