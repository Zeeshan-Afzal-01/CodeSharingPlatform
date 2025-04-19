import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // Get username from URL parameters
      const username = req.params.username;
      console.log("Username from URL params:", username);
      
      if (!username) {
        console.error("Username is missing in URL parameters");
        return cb(new Error("Username is missing in URL parameters"), null);
      }

      // Create uploads directory in the project root
      const uploadPath = path.join(__dirname, "..", "uploads"); 
      const userUploadPath = path.join(uploadPath, username);
      
      console.log("Base upload path:", uploadPath);
      console.log("User upload path:", userUploadPath);

      // Create base uploads directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log("Created base upload directory:", uploadPath);
      }

      // Create user-specific directory if it doesn't exist
      if (!fs.existsSync(userUploadPath)) {
        fs.mkdirSync(userUploadPath, { recursive: true });
        console.log("Created user upload directory:", userUploadPath);
      }

      return cb(null, userUploadPath);
    } catch (error) {
      console.error("Error in upload destination:", error);
      return cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    try {
      // Generate a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      console.log("Generated filename:", filename);
      return cb(null, filename);
    } catch (error) {
      console.error("Error in filename generation:", error);
      return cb(error, null);
    }
  },
});

// Add file filter to only allow images
const fileFilter = (req, file, cb) => {
  console.log("File being uploaded:", file);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    console.error("Invalid file type:", file.mimetype);
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
