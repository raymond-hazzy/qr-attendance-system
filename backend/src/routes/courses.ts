// src/routes/courses.ts - Fix endpoint structure
import express from 'express';
import { getCourses, getDepartments, getAllCourses } from '../controllers/courseController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

// endpoints
router.get('/:departmentId', getCourses);
router.get('/', getDepartments);
router.get('/all/courses', getAllCourses); 

export default router;