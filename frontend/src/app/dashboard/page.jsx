"use client";
// dashboard/page.jsx — scroll-triggered pop-in cards (one by one)
import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { Card, Counter, Radial, ChartTip, Pill } from "../components/StatsCards";
import { pct, WEEK, sevPill } from "../lib/theme";
import { fetchDepartments, fetchDoctors } from "../lib/api";

/* ─── useReveal — triggers when element enters viewport ────────────── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return [ref, visible];
}

/* ─── RevealCard — wraps any card with scroll-pop animation ─────────── */
function RevealCard({ delay = 0, direction = "up", children, style = {} }) {
  const [ref, visible] = useReveal(delay);

  const from = {
    up:    "translateY(40px) scale(0.94)",
    left:  "translateX(-36px) scale(0.96)",
    right: "translateX(36px)  scale(0.96)",
    scale: "scale(0.88)",
  }[direction];

  return (
    <div
      ref={ref}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translate(0) scale(1)" : from,
        transition: visible
          ? `opacity 0.6s cubic-bezier(.25,.46,.45,.94) ${delay}ms,
             transform 0.65s cubic-bezier(.34,1.56,.64,1) ${delay}ms`
          : "none",
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Animated progress bar ─────────────────────────────────────────── */
function AnimBar({ pct: p, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(p), 350 + delay);
    return () => clearTimeout(id);
  }, [p, delay]);
  return (
    <div style={{ height: 3, borderRadius: 999, background: "rgba(180,140,90,0.1)", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 999,
        width: `${w}%`, background: color,
        boxShadow: `0 0 7px ${color}55`,
        transition: `width 1.4s cubic-bezier(.34,1.56,.64,1)`,
      }} />
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────────────── */
export default function DashboardPage({ t }) {
  const [depts, setDepts] = useState([]);
  const [docs,  setDocs]  = useState([]);

  useEffect(() => {
    fetchDepartments().then(setDepts).catch(() => {});
    fetchDoctors().then(setDocs).catch(() => {});
  }, []);

  const RADAR_DATA = depts.slice(0, 6).map(d => ({
    dept:  d.name.slice(0, 4),
    Load:  Math.round((d.pts / 100) * 100),
    Beds:  Math.round((d.occ / d.beds) * 100),
    Staff: Math.min(100, Math.round((d.docs / 12) * 100)),
  }));

  const occP = pct(234, 305);

  const recs = [
    { type: "r", icon: "🚨", msg: "Emergency at 87% capacity — activate overflow protocol" },
    { type: "r", icon: "🩺", msg: "Dr. Nathan Brooks: 21 patients — critical overload" },
    { type: "a", icon: "⚠️", msg: "Oncology avg resolution 9.4d — review recommended" },
    { type: "a", icon: "👁️", msg: "Neurology load up 18% this week — monitor staffing" },
    { type: "g", icon: "✅", msg: "Orthopedics at 60% capacity — optimal performance" },
  ];

  const recStyle = tp => ({
    r: { bg: "rgba(192,57,43,0.08)", bdr: "rgba(192,57,43,0.2)", txt: t.id === "dark" ? "#f07060" : "#9b2c1c" },
    a: { bg: t.hiBg, bdr: `${t.hi}30`, txt: t.id === "dark" ? t.hi : "#8a5a12" },
    g: { bg: t.accentLight, bdr: `${t.accent}28`, txt: t.id === "dark" ? t.accent : "#0a5a4f" },
  })[tp];

  const KPI = [
    { label: "Total Patients", val: 345, delta: "+3%",   icon: "👥", accent: "none" },
    { label: "Appointments",   val: 16,  delta: "+2.1%", icon: "📅", accent: "teal" },
    { label: "Reports",        val: 22,  delta: "+2%",   icon: "📋", accent: "none" },
    { label: "Total Visitors", val: 30,  delta: "+3%",   icon: "🏥", accent: "none" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ══ ROW 1 — KPI cards pop up one by one ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {KPI.map((k, i) => (
          <RevealCard key={i} delay={i * 110} direction="up">
            <Card t={t} accent={k.accent} style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{
                  background: k.accent !== "none" ? "rgba(255,255,255,0.18)" : t.accentLight,
                  color: k.accent !== "none" ? "rgba(255,255,255,0.95)" : t.accent,
                  fontSize: 10, fontWeight: 700, padding: "3px 9px",
                  borderRadius: 999, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.2px",
                }}>{k.delta}</span>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: k.accent !== "none" ? "rgba(255,255,255,0.15)" : t.accentLight,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                }}>{k.icon}</div>
              </div>
              <div style={{ fontSize: 10, color: k.accent !== "none" ? "rgba(255,255,255,0.65)" : t.muted, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, marginBottom: 3, letterSpacing: "0.4px", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 32, color: k.accent !== "none" ? "#fff" : t.text, letterSpacing: "-1px", lineHeight: 1 }}>
                <Counter to={k.val} />
              </div>
            </Card>
          </RevealCard>
        ))}
      </div>

      {/* ══ ROW 2 — Charts slide in from sides ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
        <RevealCard delay={0} direction="left">
          <Card t={t} style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: t.text }}>Patient Admissions</div>
                <div style={{ display: "flex", gap: 14, marginTop: 5 }}>
                  {[["Admitted", t.chartBar1], ["Avg", t.id === "dark" ? "rgba(255,220,150,0.22)" : "rgba(180,140,90,0.22)"]].map(([l, c]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: t.muted, fontFamily: "'DM Sans',sans-serif" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                      {l} <b style={{ color: t.text, marginLeft: 2 }}>{l === "Admitted" ? 35 : 33}</b>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {["W", "M", "Y"].map((f, i) => (
                  <button key={f} style={{
                    padding: "5px 12px", borderRadius: 8, border: `1px solid ${t.border}`,
                    background: i === 0 ? t.accentCard : "transparent",
                    color: i === 0 ? "#fff" : t.muted,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    boxShadow: i === 0 ? `0 2px 10px ${t.accent}40` : "none",
                    transition: "all 0.2s",
                  }}>{f === "W" ? "Week" : f === "M" ? "Month" : "Year"}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={195}>
              <BarChart data={WEEK} barSize={18} barCategoryGap="38%">
                <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: t.chartTxt, fontSize: 11, fontFamily: "'DM Sans',sans-serif" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: t.chartTxt, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip t={t} />} />
                <Bar dataKey="admitted" name="Admitted" fill={t.chartBar1} radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </RevealCard>

        <RevealCard delay={120} direction="right">
          <Card t={t} style={{ padding: 22 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: t.text }}>Dept. Performance</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 5 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 28, color: t.text }}>22</span>
                <span style={{ fontSize: 12, color: t.muted, fontFamily: "'DM Sans',sans-serif" }}>active consultations</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <RadarChart data={RADAR_DATA} outerRadius="68%">
                <PolarGrid stroke={t.grid} />
                <PolarAngleAxis dataKey="dept" tick={{ fill: t.muted, fontSize: 10, fontFamily: "'DM Sans',sans-serif" }} />
                <Radar dataKey="Load" stroke={t.radarA} fill={t.radarA} fillOpacity={0.2} strokeWidth={2} />
                <Radar dataKey="Beds" stroke={t.radarB} fill={t.radarB} fillOpacity={0.12} strokeWidth={1.5} />
                <Tooltip content={<ChartTip t={t} />} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </RevealCard>
      </div>

      {/* ══ ROW 3 — Bottom cards pop up staggered ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 1fr", gap: 14 }}>

        {/* Bed Occupancy */}
        <RevealCard delay={0} direction="up">
          <Card t={t} style={{ padding: 22 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 16 }}>Bed Occupancy</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <Radial value={occP} size={112} stroke={9} color={occP > 85 ? "#c0392b" : occP > 70 ? t.hi : t.accent} t={t} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ label: "Occupied", val: 234, c: t.accent }, { label: "Available", val: 71, c: t.accent }].map((s, i) => (
                <div key={i} style={{ borderRadius: 11, padding: "10px 12px", background: t.inp, border: `1px solid ${t.border}` }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 17, color: s.c }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: t.muted, fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              {depts.slice(0, 4).map((d, i) => {
                const p = pct(d.occ, d.beds);
                const c = p > 85 ? "#c0392b" : p > 65 ? t.hi : t.accent;
                return (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: t.muted, fontFamily: "'DM Sans',sans-serif" }}>{d.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: c, fontFamily: "'DM Sans',sans-serif" }}>{p}%</span>
                    </div>
                    <AnimBar pct={p} color={c} delay={i * 110} />
                  </div>
                );
              })}
            </div>
          </Card>
        </RevealCard>

        {/* Doctor Workload — each doctor card pops in individually */}
        <RevealCard delay={130} direction="up">
          <Card t={t} style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 14, color: t.text }}>Doctor Workload</div>
              <Pill label="Live" colors={t.pill.g} sm />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {docs.map((d, i) => (
                <DocCard key={i} d={d} i={i} t={t} />
              ))}
            </div>
          </Card>
        </RevealCard>

        {/* AI Insights — rows pop in one by one */}
        <RevealCard delay={260} direction="up">
          <Card t={t} style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: t.hiCard, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: `0 2px 8px ${t.hi}50` }}>🧠</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 13, color: t.text }}>AI Insights</div>
                <div style={{ fontSize: 9, color: t.muted, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.3px" }}>Smart recommendations</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {recs.map((r, i) => {
                const c = recStyle(r.type);
                return (
                  <InsightRow key={i} r={r} c={c} i={i} />
                );
              })}
            </div>
          </Card>
        </RevealCard>
      </div>
    </div>
  );
}

