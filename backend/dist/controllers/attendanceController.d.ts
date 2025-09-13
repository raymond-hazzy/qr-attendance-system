import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const markAttendance: (req: AuthRequest, res: Response) => Promise<void>;
export declare const generateQRCodeData: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAttendanceList: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=attendanceController.d.ts.map