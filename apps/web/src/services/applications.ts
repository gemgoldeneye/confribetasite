export interface ApplicationPayload {
  name: string;
  location: string;
  email: string;
  phone: string;
  device: "iphone" | "android";
  vehicle: "motor" | "car" | "supercar" | "truck" | "bus";
  dream: string;
}

export interface ApplicationResult {
  success: true;
  referenceId: string;
  firstName: string;
}

// Phase F2 will swap this for a real API endpoint.
// The form contract (ApplicationPayload) does not change.
const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_URL ?? "";

export async function submitApplication(payload: ApplicationPayload): Promise<ApplicationResult> {
  if (!FORMSPREE_ENDPOINT) {
    // Dev stub: succeed immediately without a network call.
    await new Promise((r) => setTimeout(r, 800));
    return {
      success: true,
      referenceId: generateReferenceId(),
      firstName: payload.name.split(" ")[0] ?? payload.name,
    };
  }

  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Submission failed: ${res.status}`);

  return {
    success: true,
    referenceId: generateReferenceId(),
    firstName: payload.name.split(" ")[0] ?? payload.name,
  };
}

function generateReferenceId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "CF-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