/* ─── Individual doctor workload card with its own pop ── */
function DocCard({ d, i, t }) {
  const [ref, visible] = useReveal(i * 80);
  return (
    <div
      ref={ref}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "9px 11px", borderRadius: 12,
        background: t.inp, border: `1px solid ${t.border}`,
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.93)",
        transition: visible
          ? `opacity 0.5s ease ${i * 80}ms, transform 0.55s cubic-bezier(.34,1.56,.64,1) ${i * 80}ms, border-color 0.2s, background 0.2s, box-shadow 0.2s`
          : "none",
        willChange: "opacity, transform",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = d.clr + "44";
        e.currentTarget.style.background  = t.surfaceElev;
        e.currentTarget.style.transform   = "translateY(-3px) scale(1.02)";
        e.currentTarget.style.boxShadow   = t.shadowHov;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.background  = t.inp;
        e.currentTarget.style.transform   = "";
        e.currentTarget.style.boxShadow   = "";
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: `${d.clr}18`, border: `1.5px solid ${d.clr}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: d.clr, fontSize: 10, fontWeight: 800,
        fontFamily: "'DM Sans',sans-serif", flexShrink: 0,
      }}>{d.av}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: t.text, fontFamily: "'DM Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name.replace("Dr. ", "")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <AnimBar pct={Math.min(100, (d.pts / 25) * 100)} color={d.pts > 18 ? "#c0392b" : d.pts > 12 ? t.hi : d.clr} delay={i * 80} />
          <span style={{ fontSize: 9, color: t.muted, flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>{d.pts}pt</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Individual insight row with its own pop ─────────── */
function InsightRow({ r, c, i }) {
  const [ref, visible] = useReveal(i * 90);
  return (
    <div
      ref={ref}
      style={{
        padding: "9px 11px", borderRadius: 11,
        background: c.bg, border: `1px solid ${c.bdr}`,
        fontSize: 10, lineHeight: 1.6,
        fontFamily: "'DM Sans',sans-serif", color: c.txt,
        display: "flex", gap: 7, alignItems: "flex-start",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-18px)",
        transition: visible
          ? `opacity 0.5s ease ${i * 90}ms, transform 0.5s cubic-bezier(.34,1.56,.64,1) ${i * 90}ms`
          : "none",
        cursor: "default",
        willChange: "opacity, transform",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
    >
      <span style={{ flexShrink: 0, fontSize: 12, marginTop: 1 }}>{r.icon}</span>
      <span>{r.msg}</span>
    </div>
  );
}
