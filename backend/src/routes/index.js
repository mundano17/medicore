// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

const doctorCtrl  = require('../controllers/doctorController');
const patientCtrl = require('../controllers/patientController');

// ── Auth ─────────────────────────────────────────────────────────────────────
router.post('/auth/login', doctorCtrl.login);

// ── Doctors ───────────────────────────────────────────────────────────────────
router.get('/doctors',                          doctorCtrl.getAll);
router.post('/doctors',                         doctorCtrl.create);
router.get('/doctors/:id',                      doctorCtrl.getById);
router.put('/doctors/:id',                      doctorCtrl.update);
router.patch('/doctors/:id/resolve-overbooking',doctorCtrl.resolveOverbooking);
router.get('/doctors/:name/schedule',           doctorCtrl.getSchedule);
router.get('/doctors/:name/calendar',           doctorCtrl.getCalendar);

// ── Patients ──────────────────────────────────────────────────────────────────
router.get('/patients',                         patientCtrl.getAll);
router.get('/patients/by-doctor/:doctorName',   patientCtrl.getByDoctor);
router.patch('/patients/:id/status',            patientCtrl.updateStatus);

// ── Departments ───────────────────────────────────────────────────────────────
router.get('/departments',                      patientCtrl.getAllDepts);
router.put('/departments/:id',                  patientCtrl.updateDept);

// ── Beds ──────────────────────────────────────────────────────────────────────
router.get('/beds',                             patientCtrl.getAllBeds);
router.put('/beds/:id',                         patientCtrl.updateBed);

// ── Ambulances ────────────────────────────────────────────────────────────────
router.get('/ambulances',                       patientCtrl.getAllAmbulances);
router.put('/ambulances/:id',                   patientCtrl.updateAmbulance);

module.exports = router;
