"use client";
/**
 * DoctorPicker.jsx
 * ─────────────────────────────────────────────────────────────────
 * File location: frontend/src/app/components/DoctorPicker.jsx
 *
 * HOW TO USE in page.jsx (Login component):
 *   1. Import at top:
 *        import DoctorPicker from "./components/DoctorPicker";
 *
 *   2. Replace the doctor profile grid section inside the Login
 *      component (the <div style={{...gridTemplateColumns:"1fr 1fr"...}}>
 *      that maps DOCS) with:
 *        <DoctorPicker
 *          docs={DOCS}
 *          selected={selectedDoc}
 *          onSelect={setSelectedDoc}
 *          t={t}
 *        />
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Extra doctor metadata (qualifications, experience details) ── */
const DOC_META = {
  "Dr. Sarah Chen": {
    title: "MD, FACC",
    qual: "Harvard Medical School",
    exp: "12 yrs",
    specialty: "Interventional Cardiology",
    awards: "Best Cardiologist NY 2023",
    gender: "f",
    skinTone: "#e8b89a",
    hairColor: "#1a0a00",
  },
  "Dr. James Wilson": {
    title: "MD, PhD",
    qual: "Johns Hopkins University",
    exp: "9 yrs",
    specialty: "Electrophysiology",
    awards: "Top Doctor 2022",
    gender: "m",
    skinTone: "#d4956a",
    hairColor: "#3d1f00",
  },
  "Dr. Priya Patel": {
    title: "MD, DM Neurology",
    qual: "AIIMS New Delhi",
    exp: "8 yrs",
    specialty: "Neurointervention",
    awards: "Research Excellence 2021",
    gender: "f",
    skinTone: "#c68642",
    hairColor: "#0d0400",
  },
  "Dr. Marcus Reed": {
    title: "MD, FACEP",
    qual: "Stanford University",
    exp: "15 yrs",
    specialty: "Emergency Medicine",
    awards: "Lifesaver Award 2023",
    gender: "m",
    skinTone: "#8d5524",
    hairColor: "#1a0a00",
  },
  "Dr. Aiko Tanaka": {
    title: "MD, FAAP",
    qual: "Tokyo Medical University",
    exp: "7 yrs",
    specialty: "Pediatric Pulmonology",
    awards: "Young Physician Award 2022",
    gender: "f",
    skinTone: "#e8c49a",
    hairColor: "#0a0500",
  },
  "Dr. Carlos Mendez": {
    title: "MD, FASCO",
    qual: "University of Barcelona",
    exp: "11 yrs",
    specialty: "Hematology-Oncology",
    awards: "Cancer Research Award 2022",
    gender: "m",
    skinTone: "#c68642",
    hairColor: "#1f0e00",
  },
  "Dr. Elena Vasquez": {
    title: "MD, FRCS",
    qual: "University of Madrid",
    exp: "14 yrs",
    specialty: "Joint Replacement Surgery",
    awards: "Surgical Excellence 2023",
    gender: "f",
    skinTone: "#d4956a",
    hairColor: "#2d1500",
  },
  "Dr. Nathan Brooks": {
    title: "MD, FACS",
    qual: "Columbia University",
    exp: "10 yrs",
    specialty: "Trauma Surgery",
    awards: "Emergency Hero 2023",
    gender: "m",
    skinTone: "#a0522d",
    hairColor: "#0d0700",
  },
};

/* ── 3D Doctor Avatar using CSS 3D transforms ────────────────────
   Pure CSS/SVG — no external 3D library needed, works SSR-safe
   The figure is draggable to rotate on Y axis
   ─────────────────────────────────────────────────────────────── */
