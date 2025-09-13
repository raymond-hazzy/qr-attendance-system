"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartments = exports.getCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const Department_1 = __importDefault(require("../models/Department"));
const getCourses = async (req, res) => {
    try {
        const { departmentId } = req.params;
        let courses;
        if (departmentId === 'all') {
            courses = await Course_1.default.find();
        }
        else {
            const department = await Department_1.default.findById(departmentId);
            if (!department) {
                res.status(404).json({
                    message: 'Department not found'
                });
                return;
            }
            courses = await Course_1.default.find({ department: department.name });
        }
        res.status(200).json(courses);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching courses',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getCourses = getCourses;
const getDepartments = async (req, res) => {
    try {
        const departments = await Department_1.default.find();
        res.status(200).json(departments);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching departments',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getDepartments = getDepartments;
//# sourceMappingURL=courseController.js.map