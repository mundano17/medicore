"use client";
import React from "react";
// StatsCards.js — Pill, Counter, Radial, ChartTip, Card, Navbar
// Animations added; all original logic preserved

import { useState, useEffect } from "react";

/* ── Pill ──────────────────────────────────────────────────── */
export function Pill({ label, colors, sm }) {
  return (
    <span
      style={{
        background: colors[0],
        color: colors[1],
        border: `1px solid ${colors[1]}28`,
        borderRadius: 999,
        padding: sm ? "2px 9px" : "3px 11px",
        fontSize: sm ? 10 : 11,
        fontWeight: 700,
        fontFamily: "'DM Sans',sans-serif",
        letterSpacing: 0.2,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

/* ── Counter ────────────────────────────────────────────────── */
export function Counter({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let c = 0;
    const s = to / 55;
    const id = setInterval(() => {
      c = Math.min(c + s, to);
      setV(Math.floor(c));
      if (c >= to) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [to]);
  return <>{v.toLocaleString()}</>;
}

/* ── Radial ─────────────────────────────────────────────────── */
export function Radial({ value, size = 116, stroke = 10, color, t }) {
  const [a, setA] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setA(value), 120);
    return () => clearTimeout(id);
  }, [value]);
  const r = (size - stroke) / 2,
    C = 2 * Math.PI * r,
    d = (a / 100) * C;
  const trackColor =
    t.id === "dark" ? "rgba(255,220,150,0.06)" : "rgba(180,140,90,0.1)";
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", position: "absolute" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${d} ${C}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 1.3s cubic-bezier(.34,1.56,.64,1)",
            filter: `drop-shadow(0 0 6px ${color}70)`,
          }}
        />
      </svg>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontWeight: 700,
            fontSize: size < 100 ? 15 : 20,
            color: t.text,
            lineHeight: 1,
          }}
        >
          {a}%
        </div>
        <div
          style={{
            fontSize: 9,
            color: t.muted,
            fontFamily: "'DM Sans',sans-serif",
            marginTop: 2,
            letterSpacing: "0.5px",
          }}
        >
          OCCUPIED
        </div>
      </div>
    </div>
  );
}

/* ── ChartTip ───────────────────────────────────────────────── */
export function ChartTip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: t.surfaceSolid,
        border: `1px solid ${t.borderStrong}`,
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: t.shadow,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: t.muted,
          marginBottom: 6,
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 12,
            color: t.text,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.color,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span style={{ color: t.muted }}>{p.name}:</span>
          <b style={{ color: t.text }}>{p.value}</b>
        </div>
      ))}
    </div>
  );
}

