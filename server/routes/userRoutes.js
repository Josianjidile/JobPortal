import express from "express";
import { 
  applyForJob, 
  getUserData, 
  getUserJobApplications, 
  updateUserResume 
} from "../controllers/userController.js";
import upload from   "../config/multer.js" // Ensure upload middleware is correctly imported

const router = express.Router();

// Get user data
router.get('/user', getUserData);

// Apply for a job
router.post('/apply', applyForJob);

// Get applied jobs
router.get('/applications', getUserJobApplications);

// Update user resume (POST request for file upload)
router.post('/update-resume', upload.single('resume'), updateUserResume);

export default router;
