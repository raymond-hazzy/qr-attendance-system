// src/controllers/attendanceController.ts
import { Response } from 'express';
import Attendance from '../models/Attendance';
import User from '../models/User';
import { AuthRequest } from '../types';
import { decryptData } from '../utils/encryption';

const markAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { encryptedData } = req.body;

    if (!encryptedData) {
      res.status(400).json({
        message: 'QR code data is required'
      });
      return;
    }

    let qrData;
    try {
      qrData = decryptData(encryptedData);
    } catch (error) {
      res.status(400).json({
        message: 'Invalid QR code data'
      });
      return;
    }

    const { studentId, courseCode, timestamp } = qrData;

    const student = await User.findById(studentId);
    if (!student) {
      res.status(404).json({
        message: 'Student not found'
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      studentId,
      courseCode,
      timestamp: { $gte: today, $lt: tomorrow }
    });

    if (existingAttendance) {
      existingAttendance.scanCount += 1;
      existingAttendance.timestamp = new Date();
      await existingAttendance.save();

      res.status(200).json({
        message: 'Attendance updated successfully',
        attendance: {
          id: existingAttendance._id.toString(),
          studentId: existingAttendance.studentId.toString(),
          matricNo: student.matricNo,
          fullName: student.fullName,
          courseCode: existingAttendance.courseCode,
          lastScanned: existingAttendance.timestamp,
          scanCount: existingAttendance.scanCount
        }
      });
      return;
    }

    const attendanceRecord = await Attendance.create({
      studentId,
      matricNo: student.matricNo,
      fullName: student.fullName,
      courseCode,
      timestamp: new Date(),
      scanCount: 1
    });

    res.status(200).json({
      message: 'Attendance marked successfully',
      attendance: {
        id: attendanceRecord._id.toString(),
        studentId: attendanceRecord.studentId.toString(),
        matricNo: attendanceRecord.matricNo,
        fullName: attendanceRecord.fullName,
        courseCode: attendanceRecord.courseCode,
        lastScanned: attendanceRecord.timestamp,
        scanCount: attendanceRecord.scanCount
      }
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      message: 'Error marking attendance',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const generateQRCodeData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseCode } = req.body;
    const studentId = req.user!._id.toString();

    if (!courseCode) {
      res.status(400).json({
        message: 'Course code is required'
      });
      return;
    }

    const Course = require('../models/Course').default;
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      res.status(404).json({
        message: 'Course not found'
      });
      return;
    }

    const qrData = {
      studentId,
      matricNo: req.user!.matricNo,
      courseCode,
      timestamp: new Date().toISOString()
    };

    const { generateQRCode } = require('../utils/qrGenerator');
    const qrCode = await generateQRCode(qrData);

    res.status(200).json({
      qrCode,
      expiresIn: 30
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      message: 'Error generating QR code',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const getAttendanceList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { course } = req.query;
    const user = req.user!;

    let filter: any = {};
    
    if (course && course !== 'all') {
      filter.courseCode = course;
    }

    if (user.role === 'student') {
      filter.studentId = user._id;
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate('studentId', 'profileImage fullName matricNo')
      .sort({ timestamp: -1 });

    const records = attendanceRecords.map(record => ({
      id: record._id.toString(),
      studentId: record.studentId.toString(),
      matricNo: record.matricNo,
      fullName: record.fullName,
      courseCode: record.courseCode,
      lastScanned: record.timestamp.toISOString(),
      scanCount: record.scanCount,
      profileImage: (record.studentId as any).profileImage
    }));

    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({
      message: 'Error fetching attendance records',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const getAttendanceSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { course } = req.query;
    
    let registeredCount = 0;
    let todayScans = 0;

    const courseDepartments: { [key: string]: string[] } = {
      'MTH 202': ['CSC with math'],
      'CSC 201': ['CSC with math', 'CSC with ECN'],
      'CSC 205': ['CSC with math'],
      'ECN 204': ['CSC with ECN'],
      'CSC 203': ['CSC with ECN'],
      'EEE 202': ['Computer Engineering'],
      'CPE 204': ['Computer Engineering'],
      'MEE 204': ['Computer Engineering'],
      'MEE 206': ['Computer Engineering']
    };

    if (course && course !== 'all') {
      const courseStr = course.toString();
      
      const departmentsForCourse = courseDepartments[courseStr] || [];
      
      if (departmentsForCourse.length > 0) {
        registeredCount = await User.countDocuments({ 
          department: { $in: departmentsForCourse },
          role: 'student' // Only count students, not admins/lecturers
        });
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      todayScans = await Attendance.countDocuments({
        courseCode: courseStr,
        timestamp: { $gte: today, $lt: tomorrow }
      });

    } else {
      registeredCount = await User.countDocuments({ role: 'student' });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      todayScans = await Attendance.countDocuments({
        timestamp: { $gte: today, $lt: tomorrow }
      });
    }

    res.status(200).json({
      registeredCount,
      todayScans,
      courseName: course && course !== 'all' ? course.toString() : 'All Courses'
    });
  } catch (error) {
    console.error('Error in getAttendanceSummary:', error);
    res.status(500).json({
      message: 'Error fetching attendance summary',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export {
  markAttendance,
  generateQRCodeData,
  getAttendanceList,
  getAttendanceSummary
};