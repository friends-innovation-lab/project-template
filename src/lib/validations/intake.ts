import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

export const serviceInfoSchema = z.object({
  branch: z.string().min(1, "Branch of service is required"),
  yearsOfService: z.string().min(1, "Years of service is required"),
  dischargeStatus: z.string().min(1, "Discharge status is required"),
});

export const intakeFormSchema = personalInfoSchema.merge(serviceInfoSchema);

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ServiceInfo = z.infer<typeof serviceInfoSchema>;
export type IntakeFormData = z.infer<typeof intakeFormSchema>;
