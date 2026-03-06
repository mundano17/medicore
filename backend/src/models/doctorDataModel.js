// backend/src/models/doctorDataModel.js

const DOCS = [
  { id:1, name:"Dr. Sarah Chen",    dept:"Cardiology",  pts:14, status:"Active",   av:"SC", clr:"#0d7c6e", specialty:"Interventional Cardiology", exp:"12 yrs", slots:8,  maxSlots:8,  overbookedSlots:2, photoGrad:"linear-gradient(135deg,#0d7c6e,#1ab8a4)", phone:"(646) 555-2001", email:"s.chen@medicore.io" },
  { id:2, name:"Dr. James Wilson",  dept:"Cardiology",  pts:12, status:"Active",   av:"JW", clr:"#c47c1a", specialty:"Electrophysiology",          exp:"9 yrs",  slots:6,  maxSlots:8,  overbookedSlots:0, photoGrad:"linear-gradient(135deg,#c47c1a,#f0a832)", phone:"(646) 555-2002", email:"j.wilson@medicore.io" },
  { id:3, name:"Dr. Priya Patel",   dept:"Neurology",   pts:9,  status:"Active",   av:"PP", clr:"#0891b2", specialty:"Neurointervention",           exp:"8 yrs",  slots:6,  maxSlots:7,  overbookedSlots:3, photoGrad:"linear-gradient(135deg,#0891b2,#06b6d4)", phone:"(646) 555-2003", email:"p.patel@medicore.io" },
  { id:4, name:"Dr. Marcus Reed",   dept:"Emergency",   pts:18, status:"On Call",  av:"MR", clr:"#c0392b", specialty:"Emergency Medicine",          exp:"15 yrs", slots:10, maxSlots:10, overbookedSlots:4, photoGrad:"linear-gradient(135deg,#c0392b,#e74c3c)", phone:"(646) 555-2004", email:"m.reed@medicore.io" },
  { id:5, name:"Dr. Aiko Tanaka",   dept:"Pediatrics",  pts:11, status:"Active",   av:"AT", clr:"#0d7c6e", specialty:"Pediatric Pulmonology",       exp:"7 yrs",  slots:7,  maxSlots:8,  overbookedSlots:1, photoGrad:"linear-gradient(135deg,#059669,#10b981)", phone:"(646) 555-2005", email:"a.tanaka@medicore.io" },
  { id:6, name:"Dr. Carlos Mendez", dept:"Oncology",    pts:9,  status:"Active",   av:"CM", clr:"#c47c1a", specialty:"Hematology-Oncology",         exp:"11 yrs", slots:5,  maxSlots:6,  overbookedSlots:0, photoGrad:"linear-gradient(135deg,#d97706,#f59e0b)", phone:"(646) 555-2006", email:"c.mendez@medicore.io" },
  { id:7, name:"Dr. Elena Vasquez", dept:"Orthopedics", pts:8,  status:"Off Duty", av:"EV", clr:"#7c5cbf", specialty:"Joint Replacement Surgery",   exp:"14 yrs", slots:0,  maxSlots:8,  overbookedSlots:0, photoGrad:"linear-gradient(135deg,#7c5cbf,#9f7aea)", phone:"(646) 555-2007", email:"e.vasquez@medicore.io" },
  { id:8, name:"Dr. Nathan Brooks", dept:"Emergency",   pts:21, status:"Active",   av:"NB", clr:"#c0392b", specialty:"Trauma Surgery",              exp:"10 yrs", slots:10, maxSlots:10, overbookedSlots:5, photoGrad:"linear-gradient(135deg,#b91c1c,#ef4444)", phone:"(646) 555-2008", email:"n.brooks@medicore.io" },
];

