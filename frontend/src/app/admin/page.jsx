"use client";
// frontend/src/app/admin/page.jsx

import { useState, useEffect } from "react";
import { Card, Pill } from "../components/StatsCards";
import { pct, statPill } from "../lib/theme";

// ── Static data (same as original — no API calls needed for Admin page) ──
const DEPTS_INIT = [
  { id:1, name:"Cardiology",  beds:50, occ:44, docs:8,  pts:62, res:5.2 },
  { id:2, name:"Neurology",   beds:40, occ:28, docs:6,  pts:35, res:7.8 },
  { id:3, name:"Orthopedics", beds:35, occ:21, docs:5,  pts:28, res:4.1 },
  { id:4, name:"Pediatrics",  beds:45, occ:38, docs:7,  pts:55, res:3.6 },
  { id:5, name:"Oncology",    beds:30, occ:27, docs:5,  pts:31, res:9.4 },
  { id:6, name:"Emergency",   beds:60, occ:52, docs:12, pts:98, res:2.1 },
];
const DOCS_INIT = [
  { id:1, name:"Dr. Sarah Chen",    dept:"Cardiology",  pts:14, status:"Active",   av:"SC", clr:"#0d7c6e", specialty:"Interventional Cardiology", exp:"12 yrs", slots:8,  maxSlots:8,  overbookedSlots:2, photoGrad:"linear-gradient(135deg,#0d7c6e,#1ab8a4)", phone:"(646) 555-2001", email:"s.chen@medicore.io" },
  { id:2, name:"Dr. James Wilson",  dept:"Cardiology",  pts:12, status:"Active",   av:"JW", clr:"#c47c1a", specialty:"Electrophysiology",          exp:"9 yrs",  slots:6,  maxSlots:8,  overbookedSlots:0, photoGrad:"linear-gradient(135deg,#c47c1a,#f0a832)", phone:"(646) 555-2002", email:"j.wilson@medicore.io" },
  { id:3, name:"Dr. Priya Patel",   dept:"Neurology",   pts:9,  status:"Active",   av:"PP", clr:"#0891b2", specialty:"Neurointervention",           exp:"8 yrs",  slots:6,  maxSlots:7,  overbookedSlots:3, photoGrad:"linear-gradient(135deg,#0891b2,#06b6d4)", phone:"(646) 555-2003", email:"p.patel@medicore.io" },
  { id:4, name:"Dr. Marcus Reed",   dept:"Emergency",   pts:18, status:"On Call",  av:"MR", clr:"#c0392b", specialty:"Emergency Medicine",          exp:"15 yrs", slots:10, maxSlots:10, overbookedSlots:4, photoGrad:"linear-gradient(135deg,#c0392b,#e74c3c)", phone:"(646) 555-2004", email:"m.reed@medicore.io" },
  { id:5, name:"Dr. Aiko Tanaka",   dept:"Pediatrics",  pts:11, status:"Active",   av:"AT", clr:"#0d7c6e", specialty:"Pediatric Pulmonology",       exp:"7 yrs",  slots:7,  maxSlots:8,  overbookedSlots:1, photoGrad:"linear-gradient(135deg,#059669,#10b981)", phone:"(646) 555-2005", email:"a.tanaka@medicore.io" },
  { id:6, name:"Dr. Carlos Mendez", dept:"Oncology",    pts:9,  status:"Active",   av:"CM", clr:"#c47c1a", specialty:"Hematology-Oncology",         exp:"11 yrs", slots:5,  maxSlots:6,  overbookedSlots:0, photoGrad:"linear-gradient(135deg,#d97706,#f59e0b)", phone:"(646) 555-2006", email:"c.mendez@medicore.io" },
  { id:7, name:"Dr. Elena Vasquez", dept:"Orthopedics", pts:8,  status:"Off Duty", av:"EV", clr:"#7c5cbf", specialty:"Joint Replacement Surgery",   exp:"14 yrs", slots:0,  maxSlots:8,  overbookedSlots:0, photoGrad:"linear-gradient(135deg,#7c5cbf,#9f7aea)", phone:"(646) 555-2007", email:"e.vasquez@medicore.io" },
  { id:8, name:"Dr. Nathan Brooks", dept:"Emergency",   pts:21, status:"Active",   av:"NB", clr:"#c0392b", specialty:"Trauma Surgery",              exp:"10 yrs", slots:10, maxSlots:10, overbookedSlots:5, photoGrad:"linear-gradient(135deg,#b91c1c,#ef4444)", phone:"(646) 555-2008", email:"n.brooks@medicore.io" },
];
const BEDS_INIT = [
  { id:1, type:"OPD",       total:80,  occupied:61, reserved:6, threshold:85, icon:"🏥" },
  { id:2, type:"Emergency", total:60,  occupied:52, reserved:4, threshold:80, icon:"🚨" },
  { id:3, type:"ICU",       total:30,  occupied:27, reserved:2, threshold:75, icon:"💊" },
  { id:4, type:"Ward",      total:120, occupied:98, reserved:8, threshold:85, icon:"🛏️" },
  { id:5, type:"Recovery",  total:25,  occupied:18, reserved:3, threshold:80, icon:"🔄" },
  { id:6, type:"Pediatric", total:45,  occupied:38, reserved:5, threshold:85, icon:"👶" },
  { id:7, type:"Maternity", total:20,  occupied:14, reserved:2, threshold:80, icon:"🤱" },
  { id:8, type:"Surgical",  total:35,  occupied:28, reserved:4, threshold:82, icon:"🔬" },
];
const AMBS_INIT = [
  { id:1,  unitId:"AMB-001", driver:"Carlos Rivera",   zone:"Zone A - Manhattan",   status:"Available",   fuel:92, lat:40.758, lng:-73.985, lastCall:"08:14 AM", responseTime:"4.2 min", trips:3, phone:"(646) 555-1001" },
  { id:2,  unitId:"AMB-002", driver:"Priya Nair",      zone:"Zone A - Manhattan",   status:"On Duty",     fuel:68, lat:40.748, lng:-73.993, lastCall:"10:22 AM", responseTime:"3.8 min", trips:5, phone:"(646) 555-1002" },
  { id:3,  unitId:"AMB-003", driver:"Tom Bradley",     zone:"Zone B - Brooklyn",    status:"Available",   fuel:55, lat:40.651, lng:-73.949, lastCall:"09:05 AM", responseTime:"5.1 min", trips:2, phone:"(718) 555-1003" },
  { id:4,  unitId:"AMB-004", driver:"Maria Gonzalez",  zone:"Zone B - Brooklyn",    status:"Maintenance", fuel:0,  lat:40.661, lng:-73.944, lastCall:"Yesterday",responseTime:"—",       trips:0, phone:"(718) 555-1004" },
  { id:5,  unitId:"AMB-005", driver:"James Osei",      zone:"Zone C - Queens",      status:"On Duty",     fuel:80, lat:40.728, lng:-73.794, lastCall:"10:45 AM", responseTime:"6.3 min", trips:4, phone:"(718) 555-1005" },
  { id:6,  unitId:"AMB-006", driver:"Helen Marsh",     zone:"Zone C - Queens",      status:"Available",   fuel:95, lat:40.738, lng:-73.818, lastCall:"07:30 AM", responseTime:"5.8 min", trips:1, phone:"(718) 555-1006" },
  { id:7,  unitId:"AMB-007", driver:"Alex Chen",       zone:"Zone D - Bronx",       status:"On Duty",     fuel:44, lat:40.844, lng:-73.864, lastCall:"10:58 AM", responseTime:"7.2 min", trips:6, phone:"(718) 555-1007" },
  { id:8,  unitId:"AMB-008", driver:"Sandra Williams", zone:"Zone D - Bronx",       status:"Maintenance", fuel:0,  lat:40.854, lng:-73.872, lastCall:"Yesterday",responseTime:"—",       trips:0, phone:"(718) 555-1008" },
  { id:9,  unitId:"AMB-009", driver:"Rafael Torres",   zone:"Zone E - Staten Isl.", status:"Available",   fuel:87, lat:40.579, lng:-74.151, lastCall:"06:45 AM", responseTime:"8.9 min", trips:1, phone:"(718) 555-1009" },
  { id:10, unitId:"AMB-010", driver:"Lucy Kim",        zone:"Zone F - New Jersey",  status:"On Duty",     fuel:62, lat:40.712, lng:-74.073, lastCall:"10:10 AM", responseTime:"9.1 min", trips:3, phone:"(201) 555-1010" },
];
const AMB_ZONES = [
  { zone:"Zone A", area:"Manhattan",   total:2, available:1, onDuty:1, maintenance:0, demand:"High",   avgResponse:"4.0 min", shortfall:false },
  { zone:"Zone B", area:"Brooklyn",    total:2, available:1, onDuty:1, maintenance:1, demand:"Medium", avgResponse:"5.1 min", shortfall:true  },
  { zone:"Zone C", area:"Queens",      total:2, available:1, onDuty:1, maintenance:0, demand:"Medium", avgResponse:"6.1 min", shortfall:false },
  { zone:"Zone D", area:"Bronx",       total:2, available:0, onDuty:1, maintenance:1, demand:"High",   avgResponse:"7.2 min", shortfall:true  },
  { zone:"Zone E", area:"Staten Isl.", total:1, available:1, onDuty:0, maintenance:0, demand:"Low",    avgResponse:"8.9 min", shortfall:false },
  { zone:"Zone F", area:"New Jersey",  total:1, available:0, onDuty:1, maintenance:0, demand:"Medium", avgResponse:"9.1 min", shortfall:true  },
];

