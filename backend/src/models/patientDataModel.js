// backend/src/models/patientDataModel.js

const PATIENTS = [
  { id:1,  name:"Alice Morgan",    age:67, loc:"Brooklyn, NY",    disease:"Coronary Artery Disease", doctor:"Dr. Sarah Chen",    dept:"Cardiology",  status:"Active",   sev:"High",     admitted:"Jan 15", lat:40.65, lng:-73.94, blood:"A+",  ward:"ICU",       bed:"ICU-04",  room:"401" },
  { id:2,  name:"Robert Kim",      age:45, loc:"Queens, NY",      disease:"Cerebral Hemorrhage",     doctor:"Dr. Priya Patel",   dept:"Neurology",   status:"Critical", sev:"Critical", admitted:"Jan 18", lat:40.73, lng:-73.79, blood:"O-",  ward:"ICU",       bed:"ICU-07",  room:"407" },
  { id:3,  name:"Maria Santos",    age:32, loc:"Bronx, NY",       disease:"Acute Appendicitis",      doctor:"Dr. Marcus Reed",   dept:"Emergency",   status:"Active",   sev:"Medium",   admitted:"Jan 20", lat:40.84, lng:-73.86, blood:"B+",  ward:"Emergency", bed:"ER-03",   room:"103" },
  { id:4,  name:"James Cooper",    age:78, loc:"Manhattan, NY",   disease:"Hip Fracture",            doctor:"Dr. Elena Vasquez", dept:"Orthopedics", status:"Active",   sev:"Medium",   admitted:"Jan 12", lat:40.78, lng:-73.97, blood:"AB+", ward:"Ward",      bed:"W-B12",   room:"212" },
  { id:5,  name:"Linda Park",      age:8,  loc:"Staten Island",   disease:"Pneumonia",               doctor:"Dr. Aiko Tanaka",   dept:"Pediatrics",  status:"Active",   sev:"Low",      admitted:"Jan 22", lat:40.57, lng:-74.14, blood:"A-",  ward:"Ward",      bed:"W-P04",   room:"306" },
  { id:6,  name:"David Ortiz",     age:55, loc:"Harlem, NY",      disease:"Stage 3 Lymphoma",        doctor:"Dr. Carlos Mendez", dept:"Oncology",    status:"Active",   sev:"High",     admitted:"Jan 05", lat:40.81, lng:-73.95, blood:"O+",  ward:"Ward",      bed:"W-C09",   room:"509" },
  { id:7,  name:"Susan Clarke",    age:41, loc:"Jersey City, NJ", disease:"Cardiac Arrhythmia",      doctor:"Dr. James Wilson",  dept:"Cardiology",  status:"Resolved", sev:"Medium",   admitted:"Jan 10", lat:40.71, lng:-74.07, blood:"B-",  ward:"OPD",       bed:"OPD-06",  room:"106" },
  { id:8,  name:"Tom Harris",      age:29, loc:"Newark, NJ",      disease:"Femur Fracture",          doctor:"Dr. Elena Vasquez", dept:"Orthopedics", status:"Active",   sev:"Medium",   admitted:"Jan 19", lat:40.73, lng:-74.17, blood:"A+",  ward:"Recovery",  bed:"REC-02",  room:"202" },
  { id:9,  name:"Fatima Al-Zahra", age:36, loc:"Hoboken, NJ",     disease:"Migraine Disorder",       doctor:"Dr. Priya Patel",   dept:"Neurology",   status:"Resolved", sev:"Low",      admitted:"Jan 08", lat:40.74, lng:-74.03, blood:"AB-", ward:"OPD",       bed:"OPD-11",  room:"111" },
  { id:10, name:"Kevin O'Brien",   age:62, loc:"Brooklyn, NY",    disease:"Lung Cancer",             doctor:"Dr. Carlos Mendez", dept:"Oncology",    status:"Active",   sev:"Critical", admitted:"Jan 03", lat:40.66, lng:-73.99, blood:"O+",  ward:"ICU",       bed:"ICU-11",  room:"411" },
  { id:11, name:"Yuki Nakamura",   age:5,  loc:"Astoria, NY",     disease:"Asthma",                  doctor:"Dr. Aiko Tanaka",   dept:"Pediatrics",  status:"Active",   sev:"Low",      admitted:"Jan 21", lat:40.77, lng:-73.93, blood:"A+",  ward:"Ward",      bed:"W-P07",   room:"307" },
  { id:12, name:"George Adams",    age:71, loc:"Flushing, NY",    disease:"Heart Failure",           doctor:"Dr. Sarah Chen",    dept:"Cardiology",  status:"Critical", sev:"Critical", admitted:"Jan 16", lat:40.76, lng:-73.83, blood:"B+",  ward:"ICU",       bed:"ICU-02",  room:"402" },
];