function DoctorAvatar3D({ doc, meta, isSelected, accentColor }) {
  const [rotY, setRotY]     = useState(15);
  const [rotX, setRotX]     = useState(-5);
  const [isDrag, setIsDrag] = useState(false);
  const [bobT, setBobT]     = useState(0);
  const dragStart = useRef(null);
  const animRef   = useRef(null);
  const mountRef  = useRef(null);

  /* gentle bob animation */
  useEffect(() => {
    let frame;
    const animate = () => {
      setBobT(t => t + 0.025);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* mouse drag */
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDrag(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX };
  }, [rotY, rotX]);

  useEffect(() => {
    if (!isDrag) return;
    const onMove = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setRotY(dragStart.current.ry + dx * 0.55);
      setRotX(Math.max(-25, Math.min(15, dragStart.current.rx + dy * 0.25)));
    };
    const onUp = () => setIsDrag(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDrag]);

  /* touch drag */
  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    setIsDrag(true);
    dragStart.current = { x: t.clientX, y: t.clientY, ry: rotY, rx: rotX };
  }, [rotY, rotX]);

  useEffect(() => {
    if (!isDrag) return;
    const onMove = (e) => {
      const t = e.touches[0];
      const dx = t.clientX - dragStart.current.x;
      const dy = t.clientY - dragStart.current.y;
      setRotY(dragStart.current.ry + dx * 0.55);
      setRotX(Math.max(-25, Math.min(15, dragStart.current.rx + dy * 0.25)));
    };
    const onUp = () => setIsDrag(false);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDrag]);

  const bobY  = Math.sin(bobT) * 3;
  const bobRz = Math.sin(bobT * 0.5) * 1.2;
  const skin  = meta.skinTone;
  const hair  = meta.hairColor;
  const isFem = meta.gender === "f";

  /* coat colour based on accent */
  const coatColor  = "#ffffff";
  const coatShadow = "#e0e8f0";
  const scrubColor = accentColor + "cc";
  const stethColor = "#aab4be";

  return (
    <div
      ref={mountRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        width: "100%", height: 170,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: isDrag ? "grabbing" : "grab",
        userSelect: "none",
        perspective: 600,
      }}
    >
      <div style={{
        transformStyle: "preserve-3d",
        transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(${bobY}px) rotateZ(${bobRz}deg)`,
        transition: isDrag ? "none" : "transform 0.08s linear",
        willChange: "transform",
      }}>
        {/* ── SVG Doctor Figure ── */}
        <svg
          width="90" height="155"
          viewBox="0 0 90 155"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: isSelected ? `drop-shadow(0 6px 18px ${accentColor}70)` : "drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }}
        >
          {/* Shadow on floor */}
          <ellipse cx="45" cy="152" rx="22" ry="4" fill="rgba(0,0,0,0.15)"/>

          {/* ── Legs ── */}
          <rect x="31" y="108" width="12" height="36" rx="5" fill={scrubColor}/>
          <rect x="47" y="108" width="12" height="36" rx="5" fill={scrubColor}/>
          {/* Shoes */}
          <ellipse cx="37" cy="145" rx="9" ry="4.5" fill="#2d2d2d"/>
          <ellipse cx="53" cy="145" rx="9" ry="4.5" fill="#2d2d2d"/>

          {/* ── Body / White coat ── */}
          <rect x="24" y="62" width="42" height="52" rx="8" fill={coatColor}/>
          {/* Coat lapels */}
          <path d="M45 62 L35 74 L45 70Z" fill={coatShadow}/>
          <path d="M45 62 L55 74 L45 70Z" fill={coatShadow}/>
          {/* Coat buttons */}
          <circle cx="45" cy="80" r="1.5" fill="#c8d0d8"/>
          <circle cx="45" cy="89" r="1.5" fill="#c8d0d8"/>
          <circle cx="45" cy="98" r="1.5" fill="#c8d0d8"/>
          {/* Coat pocket */}
          <rect x="27" y="74" width="11" height="7" rx="2" fill={coatShadow} stroke="#d0d8e0" strokeWidth="0.5"/>
          {/* Pen in pocket */}
          <rect x="32" y="72" width="1.5" height="5" rx="0.5" fill={accentColor}/>

          {/* ── Scrubs under coat ── */}
          <rect x="28" y="62" width="34" height="52" rx="6" fill={scrubColor} style={{ clipPath: "inset(0 12px 0 12px)" }}/>

          {/* ── Arms ── */}
          {/* Left arm */}
          <rect x="12" y="64" width="13" height="38" rx="6" fill={coatColor}/>
          <rect x="13" y="95" width="11" height="10" rx="4" fill={skin}/>
          {/* Right arm */}
          <rect x="65" y="64" width="13" height="38" rx="6" fill={coatColor}/>
          <rect x="66" y="95" width="11" height="10" rx="4" fill={skin}/>

          {/* Clipboard in right hand */}
          <rect x="66" y="85" width="14" height="18" rx="2" fill="#f5f0e8" stroke="#c8b890" strokeWidth="0.8"/>
          <rect x="68" y="79" width="10" height="4" rx="2" fill="#c8b890"/>
          <line x1="69" y1="90" x2="78" y2="90" stroke={accentColor} strokeWidth="1.2"/>
          <line x1="69" y1="94" x2="78" y2="94" stroke="#c8d0d8" strokeWidth="0.8"/>
          <line x1="69" y1="97" x2="75" y2="97" stroke="#c8d0d8" strokeWidth="0.8"/>

          {/* ── Neck ── */}
          <rect x="39" y="50" width="12" height="16" rx="5" fill={skin}/>

          {/* ── Stethoscope ── */}
          <path d={`M33 68 Q28 58 32 52 Q36 46 42 50`} stroke={stethColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d={`M57 68 Q62 58 58 52 Q54 46 48 50`} stroke={stethColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <circle cx="45" cy="50" r="4" fill={stethColor}/>
          <circle cx="45" cy="50" r="2" fill="#888"/>

          {/* ── Head ── */}
          <ellipse cx="45" cy="36" rx="19" ry="21" fill={skin}/>

          {/* ── Hair ── */}
          {isFem ? (
            <>
              {/* Female long hair */}
              <ellipse cx="45" cy="19" rx="19" ry="11" fill={hair}/>
              <rect x="26" y="19" width="6" height="28" rx="3" fill={hair}/>
              <rect x="58" y="19" width="6" height="28" rx="3" fill={hair}/>
              <ellipse cx="45" cy="20" rx="15" ry="7" fill={hair}/>
            </>
          ) : (
            <>
              {/* Male short hair */}
              <ellipse cx="45" cy="20" rx="19" ry="10" fill={hair}/>
              <rect x="26" y="20" width="38" height="10" rx="2" fill={hair}/>
            </>
          )}

          {/* ── Face features ── */}
          {/* Eyes */}
          <ellipse cx="38" cy="35" rx="3.5" ry="3.8" fill="white"/>
          <ellipse cx="52" cy="35" rx="3.5" ry="3.8" fill="white"/>
          <circle cx="38.8" cy="35.5" r="2" fill="#2a1a0a"/>
          <circle cx="52.8" cy="35.5" r="2" fill="#2a1a0a"/>
          <circle cx="39.5" cy="34.5" r="0.7" fill="white"/>
          <circle cx="53.5" cy="34.5" r="0.7" fill="white"/>
          {/* Eyebrows */}
          <path d="M35 30 Q38.5 28 42 30" stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M49 30 Q52.5 28 56 30" stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Nose */}
          <path d="M43.5 37 Q45 40 46.5 37" stroke={skin === "#8d5524" ? "#7a4520" : "#c8906a"} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          {/* Smile */}
          <path d="M40 43 Q45 47 50 43" stroke="#c0786a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

          {/* ── ID Badge ── */}
          <rect x="38" y="68" width="14" height="10" rx="2" fill={accentColor}/>
          <text x="45" y="75.5" textAnchor="middle" fontSize="4" fill="white" fontFamily="sans-serif" fontWeight="bold">
            {doc.av}
          </text>
          {/* Badge lanyard */}
          <line x1="42" y1="68" x2="40" y2="63" stroke="#888" strokeWidth="1"/>
          <line x1="48" y1="68" x2="50" y2="63" stroke="#888" strokeWidth="1"/>

          {/* ── Glow ring if selected ── */}
          {isSelected && (
            <ellipse cx="45" cy="152" rx="30" ry="5"
              fill={accentColor} opacity="0.3"
              style={{ animation: "pulseRing 2s ease-in-out infinite" }}
            />
          )}
        </svg>
      </div>
    </div>
  );
}

/* ── Single Doctor Card ───────────────────────────────────────── */
function DoctorCard({ doc, meta, isSelected, onSelect, t }) {
  const [hovered, setHovered] = useState(false);

  const active = isSelected || hovered;

  return (
    <div
      onClick={() => onSelect(doc)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        border: `2px solid ${isSelected ? doc.clr : hovered ? doc.clr + "60" : (t.border || "rgba(180,140,90,0.14)")}`,
        background: isSelected
          ? `${doc.clr}12`
          : hovered
          ? `${doc.clr}07`
          : (t.inp || "rgba(180,140,90,0.06)"),
        cursor: "pointer",
        padding: "8px 10px 10px",
        transition: "all 0.28s cubic-bezier(.34,1.56,.64,1)",
        transform: isSelected ? "scale(1.03)" : hovered ? "scale(1.015)" : "scale(1)",
        boxShadow: isSelected
          ? `0 8px 28px ${doc.clr}30, 0 0 0 1px ${doc.clr}40`
          : hovered
          ? `0 4px 16px ${doc.clr}20`
          : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Selected glow effect */}
      {isSelected && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 14,
          background: `radial-gradient(ellipse at 50% 0%, ${doc.clr}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}

      {/* 3D avatar */}
      <DoctorAvatar3D
        doc={doc}
        meta={meta}
        isSelected={isSelected}
        accentColor={doc.clr}
      />

      {/* Doctor info */}
      <div style={{ textAlign: "center", marginTop: 4 }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: isSelected ? doc.clr : (t.text || "#1c1208"),
          fontFamily: "'DM Sans',sans-serif", lineHeight: 1.2,
          transition: "color 0.2s",
        }}>
          {doc.name.replace("Dr. ", "Dr. ")}
        </div>
        <div style={{
          fontSize: 9, color: t.muted || "#8c7355",
          fontFamily: "'DM Sans',sans-serif", marginTop: 2,
          fontWeight: 500,
        }}>
          {meta.title}
        </div>
        <div style={{
          display: "inline-block",
          marginTop: 5,
          fontSize: 8, fontWeight: 700,
          color: isSelected ? "#fff" : doc.clr,
          background: isSelected ? doc.clr : `${doc.clr}18`,
          border: `1px solid ${doc.clr}40`,
          borderRadius: 999,
          padding: "2px 8px",
          fontFamily: "'DM Sans',sans-serif",
          letterSpacing: "0.3px",
          transition: "all 0.2s",
        }}>
          {doc.dept}
        </div>

        {/* Expanded details when selected */}
        <div style={{
          maxHeight: isSelected ? 80 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(.25,.46,.45,.94)",
          marginTop: isSelected ? 6 : 0,
        }}>
          {[
            { icon: "🎓", val: meta.qual },
            { icon: "⏱", val: meta.exp + " experience" },
            { icon: "🏆", val: meta.awards },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 8, color: t.muted || "#8c7355",
              fontFamily: "'DM Sans',sans-serif",
              marginTop: 3, justifyContent: "center",
            }}>
              <span>{row.icon}</span>
              <span style={{ lineHeight: 1.3 }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected checkmark */}
      {isSelected && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 18, height: 18, borderRadius: "50%",
          background: doc.clr,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, color: "white",
          boxShadow: `0 2px 8px ${doc.clr}50`,
          animation: "scaleIn 0.25s cubic-bezier(.34,1.56,.64,1) both",
        }}>✓</div>
      )}
    </div>
  );
}

