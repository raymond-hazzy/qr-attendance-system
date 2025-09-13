"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = void 0;
// src/utils/encryption.ts
const crypto_js_1 = __importDefault(require("crypto-js"));
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const encryptData = (data) => {
    return crypto_js_1.default.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};
exports.encryptData = encryptData;
const decryptData = (ciphertext) => {
    const bytes = crypto_js_1.default.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(crypto_js_1.default.enc.Utf8));
};
exports.decryptData = decryptData;
//# sourceMappingURL=encryption.js.map