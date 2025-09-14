// src/routes/attendance.ts 
import express from 'express';
import { 
  markAttendance, 
  generateQRCodeData, 
  getAttendanceList, 
  getAttendanceSummary 
} from '../controllers/attendanceController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.use(protect);

//endpoints
router.post('/mark', restrictTo('admin', 'lecturer'), markAttendance);
router.post('/qr-code', restrictTo('student'), generateQRCodeData);
router.get('/list', getAttendanceList);
router.get('/summary', getAttendanceSummary);

export default router;