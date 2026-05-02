import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");
mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(join(DATA_DIR, "applications.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_id TEXT    NOT NULL,
    name         TEXT    NOT NULL,
    email        TEXT    NOT NULL,
    phone        TEXT    NOT NULL DEFAULT '',
    location     TEXT    NOT NULL DEFAULT '',
    device       TEXT    NOT NULL DEFAULT '',
    vehicle      TEXT    NOT NULL DEFAULT '',
    dream        TEXT    NOT NULL DEFAULT '',
    submitted_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  )
`);

// ── Types ──────────────────────────────────────────────────────────────────

interface Application {
  id: number;
  reference_id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  device: string;
  vehicle: string;
  dream: string;
  submitted_at: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const VEHICLE_LABEL: Record<string, string> = {
  motor: "Motorcycle", car: "Car", supercar: "Supercar", truck: "Truck", bus: "Bus",
};
const DEVICE_LABEL: Record<string, string> = { iphone: "iPhone", android: "Android" };

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function vehicleEmoji(v: string) {
  return { motor: "🏍️", car: "🚗", supercar: "🏎️", truck: "🚛", bus: "🚌" }[v] ?? "🚗";
}

// ── Dashboard HTML ─────────────────────────────────────────────────────────

function renderDashboard(rows: Application[]) {
  const total = rows.length;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = rows.filter((r) => r.submitted_at.startsWith(today)).length;
  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
  const weekCount = rows.filter((r) => r.submitted_at >= weekAgo).length;

  const vehicleCounts: Record<string, number> = {};
  rows.forEach((r) => { vehicleCounts[r.vehicle] = (vehicleCounts[r.vehicle] ?? 0) + 1; });
  const topVehicle = Object.entries(vehicleCounts).sort((a, b) => b[1] - a[1])[0];

  const tableRows = rows.map((r) => `
    <tr>
      <td class="mono mute">${esc(r.reference_id)}</td>
      <td><strong>${esc(r.name)}</strong></td>
      <td class="mute">${esc(r.email)}</td>
      <td class="mute">${esc(r.phone || "—")}</td>
      <td class="mute">${esc(r.location || "—")}</td>
      <td>${(DEVICE_LABEL[r.device] ?? esc(r.device)) || "—"}</td>
      <td>${vehicleEmoji(r.vehicle)} ${(VEHICLE_LABEL[r.vehicle] ?? esc(r.vehicle)) || "—"}</td>
      <td class="dream mute">${esc(r.dream || "—")}</td>
      <td class="mute small">${fmtDate(r.submitted_at)}</td>
    </tr>`).join("");

  const emptyState = `
    <tr>
      <td colspan="9" class="empty">No applications yet. Share the site to get your first beta sign-ups.</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>ConvoyFriends — Beta Dashboard</title>
  <meta http-equiv="refresh" content="30"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:      #050B16;
      --surface: #0A1628;
      --elevated:#0F1E36;
      --cyan:    #3DD9F5;
      --teal:    #2BC4A8;
      --amber:   #F2B26B;
      --ink:     #F5F8FF;
      --mute:    #9AA8C2;
      --soft:    #6B7891;
      --line:    rgba(255,255,255,0.08);
      --line-strong: rgba(255,255,255,0.14);
    }
    body { background: var(--bg); color: var(--ink); font-family: system-ui, -apple-system, sans-serif; font-size: 14px; min-height: 100vh; }

    /* ── Header ── */
    header { background: var(--surface); border-bottom: 1px solid var(--line-strong); padding: 0 32px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-mark { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--cyan), var(--teal)); display: grid; place-items: center; font-size: 16px; }
    .brand-name { font-weight: 700; font-size: 15px; letter-spacing: -0.01em; }
    .brand-name span { color: var(--mute); font-weight: 400; margin-left: 6px; font-size: 13px; }
    .refresh-note { font-size: 12px; color: var(--soft); }

    /* ── Layout ── */
    main { max-width: 1280px; margin: 0 auto; padding: 32px 32px 64px; }

    /* ── Stats ── */
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .stat { background: var(--surface); border: 1px solid var(--line-strong); border-radius: 14px; padding: 20px 24px; }
    .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--soft); margin-bottom: 8px; }
    .stat-value { font-size: 34px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
    .stat-value.cyan { color: var(--cyan); }
    .stat-value.teal { color: var(--teal); }
    .stat-value.amber { color: var(--amber); }
    .stat-sub { font-size: 12px; color: var(--soft); margin-top: 6px; }

    /* ── Section header ── */
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .section-title { font-size: 13px; font-weight: 600; color: var(--mute); text-transform: uppercase; letter-spacing: 0.06em; }
    .export-btn { background: var(--elevated); border: 1px solid var(--line-strong); color: var(--mute); font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 6px; cursor: pointer; text-decoration: none; transition: color 0.15s; }
    .export-btn:hover { color: var(--ink); }

    /* ── Table ── */
    .table-wrap { background: var(--surface); border: 1px solid var(--line-strong); border-radius: 16px; overflow: hidden; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: var(--elevated); padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--soft); border-bottom: 1px solid var(--line-strong); white-space: nowrap; }
    tbody tr { border-bottom: 1px solid var(--line); transition: background 0.1s; }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: rgba(255,255,255,0.025); }
    td { padding: 13px 16px; vertical-align: middle; white-space: nowrap; }
    td.dream { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    td.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; letter-spacing: 0.04em; }
    td.small { font-size: 12px; }
    td.mute { color: var(--mute); }
    td strong { color: var(--ink); font-weight: 600; }
    td.empty { text-align: center; color: var(--soft); padding: 48px 16px; font-size: 14px; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      main { padding: 20px 16px 48px; }
      header { padding: 0 16px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-mark">👑</div>
      <span class="brand-name">ConvoyFriends <span>Beta Dashboard</span></span>
    </div>
    <span class="refresh-note">Auto-refreshes every 30s</span>
  </header>

  <main>
    <div class="stats">
      <div class="stat">
        <div class="stat-label">Total applications</div>
        <div class="stat-value cyan">${total}</div>
        <div class="stat-sub">All time</div>
      </div>
      <div class="stat">
        <div class="stat-label">This week</div>
        <div class="stat-value teal">${weekCount}</div>
        <div class="stat-sub">Last 7 days</div>
      </div>
      <div class="stat">
        <div class="stat-label">Today</div>
        <div class="stat-value">${todayCount}</div>
        <div class="stat-sub">${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Top vehicle</div>
        <div class="stat-value amber">${topVehicle ? vehicleEmoji(topVehicle[0]) : "—"}</div>
        <div class="stat-sub">${topVehicle ? `${VEHICLE_LABEL[topVehicle[0]] ?? topVehicle[0]} · ${topVehicle[1]} applicant${topVehicle[1] !== 1 ? "s" : ""}` : "No data yet"}</div>
      </div>
    </div>

    <div class="section-header">
      <span class="section-title">Applications (${total})</span>
      <a href="/api/export" class="export-btn" download="applications.csv">Export CSV</a>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ref</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Device</th>
            <th>Vehicle</th>
            <th>Dream route</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? tableRows : emptyState}
        </tbody>
      </table>
    </div>
  </main>
</body>
</html>`;
}

// ── App ────────────────────────────────────────────────────────────────────

const app = new Hono();

app.use("*", cors({ origin: "*" }));

app.get("/", (c) => {
  const rows = db.prepare("SELECT * FROM applications ORDER BY submitted_at DESC").all() as Application[];
  return c.html(renderDashboard(rows));
});

app.post("/api/submit", async (c) => {
  const body = await c.req.json() as Record<string, string>;
  db.prepare(`
    INSERT INTO applications (reference_id, name, email, phone, location, device, vehicle, dream)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.referenceId ?? "",
    body.name ?? "",
    body.email ?? "",
    body.phone ?? "",
    body.location ?? "",
    body.device ?? "",
    body.vehicle ?? "",
    body.dream ?? "",
  );
  return c.json({ ok: true });
});

app.get("/api/submissions", (c) => {
  const rows = db.prepare("SELECT * FROM applications ORDER BY submitted_at DESC").all() as Application[];
  return c.json(rows);
});

app.get("/api/export", (c) => {
  const rows = db.prepare("SELECT * FROM applications ORDER BY submitted_at DESC").all() as Application[];
  const headers = ["reference_id", "name", "email", "phone", "location", "device", "vehicle", "dream", "submitted_at"];
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h as keyof Application]).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});

// ── Start ──────────────────────────────────────────────────────────────────

serve({ fetch: app.fetch, port: 4322 }, () => {
  console.log("✓ Dashboard running at http://localhost:4322");
});
