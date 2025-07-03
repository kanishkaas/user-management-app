import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".xlsx") return cb(new Error("Only .xlsx files are allowed"), false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
export default upload;
