import { type FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  id: string;
  error?: FieldError;
  placeholder?: string;
  type?: string;
  registration: object;
}

export function FormField({
  label,
  id,
  error,
  placeholder,
  type = "text",
  registration,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-gov-800">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={error ? "border-error focus-visible:ring-error" : ""}
        {...registration}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
