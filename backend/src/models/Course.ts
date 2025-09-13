// src/models/Course.ts
import mongoose, { Schema } from 'mongoose';
import { ICourse } from '../types';

const courseSchema = new Schema<ICourse>({
  code: {
    type: String,
    required: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  }
});

export default mongoose.model<ICourse>('Course', courseSchema);