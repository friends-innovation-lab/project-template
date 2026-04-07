import { type IntakeFormData } from "@/lib/validations/intake";

interface ReviewStepProps {
  data: IntakeFormData;
}

export function ReviewStep({ data }: ReviewStepProps) {
  const sections = [
    {
      title: "Personal Information",
      fields: [
        { label: "Name", value: `${data.firstName} ${data.lastName}` },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
      ],
    },
    {
      title: "Service Information",
      fields: [
        { label: "Branch", value: data.branch },
        { label: "Years of Service", value: data.yearsOfService },
        { label: "Discharge Status", value: data.dischargeStatus },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-3 text-sm font-semibold text-gov-900">
            {section.title}
          </h3>
          <dl className="space-y-2 rounded-lg border border-gov-200 bg-white p-4">
            {section.fields.map((field) => (
              <div
                key={field.label}
                className="flex items-baseline justify-between gap-2"
              >
                <dt className="text-sm text-gov-400">{field.label}</dt>
                <dd className="text-sm font-medium text-gov-800">
                  {field.value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
