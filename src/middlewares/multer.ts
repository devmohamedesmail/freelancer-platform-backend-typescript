import multer from 'multer';
import type { Request } from 'express';

// store in memory
const storage = multer.memoryStorage();

// file filter
const fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => void = 
(req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = file.originalname.toLowerCase().split('.').pop();
  
  if (ext && allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

// multer instance
const upload = multer({ storage, fileFilter });

export default upload;
