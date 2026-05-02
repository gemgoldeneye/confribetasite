import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitApplication, type ApplicationPayload, type ApplicationResult } from "../services/applications.js";

const VEHICLE_OPTIONS = [
  { value: "motor", label: "Motor" },
  { value: "car", label: "Car" },
  { value: "supercar", label: "Supercar" },
  { value: "truck", label: "Truck" },
  { value: "bus", label: "Bus" },
] as const;

const REQUIRED_FIELDS: (keyof ApplicationPayload)[] = [
  "name", "location", "email", "phone", "device", "vehicle", "dream",
];

export default function ApplicationForm() {
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationPayload>({ mode: "onBlur" });

  const watchedValues = watch();
  const filledCount = REQUIRED_FIELDS.filter((f) => {
    const v = watchedValues[f];
    return v !== undefined && v !== "" && v !== null;
  }).length;
  const progress = Math.round((filledCount / REQUIRED_FIELDS.length) * 100);

  const onSubmit = async (data: ApplicationPayload) => {
    setSubmitError(null);
    try {
      const res = await submitApplication(data);
      setResult(res);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  if (result) {
    return (
      <div className="text-center py-12 px-6">
        <div
          className="w-14 h-14 rounded-xl mx-auto mb-6 grid place-items-center"
          style={{ background: "color-mix(in srgb, var(--color-teal) 15%, transparent)", border: "1px solid var(--color-line-accent)" }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" stroke="var(--color-teal)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-h2 tracking-tight mb-2">
          Welcome aboard, {result.firstName}.
        </h3>
        <p className="text-body text-ink-mute mb-6">
          You're in the queue. We'll reach out when your beta spot opens.
        </p>
        <span
          className="inline-block font-mono text-lede tracking-widest px-5 py-2 rounded-md"
          style={{ background: "color-mix(in srgb, var(--color-ground) 60%, transparent)", border: "1px solid var(--color-line-subtle)" }}
        >
          {result.referenceId}
        </span>
        <p className="mt-3 text-small text-ink-soft">Save this reference number.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Progress bar */}
      <div className="h-0.5 rounded-full overflow-hidden mb-8" style={{ background: "var(--color-line-subtle)" }}>
        <div
          className="h-full rounded-full bg-gradient-brand transition-all duration-slow ease-standard"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Application completion"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <Field label="Full Name" error={errors.name?.message}>
          <input
            {...register("name", { required: "Required" })}
            placeholder="Alex Rodriguez"
            className={inputCn(!!errors.name)}
          />
        </Field>

        {/* Location */}
        <Field label="City, Region / Country" error={errors.location?.message}>
          <input
            {...register("location", { required: "Required" })}
            placeholder="Los Angeles, CA"
            className={inputCn(!!errors.location)}
          />
        </Field>

        {/* Email */}
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register("email", {
              required: "Required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
            placeholder="alex@example.com"
            className={inputCn(!!errors.email)}
          />
        </Field>

        {/* Phone */}
        <Field label="Phone" error={errors.phone?.message}>
          <input
            type="tel"
            {...register("phone", {
              required: "Required",
              minLength: { value: 7, message: "At least 7 digits" },
            })}
            placeholder="+1 555 000 0000"
            className={inputCn(!!errors.phone)}
          />
        </Field>
      </div>

      {/* Device */}
      <Field label="Your phone" error={errors.device?.message} className="mt-5">
        <div className="flex gap-3">
          {(["iphone", "android"] as const).map((opt) => (
            <label key={opt} className="flex-1">
              <input
                type="radio"
                value={opt}
                {...register("device", { required: "Required" })}
                className="sr-only peer"
              />
              <span className="peer-checked:bg-gradient-brand peer-checked:text-ink-on-accent peer-checked:border-transparent flex items-center justify-center py-2.5 rounded-md border border-line-strong text-ink-mute font-display font-semibold text-small cursor-pointer transition-all duration-fast ease-standard hover:border-line-accent capitalize">
                {opt === "iphone" ? "iPhone" : "Android"}
              </span>
            </label>
          ))}
        </div>
      </Field>

      {/* Vehicle */}
      <Field label="Your vehicle" error={errors.vehicle?.message} className="mt-5">
        <div className="flex flex-wrap gap-2">
          {VEHICLE_OPTIONS.map((opt) => (
            <label key={opt.value}>
              <input
                type="radio"
                value={opt.value}
                {...register("vehicle", { required: "Required" })}
                className="sr-only peer"
              />
              <span className="peer-checked:bg-gradient-brand peer-checked:text-ink-on-accent peer-checked:border-transparent inline-flex items-center px-4 py-2 rounded-pill border border-line-strong text-ink-mute font-display font-semibold text-small cursor-pointer transition-all duration-fast ease-standard hover:border-line-accent whitespace-nowrap">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </Field>

      {/* Dream */}
      <Field
        label="If you had a weekend convoy trip, where would you go and how many friends?"
        error={errors.dream?.message}
        className="mt-5"
      >
        <textarea
          {...register("dream", { required: "Required", minLength: { value: 10, message: "Tell us a bit more" } })}
          rows={3}
          placeholder="Pacific Coast Highway with 8 cars, sunrise start from San Francisco…"
          className={inputCn(!!errors.dream) + " resize-none leading-relaxed"}
        />
      </Field>

      {submitError && (
        <p className="mt-4 text-small text-warn">{submitError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-md bg-gradient-brand text-ink-on-accent font-display font-bold text-body shadow-cta transition-[transform,filter,opacity] duration-fast ease-standard hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin" viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2.5" strokeDasharray="38" strokeDashoffset="28" />
            </svg>
            Submitting…
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Apply for Beta Access
          </>
        )}
      </button>
    </form>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputCn(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-md font-body text-body text-ink placeholder:text-ink-soft",
    "bg-glass-wash border outline-none",
    "transition-[border-color,box-shadow] duration-fast ease-standard",
    "focus:border-line-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-cyan)_15%,transparent)]",
    hasError ? "border-warn" : "border-line-subtle hover:border-line-strong",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block font-display font-semibold text-small text-ink-mute mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-caption text-warn">{error}</p>}
    </div>
  );
}
