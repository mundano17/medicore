// backend/src/dal/patientDal.js
// Data Access Layer — all read/write operations on patient, department, bed, and ambulance data

let { PATIENTS, DEPTS, INITIAL_BEDS, AMBULANCE_DRIVERS, AMBULANCE_ZONES } = require('../models/patientDataModel');

// ── Patients ────────────────────────────────────────────────────────────────
const getAllPatients = ({ search, status, dept, sortKey, sortDir } = {}) => {
  let rows = [...PATIENTS];
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.disease.toLowerCase().includes(q) ||
      p.doctor.toLowerCase().includes(q)
    );
  }
  if (status && status !== "All") rows = rows.filter(p => p.status === status);
  if (dept   && dept   !== "All") rows = rows.filter(p => p.dept   === dept);
  if (sortKey) {
    rows = rows.sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])) * (sortDir === "desc" ? -1 : 1));
  }
  return rows;
};

const getPatientsByDoctor = (doctorName) => PATIENTS.filter(p => p.doctor === doctorName);

const updatePatientStatus = (id, status) => {
  PATIENTS = PATIENTS.map(p => p.id === parseInt(id) ? { ...p, status } : p);
  return PATIENTS.find(p => p.id === parseInt(id));
};

// ── Departments ─────────────────────────────────────────────────────────────
const getAllDepts = () => DEPTS;

const updateDept = (id, updates) => {
  DEPTS = DEPTS.map(d => d.id === parseInt(id) ? { ...d, ...updates } : d);
  return DEPTS.find(d => d.id === parseInt(id));
};

// ── Beds ────────────────────────────────────────────────────────────────────
const getAllBeds = () => INITIAL_BEDS;

const updateBed = (id, updates) => {
  INITIAL_BEDS = INITIAL_BEDS.map(b => b.id === parseInt(id) ? { ...b, ...updates } : b);
  return INITIAL_BEDS.find(b => b.id === parseInt(id));
};

// ── Ambulances ───────────────────────────────────────────────────────────────
const getAllAmbulances = () => ({ drivers: AMBULANCE_DRIVERS, zones: AMBULANCE_ZONES });

const updateAmbulance = (id, updates) => {
  AMBULANCE_DRIVERS = AMBULANCE_DRIVERS.map(a => a.id === parseInt(id) ? { ...a, ...updates } : a);
  return AMBULANCE_DRIVERS.find(a => a.id === parseInt(id));
};

module.exports = {
  getAllPatients,
  getPatientsByDoctor,
  updatePatientStatus,
  getAllDepts,
  updateDept,
  getAllBeds,
  updateBed,
  getAllAmbulances,
  updateAmbulance,
};
