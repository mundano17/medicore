// backend/src/dal/doctorDal.js
// Data Access Layer — all read/write operations on doctor data

let { DOCS, DOCTOR_SCHEDULE, generateCalendarData } = require('../models/doctorDataModel');

const getAllDoctors = () => DOCS;

const getDoctorById = (id) => DOCS.find(d => d.id === parseInt(id));

const getDoctorByName = (name) => DOCS.find(d => d.name === name);

const addDoctor = (data) => {
  const av = data.name.split(" ").filter(Boolean).slice(-2).map(w => w[0]).join("").toUpperCase();
  const clr = [data.clr || "#0d7c6e", "#c47c1a", "#7c5cbf", "#c0392b"][DOCS.length % 4];
  const newDoc = {
    id: DOCS.length + 1,
    av,
    clr,
    slots: 0,
    overbookedSlots: 0,
    photoGrad: `linear-gradient(135deg,${clr},${clr}aa)`,
    status: "Active",
    phone: "(646) 555-0000",
    email: `${av.toLowerCase()}@medicore.io`,
    exp: "0 yrs",
    ...data,
  };
  DOCS = [...DOCS, newDoc];
  return newDoc;
};

const updateDoctor = (id, updates) => {
  DOCS = DOCS.map(d => d.id === parseInt(id) ? { ...d, ...updates } : d);
  return DOCS.find(d => d.id === parseInt(id));
};

const resolveOverbooking = (id) => {
  DOCS = DOCS.map(d => d.id === parseInt(id) ? { ...d, overbookedSlots: 0 } : d);
  return DOCS.find(d => d.id === parseInt(id));
};

const getScheduleByDoctor = (name) => DOCTOR_SCHEDULE[name] || [];

const getCalendarByDoctor = (name) => generateCalendarData(name);

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorByName,
  addDoctor,
  updateDoctor,
  resolveOverbooking,
  getScheduleByDoctor,
  getCalendarByDoctor,
};
