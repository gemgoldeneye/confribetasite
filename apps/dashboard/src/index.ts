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
      <td><span class="badge">${esc(r.reference_id)}</span></td>
      <td class="name">${esc(r.name)}</td>
      <td class="secondary">${esc(r.email)}</td>
      <td class="secondary">${esc(r.phone || "—")}</td>
      <td class="secondary">${esc(r.location || "—")}</td>
      <td><span class="chip">${(DEVICE_LABEL[r.device] ?? esc(r.device)) || "—"}</span></td>
      <td>${vehicleEmoji(r.vehicle)} <span class="secondary">${(VEHICLE_LABEL[r.vehicle] ?? esc(r.vehicle)) || "—"}</span></td>
      <td class="dream secondary">${esc(r.dream || "—")}</td>
      <td class="date secondary">${fmtDate(r.submitted_at)}</td>
    </tr>`).join("");

  const emptyState = `
    <tr>
      <td colspan="9" class="empty">No sign-ups yet — share the beta site to get your first applicants.</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Beta Sign-ups — Admin</title>
  <meta http-equiv="refresh" content="30"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f5f6f8;
      color: #111827;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px;
      min-height: 100vh;
    }

    /* Header */
    header {
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 32px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; flex-shrink: 0; }
    .title { font-size: 14px; font-weight: 600; color: #111827; }
    .subtitle { font-size: 13px; color: #9ca3af; margin-left: 4px; font-weight: 400; }
    .refresh { font-size: 12px; color: #9ca3af; }

    /* Layout */
    main { max-width: 1400px; margin: 0 auto; padding: 28px 32px 64px; }

    /* Stats */
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
    .stat {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 18px 22px;
    }
    .stat-label { font-size: 11px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
    .stat-value { font-size: 30px; font-weight: 700; color: #111827; letter-spacing: -0.02em; line-height: 1; }
    .stat-sub { font-size: 12px; color: #9ca3af; margin-top: 5px; }

    /* Table header row */
    .table-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .table-label { font-size: 13px; font-weight: 600; color: #374151; }
    .export {
      background: #fff;
      border: 1px solid #d1d5db;
      color: #374151;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.15s;
    }
    .export:hover { background: #f9fafb; }

    /* Table */
    .table-wrap {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; }
    thead th {
      background: #f9fafb;
      padding: 10px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }
    tbody tr { border-bottom: 1px solid #f3f4f6; transition: background 0.1s; }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: #f9fafb; }
    td { padding: 12px 16px; vertical-align: middle; white-space: nowrap; color: #374151; }
    td.name { font-weight: 600; color: #111827; }
    td.secondary { color: #6b7280; }
    td.dream { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #6b7280; }
    td.date { font-size: 12px; color: #9ca3af; }
    td.empty { text-align: center; color: #9ca3af; padding: 56px 16px; }
    .badge {
      display: inline-block;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #6b7280;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .chip {
      display: inline-block;
      font-size: 11px;
      font-weight: 500;
      color: #374151;
      background: #f3f4f6;
      padding: 2px 8px;
      border-radius: 4px;
    }

    @media (max-width: 900px) {
      .stats { grid-template-columns: repeat(2, 1fr); }
      main { padding: 20px 16px 48px; }
      header { padding: 0 16px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-left">
      <div class="dot"></div>
      <span class="title">Beta Sign-ups</span>
      <span class="subtitle">ConvoyFriends Admin</span>
    </div>
    <span class="refresh">Auto-refreshes every 30s</span>
  </header>

  <main>
    <div class="stats">
      <div class="stat">
        <div class="stat-label">Total</div>
        <div class="stat-value">${total}</div>
        <div class="stat-sub">All time</div>
      </div>
      <div class="stat">
        <div class="stat-label">This week</div>
        <div class="stat-value">${weekCount}</div>
        <div class="stat-sub">Last 7 days</div>
      </div>
      <div class="stat">
        <div class="stat-label">Today</div>
        <div class="stat-value">${todayCount}</div>
        <div class="stat-sub">${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Top vehicle</div>
        <div class="stat-value">${topVehicle ? vehicleEmoji(topVehicle[0]) : "—"}</div>
        <div class="stat-sub">${topVehicle ? `${VEHICLE_LABEL[topVehicle[0]] ?? topVehicle[0]} (${topVehicle[1]})` : "No data yet"}</div>
      </div>
    </div>

    <div class="table-header">
      <span class="table-label">${total} application${total !== 1 ? "s" : ""}</span>
      <a href="/api/export" class="export" download="applications.csv">↓ Export CSV</a>
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
