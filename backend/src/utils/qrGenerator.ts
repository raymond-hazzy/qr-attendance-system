// src/utils/qrGenerator.ts
import QRCode from 'qrcode';
import { encryptData } from './encryption';
import { QRData } from '../types';

export const generateQRCode = async (data: QRData): Promise<string> => {
  try {
    const encryptedData = encryptData(data);
    
    const qrCode = await QRCode.toDataURL(encryptedData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1E3A8A',  
        light: '#FFFFFF'  
      }
    });
    
    return qrCode;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};