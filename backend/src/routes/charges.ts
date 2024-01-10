import express, { Request } from 'express';
import multer from "multer";
import { getCharges } from '../controllers/charges';
const router = express.Router();


const storage = multer.diskStorage({
  destination: function (_req: Request, _file: any, cb: Function) {
    cb(null, 'uploads/');
  },
  filename: function (_req: Request, file: any, cb: Function) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('data'), getCharges)

export default router;