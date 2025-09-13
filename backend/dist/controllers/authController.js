"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.register = exports.adminLogin = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const login = async (req, res) => {
    try {
        const { matricNo, password } = req.body;
        if (!matricNo || !password) {
            res.status(400).json({
                message: 'Please provide matric number and password'
            });
            return;
        }
        const user = await User_1.default.findOne({ matricNo: matricNo.toUpperCase() }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            res.status(401).json({
                message: 'Incorrect matric number or password'
            });
            return;
        }
        const token = (0, jwt_1.signToken)(user._id.toString());
        res.status(200).json({
            token,
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                matricNo: user.matricNo,
                email: user.email,
                department: user.department,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.login = login;
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: 'Please provide email and password'
            });
            return;
        }
        const user = await User_1.default.findOne({
            email: email.toLowerCase(),
            role: { $in: ['admin', 'lecturer'] }
        }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            res.status(401).json({
                message: 'Incorrect email or password'
            });
            return;
        }
        const token = (0, jwt_1.signToken)(user._id.toString());
        res.status(200).json({
            token,
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                matricNo: user.matricNo,
                email: user.email,
                department: user.department,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.adminLogin = adminLogin;
const register = async (req, res) => {
    try {
        const { fullName, matricNo, email, password, department } = req.body;
        const existingUser = await User_1.default.findOne({
            $or: [{ email: email.toLowerCase() }, { matricNo: matricNo.toUpperCase() }]
        });
        if (existingUser) {
            res.status(400).json({
                message: 'User already exists with this email or matric number'
            });
            return;
        }
        const newUser = await User_1.default.create({
            fullName,
            matricNo: matricNo.toUpperCase(),
            email: email.toLowerCase(),
            password,
            department,
            profileImage: req.file ? req.file.path : undefined
        });
        const token = (0, jwt_1.signToken)(newUser._id.toString());
        res.status(201).json({
            token,
            user: {
                id: newUser._id.toString(),
                fullName: newUser.fullName,
                matricNo: newUser.matricNo,
                email: newUser.email,
                department: newUser.department,
                role: newUser.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error creating user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.register = register;
const refreshToken = async (req, res) => {
    try {
        // Get the user from the request (added by protect middleware)
        const user = req.user;
        if (!user) {
            res.status(401).json({
                message: 'Not authorized'
            });
            return;
        }
        const token = (0, jwt_1.signToken)(user._id.toString());
        res.status(200).json({
            token,
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                matricNo: user.matricNo,
                email: user.email,
                department: user.department,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error refreshing token',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=authController.js.map