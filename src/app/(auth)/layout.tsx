export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Innovation Lab";

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col bg-gov-900 p-12 text-white">
        <div className="text-xl font-semibold">{appName}</div>
        <div className="flex-1 flex items-center">
          <blockquote className="space-y-2">
            <p className="text-lg text-gov-200">
              Built for the people who serve the public.
            </p>
            <footer className="text-sm text-gov-400">
              Friends Innovation Lab
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8 text-xl font-semibold">
            {appName}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
