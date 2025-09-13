// src/routes/dashboard.ts
import express from 'express';
import { getDashboardOverview, exportAttendanceCSV } from '../controllers/dashboardController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/overview', restrictTo('admin', 'lecturer'), getDashboardOverview);
router.get('/export', restrictTo('admin', 'lecturer'), exportAttendanceCSV);

export default router;