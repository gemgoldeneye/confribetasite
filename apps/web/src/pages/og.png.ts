import type { APIRoute } from "astro";
import satori from "satori";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

export const prerender = true;

// Helper to build a satori element — explicit display:flex on everything to
// satisfy satori's strict layout requirements.
const el = (
  type: string,
  style: Record<string, unknown>,
  ...children: unknown[]
) => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.length === 1 ? children[0] : children },
});

export const GET: APIRoute = async () => {
  const req = createRequire(import.meta.url);
  // satori requires WOFF or TTF, not WOFF2.
  const sora700 = readFileSync(req.resolve("@fontsource/sora/files/sora-latin-700-normal.woff"));
  const sora800 = readFileSync(req.resolve("@fontsource/sora/files/sora-latin-800-normal.woff"));

  const BG = "#050B16";
  const SURFACE = "#0A1628";
  const CYAN = "#3DD9F5";
  const TEAL = "#2BC4A8";
  const INK = "#F5F8FF";
  const INK_MUTE = "#9AA8C2";
  const INK_SOFT = "#6B7891";
  const LINE = "rgba(255,255,255,0.16)";
  const GRAD = `linear-gradient(92deg, ${CYAN} 0%, #34D2C7 48%, ${TEAL} 100%)`;

  const tree = el(
    "div",
    {
      width: "1200px",
      height: "630px",
      backgroundColor: BG,
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "0",
      fontFamily: "Sora",
      position: "relative",
      overflow: "hidden",
    },
    // Gradient accent strip along the top
    el("div", {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      height: "3px",
      background: GRAD,
    }),
    // Cyan glow blob top-left
    el("div", {
      position: "absolute",
      top: "-220px",
      left: "-220px",
      width: "580px",
      height: "580px",
      borderRadius: "50%",
      backgroundColor: "rgba(61,217,245,0.09)",
    }),
    // Teal glow blob bottom-right
    el("div", {
      position: "absolute",
      bottom: "-200px",
      right: "-160px",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      backgroundColor: "rgba(43,196,168,0.07)",
    }),
    // ── Main content ────────────────────────────────────────────────────────
    el(
      "div",
      {
        flexDirection: "column",
        justifyContent: "space-between",
        flex: "1",
        padding: "56px 80px 52px",
        position: "relative",
      },
      // Header row
      el(
        "div",
        { justifyContent: "space-between", alignItems: "center" },
        // Brand
        el(
          "div",
          { alignItems: "center", gap: "14px" },
          // Brand mark
          el(
            "div",
            {
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: GRAD,
              alignItems: "center",
              justifyContent: "center",
            },
            el("div", { width: "24px", height: "24px" }),
          ),
          el(
            "span",
            { color: INK, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.015em" },
            "ConvoyFriends",
          ),
        ),
        // Beta badge
        el(
          "div",
          {
            alignItems: "center",
            gap: "10px",
            padding: "10px 20px",
            border: `1px solid ${LINE}`,
            borderRadius: "999px",
            color: INK_MUTE,
            fontSize: "15px",
            fontWeight: 500,
          },
          el("div", {
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: TEAL,
          }),
          el("span", { color: INK_MUTE, fontSize: "15px" }, "Beta · 300 founding drivers"),
        ),
      ),
      // Tagline
      el(
        "div",
        { flexDirection: "column", gap: "0" },
        el(
          "div",
          { color: INK, fontSize: "80px", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: "1.0" },
          "Drive Together,",
        ),
        el(
          "div",
          { color: CYAN, fontSize: "80px", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: "1.0" },
          "Navigate Smarter.",
        ),
      ),
      // Bottom row
      el(
        "div",
        { justifyContent: "space-between", alignItems: "flex-end" },
        el(
          "div",
          { color: INK_SOFT, fontSize: "18px", fontWeight: 500 },
          "Live convoy maps · Voice chat · Smart re-routing",
        ),
        el(
          "div",
          {
            color: INK_MUTE,
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            padding: "8px 16px",
            border: `1px solid ${LINE}`,
            borderRadius: "8px",
            backgroundColor: SURFACE,
          },
          "convoyfriends.app",
        ),
      ),
    ),
  );

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Sora", data: sora700, weight: 700, style: "normal" },
      { name: "Sora", data: sora800, weight: 800, style: "normal" },
    ],
  });

  const { default: sharp } = await import("sharp");
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    status: 200,
    headers: { "Content-Type": "image/png" },
  });
};
