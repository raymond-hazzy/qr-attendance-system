"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/attendance.ts
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/mark', (0, auth_1.restrictTo)('admin', 'lecturer'), attendanceController_1.markAttendance);
router.post('/qr-code', (0, auth_1.restrictTo)('student'), attendanceController_1.generateQRCodeData);
router.get('/list', attendanceController_1.getAttendanceList);
exports.default = router;
//# sourceMappingURL=attendance.js.map