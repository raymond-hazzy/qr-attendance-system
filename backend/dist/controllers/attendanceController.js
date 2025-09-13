"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceList = exports.generateQRCodeData = exports.markAttendance = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const User_1 = __importDefault(require("../models/User"));
const encryption_1 = require("../utils/encryption");
const qrGenerator_1 = require("../utils/qrGenerator");
const markAttendance = async (req, res) => {
    try {
        const { encryptedData } = req.body;
        if (!encryptedData) {
            res.status(400).json({
                message: 'QR code data is required'
            });
            return;
        }
        // Decrypt the QR code data
        const qrData = (0, encryption_1.decryptData)(encryptedData);
        // Verify the student exists
        const student = await User_1.default.findById(qrData.studentId);
        if (!student) {
            res.status(404).json({
                message: 'Student not found'
            });
            return;
        }
        // Check if attendance already marked today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let attendance = await Attendance_1.default.findOne({
            studentId: qrData.studentId,
            courseCode: qrData.courseCode,
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        });
        if (attendance) {
            // Update scan count if already exists
            attendance.scanCount += 1;
            attendance.timestamp = new Date();
            await attendance.save();
        }
        else {
            // Create new attendance record
            attendance = await Attendance_1.default.create({
                studentId: qrData.studentId,
                matricNo: student.matricNo,
                fullName: student.fullName,
                courseCode: qrData.courseCode,
                timestamp: new Date()
            });
        }
        res.status(200).json({
            message: 'Attendance marked successfully',
            attendance: {
                id: attendance._id.toString(),
                studentId: attendance.studentId,
                matricNo: attendance.matricNo,
                fullName: attendance.fullName,
                courseCode: attendance.courseCode,
                lastScanned: attendance.timestamp,
                scanCount: attendance.scanCount
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error marking attendance',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.markAttendance = markAttendance;
const generateQRCodeData = async (req, res) => {
    try {
        const { courseCode } = req.body;
        const studentId = req.user._id.toString();
        if (!courseCode) {
            res.status(400).json({
                message: 'Course code is required'
            });
            return;
        }
        const qrData = {
            studentId,
            matricNo: req.user.matricNo,
            courseCode,
            timestamp: new Date().toISOString()
        };
        const qrCode = await (0, qrGenerator_1.generateQRCode)(qrData);
        res.status(200).json({
            qrCode,
            expiresIn: 30 // seconds
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error generating QR code',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.generateQRCodeData = generateQRCodeData;
const getAttendanceList = async (req, res) => {
    try {
        const { course } = req.query;
        const user = req.user;
        let filter = {};
        if (course && course !== 'all') {
            filter.courseCode = course;
        }
        // If user is a student, only show their own attendance
        if (user.role === 'student') {
            filter.studentId = user._id;
        }
        const attendanceRecords = await Attendance_1.default.find(filter)
            .populate('studentId', 'profileImage')
            .sort({ timestamp: -1 });
        const records = attendanceRecords.map(record => ({
            id: record._id.toString(),
            studentId: record.studentId.toString(),
            matricNo: record.matricNo,
            fullName: record.fullName,
            courseCode: record.courseCode,
            lastScanned: record.timestamp,
            scanCount: record.scanCount,
            profileImage: record.studentId.profileImage
        }));
        res.status(200).json(records);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching attendance records',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAttendanceList = getAttendanceList;
//# sourceMappingURL=attendanceController.js.map