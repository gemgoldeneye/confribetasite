import { useState } from "react";
import { useForm, type SubmitErrorHandler } from "react-hook-form";
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
  const [shakingFields, setShakingFields] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<ApplicationPayload>({ mode: "onBlur" });

  // Progress bar: count non-empty required fields
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

  const onInvalid: SubmitErrorHandler<ApplicationPayload> = (errs) => {
    // Shake every invalid field
    const keys = Object.keys(errs);
    setShakingFields(new Set(keys));
    setTimeout(() => setShakingFields(new Set()), 400);

    // Scroll the first errored field into view
    const firstKey = keys[0];
    if (firstKey) {
      document
        .querySelector<HTMLElement>(`[name="${firstKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (result) {
    return (
      <div className="animate-fade-up-in text-center py-12 px-6">
        <div
          className="w-14 h-14 rounded-xl mx-auto mb-6 grid place-items-center"
          style={{
            background: "color-mix(in srgb, var(--color-teal) 15%, transparent)",
            border: "1px solid var(--color-line-accent)",
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <polyline
              points="20 6 9 17 4 12"
              stroke="var(--color-teal)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="font-display font-bold text-h2 tracking-tight mb-2">
          Welcome aboard, {result.firstName}.
        </h3>
        <p className="text-body text-ink-mute mb-8">
          You're in the queue. We'll reach out when your beta spot opens.
        </p>

        <div
          className="inline-block px-6 py-3 rounded-md"
          style={{
            background: "color-mix(in srgb, var(--color-ground) 80%, transparent)",
            border: "1px solid var(--color-line-subtle)",
          }}
        >
          <p className="text-caption text-ink-soft mb-1 tracking-widest uppercase">Reference</p>
          <span className="font-mono text-h2 tracking-[0.15em] text-ink">
            {result.referenceId}
          </span>
        </div>

        <p className="mt-4 text-small text-ink-soft">
          Save this — you'll need it if you contact us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate aria-label="Beta application">
      {/* Progress bar — 2px, brand gradient, fills as fields complete */}
      <div
        className="rounded-full overflow-hidden mb-8"
        style={{ height: "2px", background: "var(--color-line-subtle)" }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-gradient-brand transition-all duration-slow ease-standard"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="sr-only" role="status">
        Application {progress}% complete
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          id="name"
          label="Full Name"
          error={errors.name?.message}
          shake={shakingFields.has("name")}
          submitCount={submitCount}
        >
          <input
            {...register("name", { required: "Required" })}
            id="name"
            placeholder="Alex Rodriguez"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputCn(!!errors.name)}
          />
        </Field>

        <Field
          id="location"
          label="City, Region / Country"
          error={errors.location?.message}
          shake={shakingFields.has("location")}
          submitCount={submitCount}
        >
          <input
            {...register("location", { required: "Required" })}
            id="location"
            placeholder="Los Angeles, CA"
            autoComplete="off"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "location-error" : undefined}
            className={inputCn(!!errors.location)}
          />
        </Field>

        <Field
          id="email"
          label="Email"
          error={errors.email?.message}
          shake={shakingFields.has("email")}
          submitCount={submitCount}
        >
          <input
            type="email"
            {...register("email", {
              required: "Required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
            id="email"
            placeholder="alex@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputCn(!!errors.email)}
          />
        </Field>

        <Field
          id="phone"
          label="Phone"
          error={errors.phone?.message}
          shake={shakingFields.has("phone")}
          submitCount={submitCount}
        >
          <input
            type="tel"
            {...register("phone", {
              required: "Required",
              minLength: { value: 7, message: "At least 7 digits" },
            })}
            id="phone"
            placeholder="+1 555 000 0000"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={inputCn(!!errors.phone)}
          />
        </Field>
      </div>

      {/* Device — segmented control */}
      <Field
        id="device"
        label="Your phone"
        error={errors.device?.message}
        shake={shakingFields.has("device")}
        submitCount={submitCount}
        className="mt-5"
      >
        <div className="flex gap-3" role="group" aria-label="Select your phone type">
          {(["iphone", "android"] as const).map((opt) => (
            <label key={opt} className="flex-1 cursor-pointer">
              <input
                type="radio"
                value={opt}
                {...register("device", { required: "Required" })}
                aria-invalid={!!errors.device}
                className="sr-only peer"
              />
              <span
                className={[
                  "flex items-center justify-center py-3 rounded-md border font-display font-semibold text-small",
                  "transition-[background,border-color,color] duration-fast ease-standard",
                  "peer-checked:bg-gradient-brand peer-checked:text-ink-on-accent peer-checked:border-transparent",
                  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan",
                  errors.device
                    ? "border-warn text-ink-mute hover:border-warn"
                    : "border-line-strong text-ink-mute hover:border-line-accent",
                ].join(" ")}
              >
                {opt === "iphone" ? "iPhone" : "Android"}
              </span>
            </label>
          ))}
        </div>
      </Field>

      {/* Vehicle — pill grid */}
      <Field
        id="vehicle"
        label="Your vehicle"
        error={errors.vehicle?.message}
        shake={shakingFields.has("vehicle")}
        submitCount={submitCount}
        className="mt-5"
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select your vehicle type">
          {VEHICLE_OPTIONS.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                value={opt.value}
                {...register("vehicle", { required: "Required" })}
                aria-invalid={!!errors.vehicle}
                className="sr-only peer"
              />
              <span
                className={[
                  "inline-flex items-center px-4 py-2 rounded-pill border font-display font-semibold text-small whitespace-nowrap",
                  "transition-[background,border-color,color] duration-fast ease-standard",
                  "peer-checked:bg-gradient-brand peer-checked:text-ink-on-accent peer-checked:border-transparent",
                  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan",
                  errors.vehicle
                    ? "border-warn text-ink-mute"
                    : "border-line-strong text-ink-mute hover:border-line-accent",
                ].join(" ")}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </Field>

      {/* Dream */}
      <Field
        id="dream"
        label="If you had a weekend convoy trip, where would you go and how many friends?"
        error={errors.dream?.message}
        shake={shakingFields.has("dream")}
        submitCount={submitCount}
        className="mt-5"
      >
        <textarea
          {...register("dream", {
            required: "Required",
            minLength: { value: 10, message: "Tell us a bit more" },
          })}
          id="dream"
          rows={3}
          placeholder="Pacific Coast Highway with 8 cars, sunrise start from San Francisco…"
          aria-invalid={!!errors.dream}
          aria-describedby={errors.dream ? "dream-error" : undefined}
          className={inputCn(!!errors.dream) + " resize-none leading-relaxed"}
        />
      </Field>

      {/* Network / server error */}
      {submitError && (
        <p className="mt-4 text-small text-warn animate-fade-up-in" role="alert">
          {submitError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-md bg-gradient-brand text-ink-on-accent font-display font-bold text-body shadow-cta transition-[transform,filter,opacity] duration-fast ease-standard hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin"
              viewBox="0 0 20 20"
              width="18"
              height="18"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="10" cy="10" r="7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="38"
                strokeDashoffset="28"
              />
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
    hasError
      ? "border-warn hover:border-warn"
      : "border-line-subtle hover:border-line-strong",
  ].join(" ");
}

function Field({
  id,
  label,
  error,
  children,
  className = "",
  shake = false,
  submitCount = 0,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  shake?: boolean;
  submitCount?: number;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-display font-semibold text-small text-ink-mute mb-1.5">
        {label}
      </label>
      {/*
        key changes with submitCount when shake=true, so React remounts the
        wrapper and restarts the CSS animation on every failed submission.
      */}
      <div key={shake ? submitCount : "stable"} className={shake ? "animate-shake" : ""}>
        {children}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-caption text-warn animate-fade-up-in"
        >
          {error}
        </p>
      )}
    </div>
  );
}
