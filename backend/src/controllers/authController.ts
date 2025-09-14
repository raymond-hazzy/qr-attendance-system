// src/controllers/authController.ts - Complete version
import { Request, Response } from 'express';
import User from '../models/User';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../types';
import path from 'path';
import fs from 'fs';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, matricNo, email, password, department } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { matricNo: matricNo.toUpperCase() }]
    });

    if (existingUser) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({
        message: 'User already exists with this email or matric number'
      });
      return;
    }

    let profileImagePath: string | undefined;
    if (req.file) {
      profileImagePath = `uploads/${req.file.filename}`;
      console.log('Profile image saved at:', profileImagePath);
    }

    const newUser = await User.create({
      fullName,
      matricNo: matricNo.toUpperCase(),
      email: email.toLowerCase(),
      password,
      department,
      profileImage: profileImagePath
    });

    newUser.assignCoursesByDepartment();
    await newUser.save();

    const token = signToken(newUser._id.toString());

    console.log('Register response user data:', {
      id: newUser._id.toString(),
      fullName: newUser.fullName,
      matricNo: newUser.matricNo,
      email: newUser.email,
      department: newUser.department,
      role: newUser.role,
      profileImage: newUser.profileImage
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id.toString(),
        fullName: newUser.fullName,
        matricNo: newUser.matricNo,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role,
        profileImage: newUser.profileImage // Send the actual path
      }
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matricNo, password } = req.body;

    if (!matricNo || !password) {
      res.status(400).json({
        message: 'Please provide matric number and password'
      });
      return;
    }

    const user = await User.findOne({ matricNo: matricNo.toUpperCase() }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        message: 'Incorrect matric number or password'
      });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id.toString());

    console.log('Login response user data:', {
      id: user._id.toString(),
      fullName: user.fullName,
      matricNo: user.matricNo,
      email: user.email,
      department: user.department,
      role: user.role,
      profileImage: user.profileImage
    });

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        matricNo: user.matricNo,
        email: user.email,
        department: user.department,
        role: user.role,
        profileImage: user.profileImage // Send the actual path
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error logging in',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Please provide email and password'
      });
      return;
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      role: { $in: ['admin', 'lecturer'] }
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        message: 'Incorrect email or password'
      });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id.toString());

    console.log('Admin login response user data:', {
      id: user._id.toString(),
      fullName: user.fullName,
      matricNo: user.matricNo,
      email: user.email,
      department: user.department,
      role: user.role,
      profileImage: user.profileImage
    });

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        matricNo: user.matricNo,
        email: user.email,
        department: user.department,
        role: user.role,
        profileImage: user.profileImage // Send the actual path
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      message: 'Error logging in',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const token = signToken(user._id.toString());

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        matricNo: user.matricNo,
        email: user.email,
        department: user.department,
        role: user.role,
        profileImage: user.profileImage // Send the actual path
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      message: 'Error refreshing token',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    
    res.status(200).json({
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        matricNo: user.matricNo,
        email: user.email,
        department: user.department,
        role: user.role,
        profileImage: user.profileImage // Send the actual path
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      message: 'Error fetching user data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export { register, login, adminLogin, refreshToken, getCurrentUser };