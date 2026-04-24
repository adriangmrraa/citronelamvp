export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07120b] overflow-hidden">
      {/* Animated gradient orbs */}
      <div
        className="animate-blob pointer-events-none absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-lime-400/[0.06] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="animate-blob pointer-events-none absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-green-500/[0.04] blur-[100px]"
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div className="bg-grid-weed pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
