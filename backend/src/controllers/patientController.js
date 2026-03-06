// backend/src/controllers/patientController.js

const dal = require('../dal/patientDal');

// ── Patients ─────────────────────────────────────────────────────────────────
const getAll = (req, res) => {
  const { search, status, dept, sort, dir } = req.query;
  const rows = dal.getAllPatients({ search, status, dept, sortKey: sort, sortDir: dir });
  res.json(rows);
};

const getByDoctor = (req, res) => {
  const patients = dal.getPatientsByDoctor(decodeURIComponent(req.params.doctorName));
  res.json(patients);
};

const updateStatus = (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Status is required" });
  const patient = dal.updatePatientStatus(req.params.id, status);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
};

// ── Departments ───────────────────────────────────────────────────────────────
const getAllDepts = (req, res) => {
  res.json(dal.getAllDepts());
};

const updateDept = (req, res) => {
  const dept = dal.updateDept(req.params.id, req.body);
  if (!dept) return res.status(404).json({ message: "Department not found" });
  res.json(dept);
};

// ── Beds ──────────────────────────────────────────────────────────────────────
const getAllBeds = (req, res) => {
  res.json(dal.getAllBeds());
};

const updateBed = (req, res) => {
  const bed = dal.updateBed(req.params.id, req.body);
  if (!bed) return res.status(404).json({ message: "Bed not found" });
  res.json(bed);
};

// ── Ambulances ────────────────────────────────────────────────────────────────
const getAllAmbulances = (req, res) => {
  res.json(dal.getAllAmbulances());
};

const updateAmbulance = (req, res) => {
  const ambulance = dal.updateAmbulance(req.params.id, req.body);
  if (!ambulance) return res.status(404).json({ message: "Ambulance not found" });
  res.json(ambulance);
};

module.exports = {
  getAll,
  getByDoctor,
  updateStatus,
  getAllDepts,
  updateDept,
  getAllBeds,
  updateBed,
  getAllAmbulances,
  updateAmbulance,
};
