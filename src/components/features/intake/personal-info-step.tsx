import { type UseFormReturn } from "react-hook-form";
import { type IntakeFormData } from "@/lib/validations/intake";
import { FormField } from "./form-field";

interface PersonalInfoStepProps {
  form: UseFormReturn<IntakeFormData>;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="First Name"
          id="firstName"
          placeholder="John"
          error={errors.firstName}
          registration={register("firstName")}
        />
        <FormField
          label="Last Name"
          id="lastName"
          placeholder="Doe"
          error={errors.lastName}
          registration={register("lastName")}
        />
      </div>
      <FormField
        label="Email Address"
        id="email"
        type="email"
        placeholder="john.doe@example.com"
        error={errors.email}
        registration={register("email")}
      />
      <FormField
        label="Phone Number"
        id="phone"
        type="tel"
        placeholder="(555) 123-4567"
        error={errors.phone}
        registration={register("phone")}
      />
    </div>
  );
}