const DOCTOR_SCHEDULE = {
  "Dr. Sarah Chen": [
    { time:"08:00", patient:"Alice Morgan",   age:67, reason:"Coronary Follow-up",   type:"Checkup",     status:"Confirmed", room:"A201", notes:"Monitor BP, ECG required. Patient on metoprolol 50mg.", phone:"(718) 555-0101", insurance:"Blue Cross" },
    { time:"09:00", patient:"George Adams",   age:71, reason:"Heart Failure Review", type:"Critical",    status:"Confirmed", room:"A201", notes:"Ejection fraction 35%. Increase furosemide if edema.",  phone:"(718) 555-0102", insurance:"Medicare"   },
    { time:"10:00", patient:"Elena Russo",    age:52, reason:"Arrhythmia Consult",   type:"Consult",     status:"Confirmed", room:"A201", notes:"Holter monitor results pending. Discuss ablation.",     phone:"(917) 555-0103", insurance:"Aetna"      },
    { time:"11:00", patient:"David Lawson",   age:44, reason:"Post-Op Cardiac",      type:"Post-Op",     status:"Pending",   room:"A201", notes:"CABG day 10 recovery. Check incision site.",           phone:"(718) 555-0104", insurance:"United"     },
    { time:"13:00", patient:"Martha Briggs",  age:63, reason:"Stress Test Results",  type:"Results",     status:"Confirmed", room:"A202", notes:"Positive stress test. Discuss catheterization.",        phone:"(212) 555-0105", insurance:"Cigna"      },
    { time:"14:00", patient:"Raymond Foster", age:58, reason:"Hypertension Mgmt.",   type:"Checkup",     status:"Confirmed", room:"A202", notes:"BP 160/100 last visit. Adjust lisinopril dosage.",     phone:"(718) 555-0106", insurance:"Blue Cross" },
    { time:"15:00", patient:"Nadia Schwartz", age:49, reason:"New Patient Intake",   type:"New Patient", status:"Pending",   room:"A202", notes:"Referred by Dr. Wilson. Family history of CAD.",       phone:"(646) 555-0107", insurance:"Medicare"   },
    { time:"16:00", patient:"Victor Huang",   age:71, reason:"Medication Review",    type:"Checkup",     status:"Confirmed", room:"A202", notes:"Warfarin INR check. Target range 2-3.",                phone:"(718) 555-0108", insurance:"Humana"     },
  ],
  "Dr. James Wilson": [
    { time:"08:30", patient:"Susan Clarke",   age:41, reason:"Arrhythmia Follow-up", type:"Follow-up", status:"Confirmed", room:"B105", notes:"Pacemaker check. Device data download required.",      phone:"(201) 555-0201", insurance:"Aetna"   },
    { time:"09:30", patient:"Henry Walsh",    age:55, reason:"Valve Disease",        type:"Consult",   status:"Confirmed", room:"B105", notes:"Mitral regurgitation moderate. Discuss surgery.",     phone:"(718) 555-0202", insurance:"United"  },
    { time:"10:30", patient:"Patricia Osei",  age:67, reason:"Cardiac Rehab Review", type:"Checkup",   status:"Pending",   room:"B105", notes:"Phase 3 rehab. Assess exercise tolerance.",          phone:"(718) 555-0203", insurance:"Medicare"},
    { time:"12:00", patient:"Leon Marchand",  age:38, reason:"Sports Cardiac Screen",type:"Screening", status:"Confirmed", room:"B106", notes:"Competitive athlete screening. Full echo.",           phone:"(917) 555-0204", insurance:"Blue Cross"},
    { time:"14:00", patient:"Greta Hoffman",  age:72, reason:"Heart Failure",        type:"Critical",  status:"Confirmed", room:"B106", notes:"NYHA Class III. Consider ICD placement.",            phone:"(718) 555-0205", insurance:"Medicare"},
    { time:"15:30", patient:"Omar Khalid",    age:50, reason:"Chest Pain Workup",    type:"Consult",   status:"Pending",   room:"B106", notes:"Atypical chest pain. Troponins normal. CTA chest.", phone:"(646) 555-0206", insurance:"Cigna"   },
  ],
  "Dr. Priya Patel": [
    { time:"08:00", patient:"Robert Kim",      age:45, reason:"Hemorrhage Follow-up", type:"Critical",  status:"Confirmed", room:"N301", notes:"Post-hemorrhage day 12. Neuro assessment.",           phone:"(718) 555-0301", insurance:"Blue Cross"},
    { time:"09:00", patient:"Fatima Al-Zahra", age:36, reason:"Migraine Management",  type:"Checkup",   status:"Confirmed", room:"N301", notes:"Chronic migraine. Trial topiramate 50mg.",            phone:"(201) 555-0302", insurance:"United"   },
    { time:"10:30", patient:"Brenda Ortega",   age:61, reason:"Epilepsy Review",      type:"Follow-up", status:"Confirmed", room:"N301", notes:"Seizure-free 6 months. Consider medication taper.",  phone:"(718) 555-0303", insurance:"Aetna"    },
    { time:"11:30", patient:"Tobias Kramer",   age:54, reason:"Multiple Sclerosis",   type:"Consult",   status:"Pending",   room:"N302", notes:"New MS diagnosis. Discuss DMT options.",            phone:"(212) 555-0304", insurance:"Cigna"    },
    { time:"13:30", patient:"Agnes Liu",       age:78, reason:"Dementia Assessment",  type:"Screening", status:"Confirmed", room:"N302", notes:"MMSE baseline. Family support assessment.",          phone:"(718) 555-0305", insurance:"Medicare" },
    { time:"15:00", patient:"Derek Novak",     age:42, reason:"TIA Workup",           type:"Urgent",    status:"Confirmed", room:"N302", notes:"Mini-stroke 3 days ago. Aspirin + clopidogrel.",     phone:"(917) 555-0306", insurance:"Humana"   },
  ],
  "Dr. Marcus Reed": [
    { time:"07:00", patient:"Maria Santos",  age:32, reason:"Post-Op Appendix",   type:"Post-Op",  status:"Confirmed", room:"ER-1", notes:"Lap appendectomy day 2. Monitor for infection.", phone:"(718) 555-0401", insurance:"Medicaid"  },
    { time:"08:00", patient:"Tyler Banks",   age:24, reason:"Trauma Assessment",  type:"Urgent",   status:"Confirmed", room:"ER-2", notes:"MVA patient. CT clear. Observe for 4h.",        phone:"(917) 555-0402", insurance:"Blue Cross"},
    { time:"10:00", patient:"Ingrid Larsson",age:45, reason:"Anaphylaxis F/U",    type:"Follow-up",status:"Pending",   room:"ER-1", notes:"Bee sting anaphylaxis. EpiPen training.",       phone:"(646) 555-0403", insurance:"Aetna"     },
    { time:"13:00", patient:"Harold Kim",    age:68, reason:"Sepsis Management",  type:"Critical", status:"Confirmed", room:"ER-3", notes:"Sepsis day 3. WBC trending down. IV antibiotics.",phone:"(718) 555-0404", insurance:"Medicare"  },
    { time:"15:00", patient:"Chloe Tanner",  age:19, reason:"Abdominal Pain",     type:"Consult",  status:"Confirmed", room:"ER-2", notes:"Rule out appendicitis. Ultrasound ordered.",    phone:"(917) 555-0405", insurance:"Medicaid"  },
  ],
  "Dr. Aiko Tanaka": [
    { time:"08:00", patient:"Linda Park",    age:8,  reason:"Pneumonia Review",  type:"Critical",  status:"Confirmed", room:"P101", notes:"Day 5 pneumonia. Chest X-ray this morning.",             phone:"(718) 555-0501", insurance:"United"     },
    { time:"09:00", patient:"Yuki Nakamura", age:5,  reason:"Asthma Management", type:"Checkup",   status:"Confirmed", room:"P101", notes:"Increase Flovent to 110mcg BID. Spacer technique.",      phone:"(718) 555-0502", insurance:"Aetna"      },
    { time:"10:00", patient:"Oliver Chang",  age:12, reason:"Growth Assessment", type:"Screening", status:"Pending",   room:"P101", notes:"Height velocity below 5th percentile. IGF-1 check.",    phone:"(646) 555-0503", insurance:"Blue Cross" },
    { time:"11:30", patient:"Sophia Reyes",  age:3,  reason:"Vaccine Schedule",  type:"Checkup",   status:"Confirmed", room:"P102", notes:"18-month vaccines. MMR, Varicella, HepA.",              phone:"(917) 555-0504", insurance:"Medicaid"   },
    { time:"13:00", patient:"Ethan Morris",  age:9,  reason:"ADHD Follow-up",    type:"Follow-up", status:"Confirmed", room:"P102", notes:"Adderall 10mg. Parent/teacher reports.",                phone:"(718) 555-0505", insurance:"Cigna"      },
    { time:"14:30", patient:"Mia Goldstein", age:14, reason:"Scoliosis Check",   type:"Follow-up", status:"Confirmed", room:"P102", notes:"Cobb angle 28°. Brace compliance check.",               phone:"(212) 555-0506", insurance:"Blue Cross" },
    { time:"15:30", patient:"Caleb Jackson", age:7,  reason:"Ear Infection",     type:"Urgent",    status:"Pending",   room:"P103", notes:"Recurrent otitis media. ENT referral.",                 phone:"(718) 555-0507", insurance:"United"     },
  ],
  "Dr. Carlos Mendez": [
    { time:"09:00", patient:"David Ortiz",  age:55, reason:"Lymphoma Chemo Cycle",type:"Treatment",status:"Confirmed", room:"O201", notes:"CHOP cycle 4. Pre-meds: ondansetron, dex.",          phone:"(718) 555-0601", insurance:"Medicare"   },
    { time:"10:30", patient:"Kevin O'Brien",age:62, reason:"Lung Cancer Staging", type:"Critical", status:"Confirmed", room:"O201", notes:"Stage IIIB NSCLC. Discuss palliative options.",       phone:"(718) 555-0602", insurance:"Medicare"   },
    { time:"12:00", patient:"Rachel Stein", age:48, reason:"Breast Cancer F/U",   type:"Follow-up",status:"Confirmed", room:"O202", notes:"Post-mastectomy year 2. Tumor markers normal.",      phone:"(917) 555-0603", insurance:"Blue Cross" },
    { time:"14:00", patient:"Bernard Cole", age:70, reason:"Prostate Cancer",     type:"Consult",  status:"Pending",   room:"O202", notes:"PSA rising. Discuss ADT vs radiation.",             phone:"(718) 555-0604", insurance:"Medicare"   },
    { time:"15:30", patient:"Iris Tanaka",  age:40, reason:"Genetic Counseling",  type:"Consult",  status:"Confirmed", room:"O202", notes:"BRCA1 positive. Prophylactic options.",              phone:"(646) 555-0605", insurance:"Aetna"      },
  ],
};

// Generate calendar appointment counts for next 30 days
const generateCalendarData = (doctorName) => {
  const base = DOCTOR_SCHEDULE[doctorName] || [];
  const today = new Date(2026, 1, 28);
  const data = {};
  const seed = doctorName.length;
  for (let d = 0; d < 31; d++) {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    if (d === 0) {
      data[key] = base.length;
    } else if (dt.getDay() !== 0 && dt.getDay() !== 6) {
      data[key] = Math.max(2, Math.round((base.length * 0.7) + ((seed + d) % 4) - 1));
    }
  }
  return data;
};

module.exports = { DOCS, DOCTOR_SCHEDULE, generateCalendarData };
