// backend/src/controllers/doctorController.js

const dal = require('../dal/doctorDal');

const getAll = (req, res) => {
  res.json(dal.getAllDoctors());
};

const getById = (req, res) => {
  const doc = dal.getDoctorById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Doctor not found" });
  res.json(doc);
};

const create = (req, res) => {
  if (!req.body.name) return res.status(400).json({ message: "Name is required" });
  const doc = dal.addDoctor(req.body);
  res.status(201).json(doc);
};

const update = (req, res) => {
  const doc = dal.updateDoctor(req.params.id, req.body);
  if (!doc) return res.status(404).json({ message: "Doctor not found" });
  res.json(doc);
};

const resolveOverbooking = (req, res) => {
  const doc = dal.resolveOverbooking(req.params.id);
  if (!doc) return res.status(404).json({ message: "Doctor not found" });
  res.json({ success: true, doctor: doc });
};

const getSchedule = (req, res) => {
  const schedule = dal.getScheduleByDoctor(decodeURIComponent(req.params.name));
  res.json(schedule);
};

const getCalendar = (req, res) => {
  const calendar = dal.getCalendarByDoctor(decodeURIComponent(req.params.name));
  res.json(calendar);
};

// Auth — extracted from Login component (goAdmin / goDoctor)
const login = (req, res) => {
  const { role, email, pass, docId, docPass } = req.body;

  if (role === "admin") {
    if (email === "admin@medicore.io" && pass === "admin123") {
      return res.json({ success: true, user: { name: "Admin", role: "admin" } });
    }
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }

  if (role === "doctor") {
    if (docPass !== "doc123") {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }
    const doc = dal.getDoctorById(docId);
    if (!doc) return res.status(404).json({ success: false, message: "Doctor not found." });
    return res.json({ success: true, user: { name: doc.name, role: "doctor", docId: doc.id } });
  }

  res.status(400).json({ success: false, message: "Invalid role." });
};

module.exports = { getAll, getById, create, update, resolveOverbooking, getSchedule, getCalendar, login };
