"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/login', authController_1.login);
router.post('/admin-login', authController_1.adminLogin);
router.post('/register', upload_1.upload.single('profileImage'), authController_1.register);
router.post('/refresh-token', auth_1.protect, authController_1.refreshToken);
exports.default = router;
//# sourceMappingURL=auth.js.map