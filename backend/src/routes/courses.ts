// src/routes/courses.ts - Fix endpoint structure
import express from 'express';
import { getCourses, getDepartments, getAllCourses } from '../controllers/courseController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

// Match frontend expected endpoints
router.get('/:departmentId', getCourses);
router.get('/', getDepartments);
router.get('/all/courses', getAllCourses); // Changed to match frontend

export default router;