/* ── Main DoctorPicker component ─────────────────────────────── */
export default function DoctorPicker({ docs, selected, onSelect, t }) {
  return (
    <div>
      <label style={{
        display: "block",
        fontSize: 11, fontWeight: 600,
        color: t.muted || "#8c7355",
        marginBottom: 10,
        fontFamily: "'DM Sans',sans-serif",
        letterSpacing: "0.4px",
      }}>
        Select Your Profile — drag avatar to rotate 3D
      </label>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8,
        maxHeight: 380,
        overflowY: "auto",
        paddingRight: 2,
        paddingBottom: 4,
      }}>
        {docs.map(doc => {
          const meta = DOC_META[doc.name] || {
            title: "MD", qual: "Medical School", exp: "5 yrs",
            specialty: doc.dept, awards: "—",
            gender: "m", skinTone: "#d4956a", hairColor: "#1a0a00",
          };
          return (
            <DoctorCard
              key={doc.id}
              doc={doc}
              meta={meta}
              isSelected={selected?.id === doc.id}
              onSelect={onSelect}
              t={t}
            />
          );
        })}
      </div>

      {/* Keyframes injected inline (no globals dependency) */}
      <style>{`
        @keyframes pulseRing {
          0%,100% { opacity: 0.3; transform: scaleX(1); }
          50%      { opacity: 0.6; transform: scaleX(1.15); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(0.5); }
          to   { opacity:1; transform:scale(1); }
        }
      `}</style>
    </div>
  );
}
