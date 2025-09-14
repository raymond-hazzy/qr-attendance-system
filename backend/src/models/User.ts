// src/models/User.ts
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserDocument } from '../types';

const userSchema = new Schema<IUserDocument>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  matricNo: {
    type: String,
    required: [true, 'Matric number is required'],
    unique: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['CSC with math', 'CSC with ECN', 'Computer Engineering', 'Administration']
  },
  profileImage: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'lecturer'],
    default: 'student'
  },
  registeredCourses: [{
    type: String,
    default: []
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.index({ matricNo: 1 });
userSchema.index({ email: 1 });
userSchema.index({ department: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.correctPassword = async function(candidatePassword: string, userPassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.assignCoursesByDepartment = function(): string[] {
  const departmentCourses: { [key: string]: string[] } = {
    'CSC with math': ['MTH 202', 'CSC 201', 'CSC 205'],
    'CSC with ECN': ['ECN 204', 'CSC 201', 'CSC 203'],
    'Computer Engineering': ['EEE 202', 'CPE 204', 'MEE 204', 'MEE 206'],
    'Administration': []
  };

  this.registeredCourses = departmentCourses[this.department] || [];
  return this.registeredCourses;
};

userSchema.virtual('displayName').get(function() {
  return `${this.fullName} (${this.matricNo})`;
});

userSchema.methods.isAdmin = function(): boolean {
  return this.role === 'admin' || this.role === 'lecturer';
};

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IUserDocument>('User', userSchema);