const DEPTS = [
  { id:1, name:"Cardiology",  beds:50, occ:44, docs:8,  pts:62, res:5.2 },
  { id:2, name:"Neurology",   beds:40, occ:28, docs:6,  pts:35, res:7.8 },
  { id:3, name:"Orthopedics", beds:35, occ:21, docs:5,  pts:28, res:4.1 },
  { id:4, name:"Pediatrics",  beds:45, occ:38, docs:7,  pts:55, res:3.6 },
  { id:5, name:"Oncology",    beds:30, occ:27, docs:5,  pts:31, res:9.4 },
  { id:6, name:"Emergency",   beds:60, occ:52, docs:12, pts:98, res:2.1 },
];

const INITIAL_BEDS = [
  { id:1, type:"OPD",       total:80,  occupied:61, reserved:6, threshold:85, icon:"🏥" },
  { id:2, type:"Emergency", total:60,  occupied:52, reserved:4, threshold:80, icon:"🚨" },
  { id:3, type:"ICU",       total:30,  occupied:27, reserved:2, threshold:75, icon:"💊" },
  { id:4, type:"Ward",      total:120, occupied:98, reserved:8, threshold:85, icon:"🛏️" },
  { id:5, type:"Recovery",  total:25,  occupied:18, reserved:3, threshold:80, icon:"🔄" },
  { id:6, type:"Pediatric", total:45,  occupied:38, reserved:5, threshold:85, icon:"👶" },
  { id:7, type:"Maternity", total:20,  occupied:14, reserved:2, threshold:80, icon:"🤱" },
  { id:8, type:"Surgical",  total:35,  occupied:28, reserved:4, threshold:82, icon:"🔬" },
];

const AMBULANCE_DRIVERS = [
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

const AMBULANCE_ZONES = [
  { zone:"Zone A", area:"Manhattan",   total:2, available:1, onDuty:1, maintenance:0, demand:"High",   avgResponse:"4.0 min", shortfall:false },
  { zone:"Zone B", area:"Brooklyn",    total:2, available:1, onDuty:1, maintenance:1, demand:"Medium", avgResponse:"5.1 min", shortfall:true  },
  { zone:"Zone C", area:"Queens",      total:2, available:1, onDuty:1, maintenance:0, demand:"Medium", avgResponse:"6.1 min", shortfall:false },
  { zone:"Zone D", area:"Bronx",       total:2, available:0, onDuty:1, maintenance:1, demand:"High",   avgResponse:"7.2 min", shortfall:true  },
  { zone:"Zone E", area:"Staten Isl.", total:1, available:1, onDuty:0, maintenance:0, demand:"Low",    avgResponse:"8.9 min", shortfall:false },
  { zone:"Zone F", area:"New Jersey",  total:1, available:0, onDuty:1, maintenance:0, demand:"Medium", avgResponse:"9.1 min", shortfall:true  },
];

module.exports = { PATIENTS, DEPTS, INITIAL_BEDS, AMBULANCE_DRIVERS, AMBULANCE_ZONES };
