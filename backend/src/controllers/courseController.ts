// src/controllers/courseController.ts - Updated
import { Response } from 'express';
import Course from '../models/Course';
import Department from '../models/Department';
import { AuthRequest } from '../types';

export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { departmentId } = req.params;
    
    let courses;
    if (departmentId === 'all') {
      courses = await Course.find();
    } else {
      const department = await Department.findOne({ name: departmentId });
      if (!department) {
        res.status(404).json({
          message: 'Department not found'
        });
        return;
      }
      courses = await Course.find({ department: department.name });
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching courses',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDepartments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const departments = await Department.find().select('name courses -_id');
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching departments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().select('code name department -_id');
    
    const uniqueCourses = courses.reduce((acc, course) => {
      if (!acc.find(c => c.code === course.code)) {
        acc.push({ 
          code: course.code, 
          name: course.name,
          department: course.department 
        });
      }
      return acc;
    }, [] as { code: string; name: string; department: string }[]);

    res.status(200).json(uniqueCourses);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching courses',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};