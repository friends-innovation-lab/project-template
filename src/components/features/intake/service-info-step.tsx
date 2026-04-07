import { type UseFormReturn } from "react-hook-form";
import { type IntakeFormData } from "@/lib/validations/intake";
import { FormField } from "./form-field";

interface ServiceInfoStepProps {
  form: UseFormReturn<IntakeFormData>;
}

export function ServiceInfoStep({ form }: ServiceInfoStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <FormField
        label="Branch of Service"
        id="branch"
        placeholder="e.g. Army, Navy, Air Force, Marines"
        error={errors.branch}
        registration={register("branch")}
      />
      <FormField
        label="Years of Service"
        id="yearsOfService"
        placeholder="e.g. 4"
        error={errors.yearsOfService}
        registration={register("yearsOfService")}
      />
      <FormField
        label="Discharge Status"
        id="dischargeStatus"
        placeholder="e.g. Honorable, General, Medical"
        error={errors.dischargeStatus}
        registration={register("dischargeStatus")}
      />
    </div>
  );
}
