"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = void 0;
// src/utils/qrGenerator.ts
const qrcode_1 = __importDefault(require("qrcode"));
const encryption_1 = require("./encryption");
const generateQRCode = async (data) => {
    try {
        // Encrypt the data before generating QR code
        const encryptedData = (0, encryption_1.encryptData)(data);
        // Generate QR code with encrypted data
        const qrCode = await qrcode_1.default.toDataURL(encryptedData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#1E3A8A', // Navy blue
                light: '#FFFFFF' // White
            }
        });
        return qrCode;
    }
    catch (error) {
        throw new Error('Failed to generate QR code');
    }
};
exports.generateQRCode = generateQRCode;
//# sourceMappingURL=qrGenerator.js.map