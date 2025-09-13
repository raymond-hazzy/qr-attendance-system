
// src/controllers/dashboardControllers.ts
import { Response } from 'express';
import Attendance from '../models/Attendance';
import User from '../models/User';
import Course from '../models/Course';
import { AuthRequest } from '../types';

// Get dashboard overview data
export const getDashboardOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's scans across all courses
    const todayScans = await Attendance.countDocuments({
      timestamp: { $gte: today, $lt: tomorrow }
    });

    // Get total registered students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Get total courses available
    const totalCourses = await Course.countDocuments();

    // Calculate attendance rate (students who attended today vs total students)
    const uniqueStudentsToday = await Attendance.distinct('studentId', {
      timestamp: { $gte: today, $lt: tomorrow }
    });
    
    const attendanceRate = totalStudents > 0 
      ? Math.round((uniqueStudentsToday.length / totalStudents) * 100)
      : 0;

    res.status(200).json({
      todayScans,
      totalStudents,
      totalCourses,
      attendanceRate,
      uniqueStudentsToday: uniqueStudentsToday.length
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({
      message: 'Error fetching dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Export attendance data as CSV
export const exportAttendanceCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { course } = req.query;
    
    let filter: any = {};
    if (course && course !== 'all') {
      filter.courseCode = course.toString();
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate('studentId', 'fullName matricNo profileImage')
      .sort({ timestamp: -1 });

    // Group by student and course to get latest scan and total scans
    const studentCourseMap = new Map();
    
    attendanceRecords.forEach(record => {
      const key = `${record.studentId}_${record.courseCode}`;
      if (!studentCourseMap.has(key) || 
          new Date(record.timestamp) > new Date(studentCourseMap.get(key).lastScanned)) {
        studentCourseMap.set(key, {
          fullName: (record.studentId as any).fullName,
          matricNo: (record.studentId as any).matricNo,
          courseCode: record.courseCode,
          lastScanned: record.timestamp,
          scanCount: record.scanCount
        });
      }
    });

    const records = Array.from(studentCourseMap.values());

    // Convert to CSV
    let csv = 'Name,Matric No,Course,Last Scan,Total Scans\n';
    
    records.forEach(record => {
      csv += `"${record.fullName}",${record.matricNo},${record.courseCode},${record.lastScanned.toISOString()},${record.scanCount}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${new Date().toISOString().split('T')[0]}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting attendance:', error);
    res.status(500).json({
      message: 'Error exporting attendance data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};