export default function AdminPage({ t, branch }) {
  const [depts,       setDepts]       = useState(branch?.depts      || DEPTS_INIT);
  const [doctors,     setDoctors]     = useState(branch?.doctors     || DOCS_INIT);
  const [beds,        setBeds]        = useState(branch?.beds_data   || BEDS_INIT);
  const [ambulances,  setAmbulances]  = useState(branch?.ambulances  || AMBS_INIT);

  // Reset all data when branch changes
  useEffect(() => {
    setDepts(branch?.depts      || DEPTS_INIT);
    setDoctors(branch?.doctors  || DOCS_INIT);
    setBeds(branch?.beds_data   || BEDS_INIT);
    setAmbulances(branch?.ambulances || AMBS_INIT);
    setEdit(null); setEditBed(null); setEditAmb(null); setAdminTab("overview");
  }, [branch?.id]);
  
  const [edit,        setEdit]        = useState(null);
  const [addDoc,      setAddDoc]      = useState(false);
  const [editBed,     setEditBed]     = useState(null);
  const [editAmb,     setEditAmb]     = useState(null);
  const [nd,          setNd]          = useState({name:"",dept:"Cardiology",pts:0,status:"Active"});
  const [saved,       setSaved]       = useState(false);
  const [adminTab,    setAdminTab]    = useState("overview");
  const [expandedBed, setExpandedBed] = useState(null);

  const save    = () => { setDepts(depts.map(d=>d.id===edit.id?edit:d)); setEdit(null); setSaved(true); setTimeout(()=>setSaved(false),2200); };
  const saveBed = () => { setBeds(beds.map(b=>b.id===editBed.id?editBed:b)); setEditBed(null); setSaved(true); setTimeout(()=>setSaved(false),2200); };
  const saveAmb = () => { setAmbulances(ambulances.map(a=>a.id===editAmb.id?editAmb:a)); setEditAmb(null); setSaved(true); setTimeout(()=>setSaved(false),2200); };

  const F = ({label,val,set,type="text",options=null}) => (
    <div style={{marginBottom:12}}>
      <label style={{display:"block",fontSize:10,fontWeight:700,color:t.muted,marginBottom:4,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:"0.6px"}}>{label}</label>
      {options ? (
        <select value={val} onChange={e=>set(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${t.inpBorder}`,background:t.inp,color:t.text,fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:"none"}}>
          {options.map(o=><option key={o} style={{background:t.id==="dark"?"#1a1610":"#fffcf7"}}>{o}</option>)}
        </select>
      ) : (
        <input value={val} onChange={e=>set(type==="number"?+e.target.value:e.target.value)} type={type}
          style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${t.inpBorder}`,background:t.inp,color:t.text,fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}/>
      )}
    </div>
  );

  const bedAlerts      = beds.filter(b=>pct(b.occupied,b.total)>=b.threshold);
  const overbookedDocs = doctors.filter(d=>d.overbookedSlots>0);
  const ambShortage    = AMB_ZONES.filter(z=>z.shortfall);
  const totalAlerts    = bedAlerts.length + overbookedDocs.length + ambShortage.length;

  const ambStatusColor = (s) => s==="Available"?"#16a34a":s==="On Duty"?t.hi:"#c0392b";
  const ambStatusBg    = (s) => s==="Available"?"rgba(22,163,74,0.1)":s==="On Duty"?t.hiBg:"rgba(192,57,43,0.1)";

  const ADMIN_TABS = [
    {k:"overview",  label:"📊 Overview"},
    {k:"beds",      label:"🛏️ Bed Management"},
    {k:"doctors",   label:"👨‍⚕️ Doctors"},
    {k:"ambulance", label:"🚑 Ambulance"},
    {k:"alerts",    label:`🚨 Alerts${totalAlerts>0?` (${totalAlerts})`:""}`},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {/* Branch Info Banner */}
      {branch && (
        <div style={{padding:"12px 18px",borderRadius:13,background:t.accentLight,border:`1px solid ${t.accent}25`,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <div style={{fontSize:28}}>{branch.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:t.text}}>{branch.name}</div>
            <div style={{fontSize:10,color:t.muted,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>
              📍 {branch.location} &nbsp;·&nbsp; 🛏️ {branch.beds} total beds &nbsp;·&nbsp; 🏥 Est. {branch.est} &nbsp;·&nbsp; 🎯 {branch.speciality}
            </div>
          </div>
          <div style={{padding:"5px 14px",borderRadius:999,background:t.accentCard,color:"white",fontSize:10,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>Active Branch</div>
        </div>
      )}

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:22,color:t.text,margin:0}}>Admin Portal</h2>
          <p style={{color:t.muted,fontSize:12,margin:"4px 0 0",fontFamily:"'DM Sans',sans-serif"}}>Hospital resource & staff command centre</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {totalAlerts>0&&<div style={{padding:"7px 14px",borderRadius:10,background:"rgba(192,57,43,0.1)",color:"#c0392b",fontSize:11,fontWeight:700,border:"1px solid rgba(192,57,43,0.25)",fontFamily:"'DM Sans',sans-serif",animation:"pulse 2s infinite"}}>🚨 {totalAlerts} Active Alerts</div>}
          {saved&&<div style={{padding:"7px 16px",borderRadius:11,background:t.accentLight,color:t.accent,fontSize:12,fontWeight:700,border:`1px solid ${t.accent}25`,fontFamily:"'DM Sans',sans-serif"}}>✓ Changes saved</div>}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{display:"flex",gap:4,background:t.inp,borderRadius:14,padding:4,border:`1px solid ${t.border}`,flexWrap:"wrap"}}>
        {ADMIN_TABS.map(tb=>(
          <button key={tb.k} onClick={()=>setAdminTab(tb.k)} style={{
            flex:1,minWidth:100,padding:"9px 12px",borderRadius:10,border:"none",
            background:adminTab===tb.k?t.surface:"transparent",
            color:adminTab===tb.k?t.accent:t.muted,
            fontSize:12,fontWeight:adminTab===tb.k?700:400,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",
            boxShadow:adminTab===tb.k?t.shadow:"none",
            transition:"all 0.2s",
          }}>{tb.label}</button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {adminTab==="overview" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[
              {label:"Total Beds",       val:beds.reduce((s,b)=>s+b.total,0),                               sub:"across all wards",                                                                   icon:"🛏️", c:t.accent},
              {label:"Occupied Beds",    val:beds.reduce((s,b)=>s+b.occupied,0),                            sub:`${pct(beds.reduce((s,b)=>s+b.occupied,0),beds.reduce((s,b)=>s+b.total,0))}% occupancy`,icon:"🏥",  c:t.hi},
              {label:"Ambulances",       val:ambulances.length,                                              sub:`${ambulances.filter(a=>a.status==="Available").length} available`,                  icon:"🚑",  c:"#16a34a"},
              {label:"Overbooked Slots", val:doctors.reduce((s,d)=>s+d.overbookedSlots,0),                  sub:"across all doctors",                                                                 icon:"⚠️",  c:"#c0392b"},
            ].map((k,i)=>(
              <Card key={i} t={t} style={{padding:18}}>
                <div style={{fontSize:22,marginBottom:8}}>{k.icon}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:28,color:k.c,lineHeight:1}}>{k.val}</div>
                <div style={{fontSize:10,color:t.muted,fontFamily:"'DM Sans',sans-serif",marginTop:4,textTransform:"uppercase",letterSpacing:"0.4px"}}>{k.label}</div>
                <div style={{fontSize:10,color:t.subtle,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{k.sub}</div>
              </Card>
            ))}
          </div>

          <Card t={t} style={{padding:22}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:t.text,marginBottom:16}}>Department Management</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
                <thead>
                  <tr style={{borderBottom:`1.5px solid ${t.border}`}}>
                    {["Department","Beds","Occupancy","Doctors","Patients","Resolution",""].map(h=>(
                      <th key={h} style={{textAlign:"left",fontSize:9,fontWeight:700,color:t.subtle,paddingBottom:9,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:"0.6px"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {depts.map((d,i)=>{
                    const p=pct(d.occ,d.beds);
                    const c=p>85?"#c0392b":p>65?t.hi:t.accent;
                    return (
                      <tr key={d.id} style={{borderBottom:`1px solid ${t.border}`,transition:"background 0.15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=t.id==="dark"?"rgba(255,240,200,0.025)":"rgba(180,140,90,0.035)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"10px 0",fontSize:12,fontWeight:700,color:t.text,fontFamily:"'DM Sans',sans-serif",paddingRight:14}}>{d.name}</td>
                        <td style={{fontSize:12,color:t.muted,fontFamily:"'DM Sans',sans-serif",paddingRight:14}}>{d.beds}</td>
                        <td style={{paddingRight:14}}>
                          <div style={{display:"flex",alignItems:"center",gap:7}}>
                            <div style={{width:55,height:5,borderRadius:999,background:t.id==="dark"?"rgba(255,220,150,0.06)":"rgba(180,140,90,0.1)",overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:999,width:`${p}%`,background:c,boxShadow:`0 0 5px ${c}60`,transition:"width 1s"}}/>
                            </div>
                            <span style={{fontSize:11,fontWeight:700,color:c,fontFamily:"'DM Sans',sans-serif"}}>{p}%</span>
                          </div>
                        </td>
                        <td style={{fontSize:12,color:t.muted,paddingRight:14,fontFamily:"'DM Sans',sans-serif"}}>{d.docs}</td>
                        <td style={{fontSize:12,color:t.muted,paddingRight:14,fontFamily:"'DM Sans',sans-serif"}}>{d.pts}</td>
                        <td style={{paddingRight:14}}><Pill label={`${d.res}d`} colors={d.res>7?t.pill.a:d.res>4?t.pill.b:t.pill.g} sm/></td>
                        <td><button onClick={()=>setEdit({...d})} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${t.borderStrong}`,background:t.accentLight,color:t.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Edit</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── BED MANAGEMENT TAB ── */}
      {adminTab==="beds" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
            {beds.map(b=>{
              const occ=pct(b.occupied,b.total);
              const avail=b.total-b.occupied-b.reserved;
              const isAlert=occ>=b.threshold;
              const c=occ>=90?"#c0392b":occ>=b.threshold?t.hi:t.accent;
              const isOpen=expandedBed===b.id;
              return (
                <Card key={b.id} t={t} style={{padding:18,border:isAlert?`1.5px solid ${c}40`:undefined}}>
                  {isAlert&&(
                    <div style={{position:"absolute",top:10,right:10,background:`${c}15`,color:c,fontSize:8,fontWeight:800,padding:"2px 7px",borderRadius:999,border:`1px solid ${c}30`,fontFamily:"'DM Sans',sans-serif"}}>⚠ LOW AVAILABILITY</div>
                  )}
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{fontSize:24}}>{b.icon}</div>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:t.text,fontFamily:"'Playfair Display',serif"}}>{b.type}</div>
                      <div style={{fontSize:10,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>Ward / Unit</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                    {[{l:"Total",v:b.total,c:t.text},{l:"Occupied",v:b.occupied,c:c},{l:"Available",v:avail,c:avail<=3?"#c0392b":"#16a34a"}].map((s,i)=>(
                      <div key={i} style={{textAlign:"center",padding:"8px 4px",borderRadius:10,background:t.inp,border:`1px solid ${t.border}`}}>
                        <div style={{fontSize:18,fontWeight:800,color:s.c,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{s.v}</div>
                        <div style={{fontSize:8,color:t.muted,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:"0.4px",marginTop:2}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:9,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>Occupancy</span>
                      <span style={{fontSize:10,fontWeight:800,color:c,fontFamily:"'DM Sans',sans-serif"}}>{occ}% {isAlert?"⚠️":""}</span>
                    </div>
                    <div style={{height:6,borderRadius:999,background:t.id==="dark"?"rgba(255,220,150,0.06)":"rgba(180,140,90,0.1)",overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:999,width:`${occ}%`,background:c,boxShadow:`0 0 8px ${c}50`,transition:"width 1.2s cubic-bezier(.34,1.56,.64,1)"}}/>
                    </div>
                    <div style={{fontSize:8,color:t.subtle,fontFamily:"'DM Sans',sans-serif",marginTop:3}}>Alert threshold: {b.threshold}% · Reserved: {b.reserved}</div>
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    <button onClick={()=>setExpandedBed(isOpen?null:b.id)} style={{flex:1,padding:"7px",borderRadius:9,border:`1px solid ${t.border}`,background:t.inp,color:t.muted,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                      {isOpen?"▲ Hide":"▼ Details"}
                    </button>
                    <button onClick={()=>setEditBed({...b})} style={{flex:1,padding:"7px",borderRadius:9,border:"none",background:t.accentCard,color:"white",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>✎ Edit</button>
                  </div>
                  {isOpen&&(
                    <div style={{marginTop:12,padding:"12px",borderRadius:11,background:t.inp,border:`1px solid ${t.border}`}}>
                      <div style={{fontSize:10,fontWeight:700,color:t.text,fontFamily:"'DM Sans',sans-serif",marginBottom:8}}>Bed Breakdown</div>
                      {[
                        {l:"Occupied",v:b.occupied,w:`${pct(b.occupied,b.total)}%`,c:c},
                        {l:"Reserved",v:b.reserved,w:`${pct(b.reserved,b.total)}%`,c:t.hi},
                        {l:"Available",v:avail,w:`${pct(avail,b.total)}%`,c:"#16a34a"},
                      ].map((row,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <div style={{width:60,fontSize:9,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>{row.l}</div>
                          <div style={{flex:1,height:4,borderRadius:999,background:t.id==="dark"?"rgba(255,220,150,0.06)":"rgba(180,140,90,0.1)",overflow:"hidden"}}>
                            <div style={{height:"100%",width:row.w,background:row.c,borderRadius:999,transition:"width 0.8s"}}/>
                          </div>
                          <div style={{width:24,fontSize:10,fontWeight:700,color:row.c,fontFamily:"'DM Sans',sans-serif",textAlign:"right"}}>{row.v}</div>
                        </div>
                      ))}
                      {avail<=3&&(
                        <div style={{marginTop:8,padding:"6px 10px",borderRadius:8,background:"rgba(192,57,43,0.1)",border:"1px solid rgba(192,57,43,0.25)",fontSize:10,color:"#c0392b",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
                          🚨 Critical: Only {avail} bed{avail!==1?"s":""} available. Consider overflow protocol.
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DOCTORS TAB ── */}
      {adminTab==="doctors" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {overbookedDocs.length>0&&(
            <div style={{padding:"14px 18px",borderRadius:13,background:"rgba(192,57,43,0.08)",border:"1.5px solid rgba(192,57,43,0.25)",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:20}}>⚠️</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#c0392b",fontFamily:"'DM Sans',sans-serif"}}>Overbooked Slots Detected</div>
                <div style={{fontSize:11,color:t.muted,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>
                  {overbookedDocs.map(d=>`${d.name} (+${d.overbookedSlots})`).join(" · ")} — Admin & doctor notified
                </div>
              </div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
            {doctors.map((d,i)=>{
              const slotPct=Math.min(100,Math.round((d.slots/d.maxSlots)*100));
              const isOverbooked=d.overbookedSlots>0;
              return (
                <Card key={d.id} t={t} style={{padding:0,overflow:"hidden",border:isOverbooked?`1.5px solid rgba(192,57,43,0.4)`:undefined}}>
                  <div style={{height:80,background:d.photoGrad,position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",inset:0,opacity:0.1,backgroundImage:"radial-gradient(circle, white 1px, transparent 1px)",backgroundSize:"16px 16px"}}/>
                    {isOverbooked&&(
                      <div style={{position:"absolute",top:8,right:8,background:"rgba(192,57,43,0.9)",color:"white",fontSize:9,fontWeight:800,padding:"3px 9px",borderRadius:999,fontFamily:"'DM Sans',sans-serif"}}>
                        ⚠ OVERBOOKED +{d.overbookedSlots}
                      </div>
                    )}
                    <div style={{position:"absolute",bottom:-20,left:16,width:52,height:52,borderRadius:14,background:"rgba(255,255,255,0.22)",border:"3px solid rgba(255,255,255,0.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"white",fontFamily:"'Playfair Display',serif",backdropFilter:"blur(8px)"}}>{d.av}</div>
                  </div>
                  <div style={{padding:"26px 16px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:t.text,fontFamily:"'DM Sans',sans-serif"}}>{d.name}</div>
                        <div style={{fontSize:10,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>{d.specialty}</div>
                      </div>
                      <Pill label={d.status} colors={statPill(d.status,t)} sm/>
                    </div>
                    <div style={{fontSize:10,color:t.subtle,fontFamily:"'DM Sans',sans-serif",marginBottom:10}}>
                      {d.dept} · {d.exp} · {d.pts} patients
                    </div>
                    <div style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:9,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>Today's slots</span>
                        <span style={{fontSize:10,fontWeight:700,color:isOverbooked?"#c0392b":t.accent,fontFamily:"'DM Sans',sans-serif"}}>{d.slots}/{d.maxSlots}{isOverbooked?` (+${d.overbookedSlots} overbooked)`:""}</span>
                      </div>
                      <div style={{height:5,borderRadius:999,background:t.id==="dark"?"rgba(255,220,150,0.06)":"rgba(180,140,90,0.1)",overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:999,width:`${Math.min(100,slotPct+(d.overbookedSlots/d.maxSlots)*100)}%`,background:isOverbooked?"#c0392b":d.clr,boxShadow:`0 0 6px ${isOverbooked?"#c0392b":d.clr}50`,transition:"width 1s"}}/>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      <div style={{flex:1,padding:"6px 8px",borderRadius:8,background:t.inp,border:`1px solid ${t.border}`}}>
                        <div style={{fontSize:8,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>📧</div>
                        <div style={{fontSize:9,color:t.text,fontFamily:"'DM Sans',sans-serif",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.email}</div>
                      </div>
                      <div style={{flex:1,padding:"6px 8px",borderRadius:8,background:t.inp,border:`1px solid ${t.border}`}}>
                        <div style={{fontSize:8,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>📱</div>
                        <div style={{fontSize:9,color:t.text,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{d.phone}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:7,marginTop:8}}>
                      <button onClick={()=>setDoctors(doctors.map(x=>x.id===d.id?{...x,overbookedSlots:0}:x))} style={{flex:1,padding:"7px",borderRadius:9,border:`1px solid ${t.border}`,background:t.inp,color:t.muted,fontSize:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Clear Overbook</button>
                      <button onClick={()=>setDoctors(doctors.filter(x=>x.id!==d.id))} style={{padding:"7px 12px",borderRadius:9,border:"1px solid rgba(192,57,43,0.22)",background:"rgba(192,57,43,0.08)",color:"#c0392b",fontSize:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Remove</button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <button onClick={()=>setAddDoc(true)} style={{padding:"13px",borderRadius:13,border:`2px dashed ${t.accent}50`,background:t.accentLight,color:t.accent,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=t.accentMid;}}
            onMouseLeave={e=>{e.currentTarget.style.background=t.accentLight;}}>
            + Add New Doctor
          </button>
        </div>
      )}

      {/* ── AMBULANCE TAB ── */}
      {adminTab==="ambulance" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card t={t} style={{padding:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:t.text}}>🗺️ Zone-wise Ambulance Heatmap</div>
              <div style={{fontSize:11,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>Feb 28, 2026 · Live View</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
              {AMB_ZONES.map((z,i)=>{
                const demandColor=z.demand==="High"?"#c0392b":z.demand==="Medium"?t.hi:"#16a34a";
                return (
                  <div key={i} style={{padding:"14px 16px",borderRadius:13,background:z.shortfall?`rgba(192,57,43,0.07)`:t.inp,border:`1.5px solid ${z.shortfall?"rgba(192,57,43,0.3)":t.border}`,position:"relative"}}>
                    {z.shortfall&&<div style={{position:"absolute",top:8,right:8,width:8,height:8,borderRadius:"50%",background:"#c0392b",boxShadow:"0 0 0 3px rgba(192,57,43,0.25)",animation:"pulse 1.5s infinite"}}/>}
                    <div style={{fontSize:12,fontWeight:800,color:t.text,fontFamily:"'DM Sans',sans-serif"}}>{z.zone}</div>
                    <div style={{fontSize:10,color:t.muted,fontFamily:"'DM Sans',sans-serif",marginBottom:10}}>{z.area}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
                      {[{l:"Available",v:z.available,c:"#16a34a"},{l:"On Duty",v:z.onDuty,c:t.hi},{l:"Maint.",v:z.maintenance,c:"#c0392b"},{l:"Total",v:z.total,c:t.text}].map((s,j)=>(
                        <div key={j} style={{padding:"5px 8px",borderRadius:8,background:t.id==="dark"?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.6)",border:`1px solid ${t.border}`}}>
                          <div style={{fontSize:14,fontWeight:800,color:s.c,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{s.v}</div>
                          <div style={{fontSize:8,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:9,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>Demand</span>
                      <span style={{fontSize:9,fontWeight:700,color:demandColor,fontFamily:"'DM Sans',sans-serif"}}>{z.demand}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:9,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>Avg Response</span>
                      <span style={{fontSize:9,fontWeight:700,color:t.text,fontFamily:"'DM Sans',sans-serif"}}>{z.avgResponse}</span>
                    </div>
                    {z.shortfall&&(
                      <div style={{padding:"6px 9px",borderRadius:8,background:"rgba(192,57,43,0.1)",border:"1px solid rgba(192,57,43,0.25)",fontSize:9,color:"#c0392b",fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                        🚨 Shortage — Deploy more units
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[
              {l:"Available",    v:ambulances.filter(a=>a.status==="Available").length,  c:"#16a34a", icon:"✅"},
              {l:"On Duty",      v:ambulances.filter(a=>a.status==="On Duty").length,     c:t.hi,      icon:"🚑"},
              {l:"Maintenance",  v:ambulances.filter(a=>a.status==="Maintenance").length, c:"#c0392b", icon:"🔧"},
              {l:"Shortage Zones",v:ambShortage.length,                                  c:"#c0392b", icon:"⚠️"},
            ].map((s,i)=>(
              <Card key={i} t={t} style={{padding:"14px 16px"}}>
                <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:26,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:9,color:t.muted,fontFamily:"'DM Sans',sans-serif",marginTop:4,textTransform:"uppercase",letterSpacing:"0.4px"}}>{s.l}</div>
              </Card>
            ))}
          </div>

          <Card t={t} style={{padding:22}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:t.text,marginBottom:16}}>🧑‍✈️ Driver Roster & Live Location</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
                <thead>
                  <tr style={{borderBottom:`1.5px solid ${t.border}`}}>
                    {["Unit","Driver","Zone / Location","Status","Fuel","Last Call","Response","Trips",""].map(h=>(
                      <th key={h} style={{textAlign:"left",fontSize:9,fontWeight:700,color:t.subtle,paddingBottom:9,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:"0.6px",paddingRight:12}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ambulances.map((a,i)=>(
                    <tr key={a.id} style={{borderBottom:`1px solid ${t.border}`,transition:"background 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=t.id==="dark"?"rgba(255,240,200,0.025)":"rgba(180,140,90,0.035)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"10px 0",paddingRight:10}}>
                        <div style={{fontSize:11,fontWeight:800,color:t.accent,fontFamily:"'DM Sans',sans-serif"}}>{a.unitId}</div>
                      </td>
                      <td style={{paddingRight:12}}>
                        <div style={{fontSize:12,fontWeight:600,color:t.text,fontFamily:"'DM Sans',sans-serif"}}>{a.driver}</div>
                        <div style={{fontSize:9,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>{a.phone}</div>
                      </td>
                      <td style={{paddingRight:12}}>
                        <div style={{fontSize:11,color:t.text,fontFamily:"'DM Sans',sans-serif"}}>{a.zone}</div>
                        <div style={{fontSize:9,color:t.subtle,fontFamily:"'DM Sans',sans-serif"}}>📍 {a.lat.toFixed(3)}, {a.lng.toFixed(3)}</div>
                      </td>
                      <td style={{paddingRight:12}}>
                        <span style={{fontSize:10,fontWeight:700,color:ambStatusColor(a.status),background:ambStatusBg(a.status),border:`1px solid ${ambStatusColor(a.status)}30`,borderRadius:999,padding:"2px 9px",fontFamily:"'DM Sans',sans-serif"}}>{a.status}</span>
                      </td>
                      <td style={{paddingRight:12}}>
                        {a.fuel>0?(
                          <div>
                            <div style={{fontSize:10,fontWeight:700,color:a.fuel<30?"#c0392b":a.fuel<60?t.hi:t.accent,fontFamily:"'DM Sans',sans-serif"}}>{a.fuel}%</div>
                            <div style={{width:44,height:3,borderRadius:999,background:t.id==="dark"?"rgba(255,220,150,0.06)":"rgba(180,140,90,0.1)",marginTop:2}}>
                              <div style={{height:"100%",width:`${a.fuel}%`,borderRadius:999,background:a.fuel<30?"#c0392b":a.fuel<60?t.hi:t.accent}}/>
                            </div>
                          </div>
                        ):<span style={{fontSize:10,color:t.subtle,fontFamily:"'DM Sans',sans-serif"}}>N/A</span>}
                      </td>
                      <td style={{fontSize:10,color:t.muted,fontFamily:"'DM Sans',sans-serif",paddingRight:12}}>{a.lastCall}</td>
                      <td style={{paddingRight:12}}>
                        <span style={{fontSize:11,fontWeight:700,color:a.responseTime==="—"?t.subtle:t.text,fontFamily:"'DM Sans',sans-serif"}}>{a.responseTime}</span>
                      </td>
                      <td style={{paddingRight:12}}>
                        <span style={{fontSize:11,fontWeight:600,color:t.muted,fontFamily:"'DM Sans',sans-serif"}}>{a.trips}</span>
                      </td>
                      <td>
                        <button onClick={()=>setEditAmb({...a})} style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.accentLight,color:t.accent,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── ALERTS TAB ── */}
      {adminTab==="alerts" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {totalAlerts===0?(
            <Card t={t} style={{padding:40,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>✅</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:t.text}}>All Clear</div>
              <div style={{color:t.muted,fontSize:12,fontFamily:"'DM Sans',sans-serif",marginTop:6}}>No active alerts at this time.</div>
            </Card>
          ):(
            <>
              {bedAlerts.length>0&&(
                <Card t={t} style={{padding:20}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:t.text,marginBottom:14}}>🛏️ Bed Availability Alerts</div>
                  {bedAlerts.map((b,i)=>{
                    const occ=pct(b.occupied,b.total);
                    const avail=b.total-b.occupied-b.reserved;
                    const c=occ>=90?"#c0392b":t.hi;
                    return (
                      <div key={i} style={{padding:"13px 16px",borderRadius:12,background:`${c}09`,border:`1.5px solid ${c}30`,marginBottom:9,display:"flex",alignItems:"center",gap:14}}>
                        <span style={{fontSize:22}}>{b.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:700,color:t.text,fontFamily:"'DM Sans',sans-serif"}}>{b.type} Ward — {occ}% Occupied</div>
                          <div style={{fontSize:11,color:t.muted,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>Only {avail} bed{avail!==1?"s":""} available · Threshold {b.threshold}% · {b.occupied}/{b.total} beds in use</div>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <span style={{fontSize:10,fontWeight:800,color:c,background:`${c}15`,border:`1px solid ${c}30`,borderRadius:999,padding:"3px 10px",fontFamily:"'DM Sans',sans-serif"}}>{occ>=90?"CRITICAL":"WARNING"}</span>
                          <button onClick={()=>{setAdminTab("beds");setExpandedBed(b.id);}} style={{padding:"6px 12px",borderRadius:9,border:"none",background:t.accentCard,color:"white",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Manage</button>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              )}
              {overbookedDocs.length>0&&(
                <Card t={t} style={{padding:20}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:t.text,marginBottom:14}}>👨‍⚕️ Overbooked Doctor Slots</div>
                  {overbookedDocs.map((d,i)=>(
                    <div key={i} style={{padding:"13px 16px",borderRadius:12,background:"rgba(192,57,43,0.07)",border:"1.5px solid rgba(192,57,43,0.28)",marginBottom:9,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:42,height:42,borderRadius:13,background:d.photoGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"white",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>{d.av}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:t.text,fontFamily:"'DM Sans',sans-serif"}}>{d.name} — {d.overbookedSlots} Overbooked Slot{d.overbookedSlots!==1?"s":""}</div>
                        <div style={{fontSize:11,color:t.muted,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{d.dept} · {d.slots}/{d.maxSlots} slots filled · Reported to doctor & admin</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <span style={{fontSize:10,fontWeight:800,color:"#c0392b",background:"rgba(192,57,43,0.12)",border:"1px solid rgba(192,57,43,0.25)",borderRadius:999,padding:"3px 10px",fontFamily:"'DM Sans',sans-serif"}}>OVERBOOKED</span>
                        <button onClick={()=>setDoctors(doctors.map(x=>x.id===d.id?{...x,overbookedSlots:0}:x))} style={{padding:"6px 12px",borderRadius:9,border:"none",background:t.accentCard,color:"white",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Resolve</button>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
              {ambShortage.length>0&&(
                <Card t={t} style={{padding:20}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:t.text,marginBottom:14}}>🚑 Ambulance Zone Shortages</div>
                  {ambShortage.map((z,i)=>(
                    <div key={i} style={{padding:"13px 16px",borderRadius:12,background:"rgba(192,57,43,0.07)",border:"1.5px solid rgba(192,57,43,0.28)",marginBottom:9,display:"flex",alignItems:"center",gap:14}}>
                      <span style={{fontSize:24}}>🚑</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:t.text,fontFamily:"'DM Sans',sans-serif"}}>{z.zone} — {z.area}</div>
                        <div style={{fontSize:11,color:t.muted,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>
                          {z.maintenance} in maintenance · {z.available} available · Demand: {z.demand} · Avg response: {z.avgResponse}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <span style={{fontSize:10,fontWeight:800,color:"#c0392b",background:"rgba(192,57,43,0.12)",border:"1px solid rgba(192,57,43,0.25)",borderRadius:999,padding:"3px 10px",fontFamily:"'DM Sans',sans-serif"}}>SHORTAGE</span>
                        <button onClick={()=>setAdminTab("ambulance")} style={{padding:"6px 12px",borderRadius:9,border:"none",background:t.accentCard,color:"white",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Deploy</button>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* ── MODALS ── */}
      {edit&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)"}}>
          <Card t={t} style={{width:"100%",maxWidth:420,padding:26,margin:20}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:17,color:t.text,marginBottom:18}}>Edit {edit.name}</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <F label="Total Beds" val={edit.beds} set={v=>setEdit({...edit,beds:v})} type="number"/>
              <F label="Occupied Beds" val={edit.occ} set={v=>setEdit({...edit,occ:v})} type="number"/>
              <F label="Doctors" val={edit.docs} set={v=>setEdit({...edit,docs:v})} type="number"/>
              <F label="Patients" val={edit.pts} set={v=>setEdit({...edit,pts:v})} type="number"/>
              <F label="Avg Resolution (days)" val={edit.res} set={v=>setEdit({...edit,res:v})} type="number"/>
            </div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button onClick={save} style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:t.accentCard,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Save Changes</button>
              <button onClick={()=>setEdit(null)} style={{flex:1,padding:"11px",borderRadius:11,border:`1px solid ${t.border}`,background:t.inp,color:t.muted,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
            </div>
          </Card>
        </div>
      )}
      {editBed&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)"}}>
          <Card t={t} style={{width:"100%",maxWidth:400,padding:26,margin:20}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:17,color:t.text,marginBottom:18}}>{editBed.icon} Edit {editBed.type} Beds</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <F label="Total Beds" val={editBed.total} set={v=>setEditBed({...editBed,total:v})} type="number"/>
              <F label="Occupied" val={editBed.occupied} set={v=>setEditBed({...editBed,occupied:v})} type="number"/>
              <F label="Reserved" val={editBed.reserved} set={v=>setEditBed({...editBed,reserved:v})} type="number"/>
              <F label="Alert Threshold %" val={editBed.threshold} set={v=>setEditBed({...editBed,threshold:v})} type="number"/>
            </div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button onClick={saveBed} style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:t.accentCard,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Save</button>
              <button onClick={()=>setEditBed(null)} style={{flex:1,padding:"11px",borderRadius:11,border:`1px solid ${t.border}`,background:t.inp,color:t.muted,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
            </div>
          </Card>
        </div>
      )}
      {editAmb&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)"}}>
          <Card t={t} style={{width:"100%",maxWidth:420,padding:26,margin:20}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:17,color:t.text,marginBottom:18}}>🚑 Edit {editAmb.unitId}</h3>
            <F label="Driver Name" val={editAmb.driver} set={v=>setEditAmb({...editAmb,driver:v})}/>
            <F label="Zone" val={editAmb.zone} set={v=>setEditAmb({...editAmb,zone:v})}/>
            <F label="Status" val={editAmb.status} set={v=>setEditAmb({...editAmb,status:v})} options={["Available","On Duty","Maintenance"]}/>
            <F label="Fuel %" val={editAmb.fuel} set={v=>setEditAmb({...editAmb,fuel:v})} type="number"/>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button onClick={saveAmb} style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:t.accentCard,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Save</button>
              <button onClick={()=>setEditAmb(null)} style={{flex:1,padding:"11px",borderRadius:11,border:`1px solid ${t.border}`,background:t.inp,color:t.muted,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
            </div>
          </Card>
        </div>
      )}
      {addDoc&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)"}}>
          <Card t={t} style={{width:"100%",maxWidth:380,padding:26,margin:20}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:17,color:t.text,marginBottom:18}}>Add New Doctor</h3>
            <F label="Full Name" val={nd.name} set={v=>setNd({...nd,name:v})}/>
            <F label="Department" val={nd.dept} set={v=>setNd({...nd,dept:v})} options={DEPTS_INIT.map(d=>d.name)}/>
            <F label="Specialty" val={nd.specialty||""} set={v=>setNd({...nd,specialty:v})}/>
            <F label="Current Patients" val={nd.pts} set={v=>setNd({...nd,pts:v})} type="number"/>
            <F label="Max Slots" val={nd.maxSlots||8} set={v=>setNd({...nd,maxSlots:v})} type="number"/>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button onClick={()=>{
                if(!nd.name)return;
                const av=nd.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
                const clr=[t.accent,t.hi,"#7c5cbf","#c0392b"][doctors.length%4];
                setDoctors([...doctors,{...nd,id:doctors.length+1,av,clr,slots:0,overbookedSlots:0,photoGrad:`linear-gradient(135deg,${clr},${clr}aa)`,status:"Active",phone:"(646) 555-0000",email:`${av.toLowerCase()}@medicore.io`,exp:"0 yrs"}]);
                setAddDoc(false); setNd({name:"",dept:"Cardiology",pts:0,status:"Active"});
              }} style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#0d7c6e,#1ab8a4)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Add Doctor</button>
              <button onClick={()=>setAddDoc(false)} style={{flex:1,padding:"11px",borderRadius:11,border:`1px solid ${t.border}`,background:t.inp,color:t.muted,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
            </div>
          </Card>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}
