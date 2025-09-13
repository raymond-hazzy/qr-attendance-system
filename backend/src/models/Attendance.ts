// src/models/Attendance.ts
import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../types';

const attendanceSchema = new Schema<IAttendance>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matricNo: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  scanCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate scans for same student and course on same day
attendanceSchema.index({ 
  studentId: 1, 
  courseCode: 1, 
  timestamp: 1 
}, { unique: false });

// Index for better query performance
attendanceSchema.index({ matricNo: 1 });
attendanceSchema.index({ courseCode: 1 });
attendanceSchema.index({ timestamp: 1 });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);