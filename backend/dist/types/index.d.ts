import { Request } from 'express';
import { Document, ObjectId } from 'mongoose';
export interface IUser extends Document {
    _id: ObjectId;
    fullName: string;
    matricNo: string;
    email: string;
    password: string;
    department: string;
    profileImage?: string;
    role: 'student' | 'admin' | 'lecturer';
    createdAt: Date;
    updatedAt: Date;
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}
export interface IAttendance extends Document {
    studentId: ObjectId;
    matricNo: string;
    fullName: string;
    courseCode: string;
    timestamp: Date;
    scanCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICourse extends Document {
    code: string;
    name: string;
    department: string;
}
export interface IDepartment extends Document {
    name: string;
    courses: ICourse[];
}
export interface AuthRequest extends Request {
    user?: IUser;
}
export interface LoginRequest {
    matricNo: string;
    password: string;
}
export interface AdminLoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    fullName: string;
    matricNo: string;
    email: string;
    password: string;
    department: string;
    profileImage?: string;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        fullName: string;
        matricNo: string;
        email: string;
        department: string;
        role?: string;
    };
}
export interface QRData {
    studentId: string;
    matricNo: string;
    courseCode: string;
    timestamp: string;
}
//# sourceMappingURL=index.d.ts.map