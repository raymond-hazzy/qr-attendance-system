import { Request, Response } from 'express';
import { LoginRequest, AdminLoginRequest, RegisterRequest } from '../types';
export declare const login: (req: Request<{}, {}, LoginRequest>, res: Response) => Promise<void>;
export declare const adminLogin: (req: Request<{}, {}, AdminLoginRequest>, res: Response) => Promise<void>;
export declare const register: (req: Request<{}, {}, RegisterRequest>, res: Response) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map