// src/models/Department.ts
import mongoose, { Schema } from 'mongoose';
import { IDepartment } from '../types';

const departmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  courses: [{
    code: String,
    name: String
  }]
});

export default mongoose.model<IDepartment>('Department', departmentSchema);