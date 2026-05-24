import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadDocument = async (base64DataUrl, originalName) => {
  try {
    if (!base64DataUrl) return null;
    
    // Parse base64
    const matches = base64DataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string format');
    }
    
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Create uploads directory
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Create unique filename
    const ext = path.extname(originalName) || '.png';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    
    fs.writeFileSync(filePath, buffer);
    console.log(`[Storage] Saved file locally: ${filePath}`);
    
    // Return url path
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('[Storage Error] File save failed:', error);
    throw error;
  }
};

export default uploadDocument;