/* ── Card ───────────────────────────────────────────────────── */
export function Card({
  children,
  t,
  style = {},
  accent = "none",
  hover = true,
  onClick,
}) {
  const [hov, setHov] = useState(false);
  const backgrounds = { none: t.surface, teal: t.accentCard, amber: t.hiCard };
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: backgrounds[accent],
        border: `1px solid ${accent !== "none" ? "rgba(255,255,255,0.15)" : t.border}`,
        borderRadius: 18,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: hov ? t.shadowHov : t.shadowCard,
        transform: hov && hover ? "translateY(-3px) scale(1.005)" : "none",
        transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            accent !== "none"
              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")"
              : "none",
          opacity: 0.5,
        }}
      />
      {children}
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────────── */
export function Navbar({
  page,
  setPage,
  user,
  onLogout,
  theme,
  toggleTheme,
  t,
  branch,
  setBranch,
  branches,
}) {
  const [branchOpen, setBranchOpen] = React.useState(false);
  const branchRef = React.useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      if (branchRef.current && !branchRef.current.contains(e.target))
        setBranchOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const pages = [
    ...(user?.role === "admin" ? ["Admin"] : []),
    ...(user?.role === "doctor" ? ["Doctor"] : []),
    "Dashboard",
    "Heatmap",
    "Patients",
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 1000,
        background: t.nav,
        borderBottom: `1px solid ${t.border}`,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 8,
        fontFamily: "'DM Sans',sans-serif",
        animation: "navDrop 0.6s cubic-bezier(.34,1.56,.64,1) both",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginRight: 16,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background:
              t.id === "light"
                ? "linear-gradient(135deg,#0d7c6e,#1ab8a4)"
                : "linear-gradient(135deg,#0a6b5e,#1ab8a4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 14px ${t.id === "light" ? "rgba(13,124,110,0.4)" : "rgba(26,184,164,0.35)"}`,
            flexShrink: 0,
            animation: "pulseRing 3s ease-in-out 2s infinite",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 700,
              fontSize: 14,
              color: t.text,
              letterSpacing: "-0.2px",
              lineHeight: 1.2,
            }}
          >
            MediCore
          </div>
          <div
            style={{
              fontSize: 8,
              color: t.muted,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              fontFamily: "'DM Sans',sans-serif",
              lineHeight: 1.2,
            }}
          >
            Intelligence
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div
        style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center" }}
      >
        {pages.map((p) => {
          const act = page === p;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: "7px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: act ? t.accentLight : "transparent",
                color: act ? t.accent : t.muted,
                fontSize: 13,
                fontWeight: act ? 700 : 400,
                fontFamily: "'DM Sans',sans-serif",
                transition: "all 0.2s",
                boxShadow: act ? `inset 0 0 0 1.5px ${t.accent}20` : "none",
              }}
              onMouseEnter={(e) => {
                if (!act) {
                  e.currentTarget.style.color = t.text;
                  e.currentTarget.style.background = t.inp;
                }
              }}
              onMouseLeave={(e) => {
                if (!act) {
                  e.currentTarget.style.color = t.muted;
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Right controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginLeft: "auto",
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            width: 60,
            height: 30,
            borderRadius: 999,
            border: `1px solid ${t.borderStrong}`,
            background: t.id === "dark" ? t.hiBg : t.accentLight,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "0 3px",
            transition: "all 0.4s cubic-bezier(.34,1.56,.64,1)",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background:
                t.id === "dark"
                  ? `linear-gradient(135deg,${t.hi},#f0b840)`
                  : `linear-gradient(135deg,${t.accent},#1ab8a4)`,
              boxShadow: `0 2px 8px ${t.id === "dark" ? t.hi + "60" : t.accent + "50"}`,
              transform: t.id === "dark" ? "translateX(29px)" : "translateX(0)",
              transition: "transform 0.4s cubic-bezier(.34,1.56,.64,1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            {t.id === "dark" ? "🌙" : "☀️"}
          </div>
        </button>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: t.inp,
                border: `1px solid ${t.border}`,
                borderRadius: 999,
                padding: "3px 12px 3px 3px",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${t.accent},${t.hi})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {user.name[0]}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: t.text,
                    lineHeight: 1.2,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {user.name.split(" ")[0]}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: t.muted,
                    textTransform: "capitalize",
                    lineHeight: 1.2,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {user.role}
                </div>
              </div>
            </div>

            {user?.role === "admin" && branches && (
              <div ref={branchRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setBranchOpen((o) => !o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 13px",
                    borderRadius: 10,
                    border: `1px solid ${t.accent}40`,
                    background: branchOpen ? t.accentLight : t.inp,
                    color: t.accent,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  🏥 {branch?.shortName || "Branch"}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{
                      transform: branchOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {branchOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: t.surface,
                      border: `1px solid ${t.border}`,
                      borderRadius: 14,
                      padding: 6,
                      minWidth: 260,
                      boxShadow: `0 16px 48px rgba(0,0,0,${t.id === "dark" ? "0.5" : "0.18"})`,
                      zIndex: 2000,
                      animation:
                        "scaleIn 0.2s cubic-bezier(.34,1.56,.64,1) both",
                      transformOrigin: "top right",
                    }}
                  >
                    <div
                      style={{
                        padding: "6px 10px 8px",
                        fontSize: 9,
                        fontWeight: 700,
                        color: t.muted,
                        fontFamily: "'DM Sans',sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      MediCore Branches
                    </div>
                    {branches.map((br) => {
                      const isActive = branch?.id === br.id;
                      return (
                        <button
                          key={br.id}
                          onClick={() => {
                            setBranch(br);
                            setBranchOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            width: "100%",
                            padding: "9px 11px",
                            borderRadius: 10,
                            border: "none",
                            textAlign: "left",
                            margin: "4px",
                            background: isActive
                              ? t.accentLight
                              : theme === "dark"
                                ? "rgba(60,60,60,1)"
                                : "transparent",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.opacity = 0.7;
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.opacity = 1;
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              flexShrink: 0,
                              background: isActive ? t.accentCard : t.inp,
                              border: `1.5px solid ${isActive ? t.accent + "40" : t.border}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                            }}
                          >
                            {br.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: isActive ? t.accent : t.text,
                                fontFamily: "'DM Sans',sans-serif",
                              }}
                            >
                              {br.name}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: t.muted,
                                fontFamily: "'DM Sans',sans-serif",
                                marginTop: 1,
                              }}
                            >
                              {br.location} · {br.beds} beds
                            </div>
                          </div>
                          {isActive && (
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: t.accent,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onLogout}
              style={{
                padding: "6px 13px",
                borderRadius: 10,
                border: "1px solid rgba(192,57,43,0.25)",
                background: "rgba(192,57,43,0.07)",
                color: "#c0392b",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(192,57,43,0.14)";
                e.currentTarget.style.borderColor = "rgba(192,57,43,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(192,57,43,0.07)";
                e.currentTarget.style.borderColor = "rgba(192,57,43,0.25)";
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setPage("Login")}
            style={{
              padding: "8px 18px",
              borderRadius: 11,
              border: "none",
              background: t.accentCard,
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              boxShadow: `0 4px 14px ${t.accent}50`,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 7px 22px ${t.accent}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = `0 4px 14px ${t.accent}50`;
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
