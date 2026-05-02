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

const DASHBOARD_URL = import.meta.env.PUBLIC_DASHBOARD_URL ?? "";
const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_URL ?? "";

export async function submitApplication(payload: ApplicationPayload): Promise<ApplicationResult> {
  const referenceId = generateReferenceId();
  const firstName = payload.name.split(" ")[0] ?? payload.name;

  if (DASHBOARD_URL) {
    const res = await fetch(`${DASHBOARD_URL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, referenceId }),
    });
    if (!res.ok) throw new Error(`Dashboard submission failed: ${res.status}`);
    return { success: true, referenceId, firstName };
  }

  if (FORMSPREE_ENDPOINT) {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Submission failed: ${res.status}`);
    return { success: true, referenceId, firstName };
  }

  // Dev stub — no endpoint configured.
  await new Promise((r) => setTimeout(r, 800));
  return { success: true, referenceId, firstName };
}

function generateReferenceId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "CF-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
