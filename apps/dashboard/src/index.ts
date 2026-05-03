import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { scryptSync, timingSafeEqual, randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");
mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(join(DATA_DIR, "applications.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_id TEXT NOT NULL,
    name         TEXT NOT NULL,
    email        TEXT NOT NULL,
    phone        TEXT NOT NULL DEFAULT '',
    location     TEXT NOT NULL DEFAULT '',
    device       TEXT NOT NULL DEFAULT '',
    vehicle      TEXT NOT NULL DEFAULT '',
    dream        TEXT NOT NULL DEFAULT '',
    status       TEXT NOT NULL DEFAULT 'pending',
    submitted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  )
`);

try { db.exec("ALTER TABLE applications ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'"); } catch {}

// ── Auth ───────────────────────────────────────────────────────────────────

const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
const ADMIN_PASS_RAW = process.env.ADMIN_PASS ?? "superadmin101";
const AUTH_SALT = "confri-rsvp-salt-v1";
const ADMIN_PASS_HASH = scryptSync(ADMIN_PASS_RAW, AUTH_SALT, 32);

const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours
const sessions = new Map<string, number>(); // token → expiry

function verifyPassword(input: string): boolean {
  try {
    const inputHash = scryptSync(input, AUTH_SALT, 32);
    return timingSafeEqual(inputHash, ADMIN_PASS_HASH);
  } catch { return false; }
}

function createSession(): string {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL);
  return token;
}

function isValidSession(token: string): boolean {
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) { sessions.delete(token); return false; }
  return true;
}

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
  status: string;
  submitted_at: string;
}

type Status = "pending" | "approved" | "waitlisted" | "rejected";
const VALID_STATUSES: Status[] = ["pending", "approved", "waitlisted", "rejected"];

// ── Helpers ────────────────────────────────────────────────────────────────

const VEHICLE_LABEL: Record<string, string> = {
  motor: "Motorcycle", car: "Car", supercar: "Supercar", truck: "Truck", bus: "Bus",
};
const DEVICE_LABEL: Record<string, string> = { iphone: "iPhone", android: "Android" };
const VEHICLE_EMOJI: Record<string, string> = {
  motor: "🏍️", car: "🚗", supercar: "🏎️", truck: "🚛", bus: "🚌",
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Login page ─────────────────────────────────────────────────────────────

function renderLogin(error?: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Sign in — ConvoyFriends Admin</title>
  <style>
    :root {
      --bg-ground:   #050B16;
      --bg-surface:  #0A1628;
      --bg-elevated: #0F1E36;
      --cyan:  #3DD9F5;
      --teal:  #2BC4A8;
      --warn:  #F26B6B;
      --ink-primary: #F5F8FF;
      --ink-mute:    #9AA8C2;
      --ink-soft:    #6B7891;
      --line-subtle: rgba(255,255,255,0.08);
      --line-strong: rgba(255,255,255,0.16);
      --line-accent: rgba(61,217,245,0.30);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-ground);
      color: var(--ink-primary);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    /* ambient glow */
    body::before {
      content: "";
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(700px 500px at 20% 10%, color-mix(in srgb, #3DD9F5 8%, transparent), transparent 60%),
        radial-gradient(600px 500px at 80% 80%, color-mix(in srgb, #2BC4A8 7%, transparent), transparent 55%);
    }

    .card {
      position: relative; z-index: 1;
      width: 100%; max-width: 380px;
      background: var(--bg-surface);
      border: 1px solid var(--line-subtle);
      border-radius: 16px;
      overflow: hidden;
    }
    .card-top { height: 3px; background: linear-gradient(90deg, var(--cyan), var(--teal)); }
    .card-body { padding: 36px 32px 32px; }

    .logo {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 28px;
    }
    .logo-mark {
      width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--cyan), var(--teal));
      display: flex; align-items: center; justify-content: center;
    }
    .logo-mark svg { color: #06121F; }
    .logo-text { font-size: 15px; font-weight: 700; color: var(--ink-primary); letter-spacing: -.01em; }
    .logo-sub  { font-size: 12px; color: var(--ink-soft); margin-top: 1px; }

    h1 { font-size: 20px; font-weight: 700; letter-spacing: -.02em; margin-bottom: 6px; }
    .subtitle { font-size: 13px; color: var(--ink-mute); margin-bottom: 28px; }

    label {
      display: block;
      font-size: 12px; font-weight: 600; color: var(--ink-mute);
      margin-bottom: 6px;
    }
    .field { margin-bottom: 16px; }
    input[type=text], input[type=password] {
      width: 100%;
      background: var(--bg-elevated);
      border: 1px solid var(--line-subtle);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      color: var(--ink-primary);
      outline: none;
      transition: border-color .15s;
    }
    input[type=text]:focus, input[type=password]:focus {
      border-color: var(--line-accent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--cyan) 12%, transparent);
    }
    input::placeholder { color: var(--ink-soft); }

    .error {
      background: color-mix(in srgb, var(--warn) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--warn) 30%, transparent);
      color: var(--warn);
      font-size: 13px;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 18px;
      display: flex; align-items: center; gap-8px;
    }

    button[type=submit] {
      width: 100%; margin-top: 8px;
      padding: 12px;
      border: none; border-radius: 9px;
      background: linear-gradient(90deg, var(--cyan), var(--teal));
      color: #06121F;
      font-size: 14px; font-weight: 700;
      cursor: pointer;
      transition: opacity .15s, transform .15s;
    }
    button[type=submit]:hover { opacity: .9; transform: translateY(-1px); }
    button[type=submit]:active { transform: translateY(0); }

    .footer-note {
      margin-top: 22px; text-align: center;
      font-size: 12px; color: var(--ink-soft);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-top"></div>
    <div class="card-body">
      <div class="logo">
        <div class="logo-mark">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <polygon points="22 2 15 22 11 13 2 9" fill="white"/>
            <line x1="22" y1="2" x2="11" y2="13" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <div class="logo-text">ConvoyFriends</div>
          <div class="logo-sub">RSVP Admin</div>
        </div>
      </div>

      <h1>Welcome back</h1>
      <p class="subtitle">Sign in to manage beta applications.</p>

      ${error ? `<div class="error">⚠ ${esc(error)}</div>` : ""}

      <form method="POST" action="/auth/login">
        <div class="field">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" placeholder="admin" autocomplete="username" required autofocus/>
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="••••••••••••" autocomplete="current-password" required/>
        </div>
        <button type="submit">Sign in →</button>
      </form>
    </div>
  </div>
  <p class="footer-note">ConvoyFriends · Beta Program · Private access only</p>
</body>
</html>`;
}

// ── Dashboard page ─────────────────────────────────────────────────────────

function renderPage(rows: Application[]) {
  const total = rows.length;
  const counts = {
    pending:    rows.filter(r => r.status === "pending").length,
    approved:   rows.filter(r => r.status === "approved").length,
    waitlisted: rows.filter(r => r.status === "waitlisted").length,
    rejected:   rows.filter(r => r.status === "rejected").length,
  };

  const tableRows = rows.map(r => `
    <tr data-id="${r.id}" data-status="${esc(r.status)}" data-search="${esc(r.name.toLowerCase())} ${esc(r.email.toLowerCase())}">
      <td class="check-cell">
        <label class="cb-wrap">
          <input type="checkbox" class="row-cb" data-id="${r.id}" onchange="onCheckChange()"/>
          <span class="cb-box"></span>
        </label>
      </td>
      <td><span class="ref">${esc(r.reference_id)}</span></td>
      <td>
        <div class="applicant-name">${esc(r.name)}</div>
        <div class="applicant-email">${esc(r.email)}</div>
      </td>
      <td>${esc(r.phone || "—")}</td>
      <td>${esc(r.location || "—")}</td>
      <td>${(VEHICLE_EMOJI[r.vehicle] ?? "")} ${(VEHICLE_LABEL[r.vehicle] ?? esc(r.vehicle)) || "—"}</td>
      <td>${(DEVICE_LABEL[r.device] ?? esc(r.device)) || "—"}</td>
      <td class="dream" title="${esc(r.dream)}">${esc(r.dream || "—")}</td>
      <td class="date-col">${fmtDate(r.submitted_at)}</td>
      <td>
        <select class="status-select status-${esc(r.status)}" data-id="${r.id}" onchange="updateStatus(this)">
          <option value="pending"    ${r.status === "pending"    ? "selected" : ""}>Pending</option>
          <option value="approved"   ${r.status === "approved"   ? "selected" : ""}>Approved</option>
          <option value="waitlisted" ${r.status === "waitlisted" ? "selected" : ""}>Waitlisted</option>
          <option value="rejected"   ${r.status === "rejected"   ? "selected" : ""}>Rejected</option>
        </select>
      </td>
    </tr>`).join("");

  const emptyState = `
    <tr id="empty-row">
      <td colspan="10" class="empty">No sign-ups yet. Share the beta link to get your first applicants.</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>RSVP Admin — ConvoyFriends Beta</title>
  <style>
    :root {
      --bg-ground:   #050B16;
      --bg-surface:  #0A1628;
      --bg-elevated: #0F1E36;
      --cyan:  #3DD9F5;
      --aqua:  #34D2C7;
      --teal:  #2BC4A8;
      --amber: #F2B26B;
      --warn:  #F26B6B;
      --ink-primary: #F5F8FF;
      --ink-mute:    #9AA8C2;
      --ink-soft:    #6B7891;
      --line-subtle: rgba(255,255,255,0.08);
      --line-strong: rgba(255,255,255,0.16);
      --line-accent: rgba(61,217,245,0.30);
      --glass-wash:   rgba(255,255,255,0.02);
      --glass-hover:  rgba(255,255,255,0.04);
      --glass-tinted: rgba(61,217,245,0.06);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-ground);
      color: var(--ink-primary);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px;
      min-height: 100vh;
    }

    /* ── Header ─────────────────────────────────────────────── */
    header {
      background: var(--bg-surface);
      border-bottom: 1px solid var(--line-subtle);
      padding: 0 28px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky; top: 0; z-index: 20;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .logo-mark {
      width: 28px; height: 28px; border-radius: 7px;
      background: linear-gradient(135deg, var(--cyan), var(--teal));
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .logo-mark svg { color: #06121F; }
    .live-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--teal); animation: pulse 2s infinite; flex-shrink: 0;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
    .header-title { font-size: 14px; font-weight: 700; color: var(--ink-primary); }
    .header-sub { font-size: 13px; color: var(--ink-soft); margin-left: 2px; }
    .header-right { display: flex; align-items: center; gap: 8px; }
    .header-btn {
      background: var(--glass-wash);
      border: 1px solid var(--line-strong);
      color: var(--ink-mute);
      font-size: 12px; font-weight: 500;
      padding: 6px 14px; border-radius: 6px;
      text-decoration: none; cursor: pointer;
      transition: border-color .15s, color .15s;
    }
    .header-btn:hover { border-color: var(--line-accent); color: var(--cyan); }
    .logout-btn { color: var(--ink-soft); }
    .logout-btn:hover { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 30%, transparent); }

    /* ── Layout ─────────────────────────────────────────────── */
    main { max-width: 1440px; margin: 0 auto; padding: 28px 28px 100px; }

    /* ── Stat cards ─────────────────────────────────────────── */
    .stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; margin-bottom: 24px; }
    .stat {
      background: var(--bg-surface);
      border: 1px solid var(--line-subtle);
      border-radius: 12px; padding: 18px 20px;
      cursor: pointer; transition: border-color .15s, background .15s;
    }
    .stat:hover { border-color: var(--line-strong); background: var(--bg-elevated); }
    .stat.active { border-color: var(--line-accent); background: var(--glass-tinted); }
    .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--ink-soft); margin-bottom: 8px; }
    .stat-value { font-size: 30px; font-weight: 700; letter-spacing: -.03em; line-height: 1; color: var(--ink-primary); }
    .stat.active .stat-value { color: var(--cyan); }
    .stat-sub { font-size: 11px; color: var(--ink-soft); margin-top: 5px; }
    .stat-approved  .stat-value  { color: var(--teal); }
    .stat-waitlisted .stat-value { color: var(--cyan); }
    .stat-rejected  .stat-value  { color: var(--warn); }
    .stat-pending   .stat-value  { color: var(--amber); }

    /* ── Toolbar ─────────────────────────────────────────────── */
    .toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 12px; flex-wrap: wrap; }
    .search { flex: 1; max-width: 320px; position: relative; }
    .search input {
      width: 100%; background: var(--bg-surface);
      border: 1px solid var(--line-subtle); border-radius: 8px;
      padding: 8px 12px 8px 36px; font-size: 13px;
      color: var(--ink-primary); outline: none; transition: border-color .15s;
    }
    .search input::placeholder { color: var(--ink-soft); }
    .search input:focus { border-color: var(--line-accent); }
    .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--ink-soft); pointer-events: none; }
    .count-label { font-size: 13px; color: var(--ink-soft); }

    /* ── Table ───────────────────────────────────────────────── */
    .table-wrap {
      background: var(--bg-surface);
      border: 1px solid var(--line-subtle);
      border-radius: 12px; overflow: hidden; overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; }
    thead th {
      background: var(--bg-elevated); padding: 10px 14px; text-align: left;
      font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
      color: var(--ink-soft); border-bottom: 1px solid var(--line-subtle); white-space: nowrap;
    }
    thead th.check-cell { width: 40px; }
    tbody tr { border-bottom: 1px solid var(--line-subtle); transition: background .1s; }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: var(--glass-hover); }
    tbody tr.hidden { display: none; }
    tbody tr.selected { background: var(--glass-tinted); }
    td { padding: 11px 14px; vertical-align: middle; white-space: nowrap; color: var(--ink-mute); font-size: 13px; }
    .check-cell { width: 40px; }
    .applicant-name { font-weight: 600; color: var(--ink-primary); font-size: 13px; }
    .applicant-email { font-size: 12px; color: var(--ink-soft); margin-top: 1px; }
    td.date-col { font-size: 11px; color: var(--ink-soft); }
    td.dream { max-width: 180px; overflow: hidden; text-overflow: ellipsis; }
    .ref {
      font-family: ui-monospace, monospace; font-size: 11px;
      color: var(--ink-soft); background: var(--bg-elevated);
      border: 1px solid var(--line-subtle); padding: 2px 7px; border-radius: 4px;
    }
    td.empty { text-align: center; color: var(--ink-soft); padding: 64px; font-size: 14px; }

    /* ── Custom checkbox ─────────────────────────────────────── */
    .cb-wrap { display: inline-flex; align-items: center; cursor: pointer; }
    .cb-wrap input { position: absolute; opacity: 0; width: 0; height: 0; }
    .cb-box {
      width: 16px; height: 16px; border-radius: 4px;
      border: 1px solid var(--line-strong); background: var(--bg-elevated);
      transition: border-color .15s, background .15s; flex-shrink: 0; position: relative;
    }
    .cb-wrap input:checked + .cb-box {
      background: linear-gradient(135deg, var(--cyan), var(--teal)); border-color: transparent;
    }
    .cb-wrap input:checked + .cb-box::after {
      content: ""; position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8'%3E%3Cpath d='M1 4l3 3 5-6' stroke='%23050B16' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/10px no-repeat;
    }

    /* ── Status select ───────────────────────────────────────── */
    .status-select {
      border: none; border-radius: 20px; padding: 4px 22px 4px 10px;
      font-size: 12px; font-weight: 600; cursor: pointer;
      outline: none; appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239AA8C2'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center;
    }
    .status-pending    { background-color: rgba(242,178,107,0.15); color: #F2B26B; }
    .status-approved   { background-color: rgba(43,196,168,0.15);  color: #2BC4A8; }
    .status-waitlisted { background-color: rgba(61,217,245,0.15);  color: #3DD9F5; }
    .status-rejected   { background-color: rgba(242,107,107,0.15); color: #F26B6B; }
    .status-select option { background: var(--bg-elevated); color: var(--ink-primary); }

    /* ── Bulk action bar ─────────────────────────────────────── */
    #bulk-bar {
      position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: var(--bg-elevated); border: 1px solid var(--line-strong);
      border-radius: 14px; padding: 12px 16px;
      display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      opacity: 0; pointer-events: none;
      transition: opacity .2s, transform .2s;
      z-index: 50; white-space: nowrap;
    }
    #bulk-bar.visible { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
    .bulk-count { font-size: 13px; font-weight: 600; color: var(--ink-mute); padding-right: 6px; border-right: 1px solid var(--line-subtle); }
    .bulk-btn {
      font-size: 12px; font-weight: 700; padding: 7px 16px;
      border-radius: 8px; border: none; cursor: pointer; transition: opacity .15s;
    }
    .bulk-btn:hover { opacity: .85; }
    .bulk-approve  { background: rgba(43,196,168,0.2);  color: var(--teal); border: 1px solid rgba(43,196,168,0.3); }
    .bulk-waitlist { background: rgba(61,217,245,0.15); color: var(--cyan); border: 1px solid rgba(61,217,245,0.3); }
    .bulk-reject   { background: rgba(242,107,107,0.15); color: var(--warn); border: 1px solid rgba(242,107,107,0.3); }
    .bulk-clear    { background: transparent; color: var(--ink-soft); border: 1px solid var(--line-subtle); }

    /* ── Toast ───────────────────────────────────────────────── */
    #toast {
      position: fixed; top: 70px; right: 24px;
      background: var(--bg-elevated); border: 1px solid var(--line-strong);
      color: var(--ink-primary); font-size: 13px; font-weight: 500;
      padding: 10px 18px; border-radius: 9px;
      opacity: 0; transform: translateY(-6px);
      transition: opacity .2s, transform .2s;
      pointer-events: none; z-index: 100;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    #toast.show { opacity: 1; transform: translateY(0); }
    #toast.success { border-color: rgba(43,196,168,0.4); color: var(--teal); }
    #toast.error   { border-color: rgba(242,107,107,0.4); color: var(--warn); }

    @media (max-width: 1100px) { .stats { grid-template-columns: repeat(3,1fr); } }
    @media (max-width: 700px)  {
      .stats { grid-template-columns: repeat(2,1fr); }
      main { padding: 16px 14px 100px; }
      header { padding: 0 16px; }
    }
  </style>
</head>
<body>

<header>
  <div class="header-left">
    <div class="logo-mark">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
        <polygon points="22 2 15 22 11 13 2 9" fill="white"/>
        <line x1="22" y1="2" x2="11" y2="13" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    <span class="header-title">ConvoyFriends</span>
    <span class="header-sub">/ Beta RSVP</span>
    <div class="live-dot" style="margin-left:8px"></div>
  </div>
  <div class="header-right">
    <a href="/api/export" class="header-btn" download="applications.csv">↓ Export CSV</a>
    <form method="POST" action="/auth/logout" style="margin:0">
      <button type="submit" class="header-btn logout-btn">Sign out</button>
    </form>
  </div>
</header>

<main>
  <div class="stats">
    <div class="stat active" id="card-all" onclick="filterStatus('all')">
      <div class="stat-label">All sign-ups</div>
      <div class="stat-value">${total}</div>
      <div class="stat-sub">Total received</div>
    </div>
    <div class="stat stat-pending" id="card-pending" onclick="filterStatus('pending')">
      <div class="stat-label">Pending</div>
      <div class="stat-value">${counts.pending}</div>
      <div class="stat-sub">Awaiting review</div>
    </div>
    <div class="stat stat-approved" id="card-approved" onclick="filterStatus('approved')">
      <div class="stat-label">Approved</div>
      <div class="stat-value">${counts.approved}</div>
      <div class="stat-sub">Invited to beta</div>
    </div>
    <div class="stat stat-waitlisted" id="card-waitlisted" onclick="filterStatus('waitlisted')">
      <div class="stat-label">Waitlisted</div>
      <div class="stat-value">${counts.waitlisted}</div>
      <div class="stat-sub">On hold</div>
    </div>
    <div class="stat stat-rejected" id="card-rejected" onclick="filterStatus('rejected')">
      <div class="stat-label">Rejected</div>
      <div class="stat-value">${counts.rejected}</div>
      <div class="stat-sub">Declined</div>
    </div>
  </div>

  <div class="toolbar">
    <div class="search">
      <span class="search-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </span>
      <input type="text" id="search" placeholder="Search by name or email…" oninput="applyFilters()"/>
    </div>
    <span class="count-label" id="visible-count">${total} applicant${total !== 1 ? "s" : ""}</span>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th class="check-cell">
            <label class="cb-wrap">
              <input type="checkbox" id="select-all" onchange="toggleSelectAll(this)"/>
              <span class="cb-box"></span>
            </label>
          </th>
          <th>Ref</th><th>Applicant</th><th>Phone</th><th>Location</th>
          <th>Vehicle</th><th>Device</th><th>Dream route</th><th>Submitted</th><th>Status</th>
        </tr>
      </thead>
      <tbody id="tbody">
        ${rows.length ? tableRows : emptyState}
      </tbody>
    </table>
  </div>
</main>

<div id="bulk-bar">
  <span class="bulk-count" id="bulk-count">0 selected</span>
  <button class="bulk-btn bulk-approve"  onclick="bulkUpdate('approved')">✓ Approve</button>
  <button class="bulk-btn bulk-waitlist" onclick="bulkUpdate('waitlisted')">⏸ Waitlist</button>
  <button class="bulk-btn bulk-reject"   onclick="bulkUpdate('rejected')">✕ Decline</button>
  <button class="bulk-btn bulk-clear"    onclick="clearSelection()">Clear</button>
</div>

<div id="toast"></div>

<script>
  let activeFilter = 'all';

  function filterStatus(status) {
    activeFilter = status;
    document.querySelectorAll('.stat').forEach(el => el.classList.remove('active'));
    document.getElementById('card-' + status)?.classList.add('active');
    applyFilters();
  }

  function applyFilters() {
    const q = document.getElementById('search').value.toLowerCase();
    let visible = 0;
    document.querySelectorAll('#tbody tr[data-status]').forEach(row => {
      const matchStatus = activeFilter === 'all' || row.dataset.status === activeFilter;
      const matchSearch = !q || row.dataset.search.includes(q);
      const show = matchStatus && matchSearch;
      row.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    const label = document.getElementById('visible-count');
    if (label) label.textContent = visible + ' applicant' + (visible !== 1 ? 's' : '');
  }

  async function updateStatus(select) {
    const id = select.dataset.id;
    const status = select.value;
    const row = select.closest('tr');
    try {
      const res = await fetch('/api/submissions/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      select.className = 'status-select status-' + status;
      if (row) row.dataset.status = status;
      applyFilters();
      showToast('Status updated', 'success');
    } catch {
      showToast('Failed to update — try again', 'error');
      select.value = row?.dataset.status ?? 'pending';
    }
  }

  function getCheckedIds() {
    return [...document.querySelectorAll('.row-cb:checked')].map(cb => cb.dataset.id);
  }

  function getVisibleRows() {
    return [...document.querySelectorAll('#tbody tr[data-status]:not(.hidden)')];
  }

  function onCheckChange() {
    const ids = getCheckedIds();
    const bar = document.getElementById('bulk-bar');
    const countEl = document.getElementById('bulk-count');
    document.querySelectorAll('#tbody tr[data-status]').forEach(row => {
      const cb = row.querySelector('.row-cb');
      row.classList.toggle('selected', cb?.checked ?? false);
    });
    if (ids.length > 0) {
      countEl.textContent = ids.length + ' selected';
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
    const visibleCbs = getVisibleRows().map(r => r.querySelector('.row-cb'));
    const allChecked = visibleCbs.length > 0 && visibleCbs.every(cb => cb?.checked);
    const saEl = document.getElementById('select-all');
    if (saEl) saEl.checked = allChecked;
  }

  function toggleSelectAll(master) {
    getVisibleRows().forEach(row => {
      const cb = row.querySelector('.row-cb');
      if (cb) cb.checked = master.checked;
    });
    onCheckChange();
  }

  function clearSelection() {
    document.querySelectorAll('.row-cb').forEach(cb => cb.checked = false);
    const saEl = document.getElementById('select-all');
    if (saEl) saEl.checked = false;
    onCheckChange();
  }

  async function bulkUpdate(status) {
    const ids = getCheckedIds();
    if (!ids.length) return;
    const results = await Promise.allSettled(
      ids.map(id => fetch('/api/submissions/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }))
    );
    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value.ok).length;
    const failed = ids.length - succeeded;
    ids.forEach((id, i) => {
      if (results[i].status !== 'fulfilled') return;
      const row = document.querySelector('#tbody tr[data-id="' + id + '"]');
      if (!row) return;
      row.dataset.status = status;
      const sel = row.querySelector('.status-select');
      if (sel) { sel.value = status; sel.className = 'status-select status-' + status; }
    });
    applyFilters();
    clearSelection();
    if (failed === 0) {
      showToast(succeeded + ' application' + (succeeded !== 1 ? 's' : '') + ' marked ' + status, 'success');
    } else {
      showToast(succeeded + ' updated, ' + failed + ' failed', 'error');
    }
  }

  function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = type ? 'show ' + type : 'show';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.className = '', 2400);
  }
</script>
</body>
</html>`;
}

// ── App ────────────────────────────────────────────────────────────────────

const app = new Hono();

// Public — submit endpoint (called from the beta site, no session needed)
app.use("/api/submit", cors({ origin: "*" }));
app.post("/api/submit", async (c) => {
  const body = await c.req.json() as Record<string, string>;
  db.prepare(`
    INSERT INTO applications (reference_id, name, email, phone, location, device, vehicle, dream)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.referenceId ?? "", body.name ?? "", body.email ?? "",
    body.phone ?? "", body.location ?? "", body.device ?? "",
    body.vehicle ?? "", body.dream ?? "",
  );
  return c.json({ ok: true });
});

// Auth routes (no session required)
app.get("/login", (c) => {
  const session = getCookie(c, "cf_session");
  if (session && isValidSession(session)) return c.redirect("/");
  return c.html(renderLogin());
});

app.post("/auth/login", async (c) => {
  const body = await c.req.parseBody();
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");

  if (username !== ADMIN_USER || !verifyPassword(password)) {
    return c.html(renderLogin("Incorrect username or password. Try again."), 401);
  }

  const token = createSession();
  setCookie(c, "cf_session", token, {
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
    maxAge: SESSION_TTL / 1000,
  });
  return c.redirect("/");
});

app.post("/auth/logout", (c) => {
  const token = getCookie(c, "cf_session");
  if (token) sessions.delete(token);
  deleteCookie(c, "cf_session", { path: "/" });
  return c.redirect("/login");
});

// Auth middleware — protect everything below
app.use("/*", async (c, next) => {
  const session = getCookie(c, "cf_session");
  if (!session || !isValidSession(session)) {
    return c.redirect("/login");
  }
  return next();
});

app.get("/", (c) => {
  const rows = db.prepare("SELECT * FROM applications ORDER BY submitted_at DESC").all() as Application[];
  return c.html(renderPage(rows));
});

app.patch("/api/submissions/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const { status } = await c.req.json() as { status: string };
  if (!VALID_STATUSES.includes(status as Status)) {
    return c.json({ error: "Invalid status" }, 400);
  }
  db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, id);
  return c.json({ ok: true });
});

app.get("/api/submissions", (c) => {
  const rows = db.prepare("SELECT * FROM applications ORDER BY submitted_at DESC").all() as Application[];
  return c.json(rows);
});

app.get("/api/export", (c) => {
  const rows = db.prepare("SELECT * FROM applications ORDER BY submitted_at DESC").all() as Application[];
  const headers = ["reference_id", "name", "email", "phone", "location", "device", "vehicle", "dream", "status", "submitted_at"];
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => `"${String(r[h as keyof Application]).replace(/"/g, '""')}"`).join(",")),
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
  console.log("✓ RSVP Admin  →  http://localhost:4322");
  console.log("  Username: admin");
  console.log("  Password: superadmin101");
});
