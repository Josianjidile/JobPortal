import express, { Router } from "express";

import { 
  changeJobApplicationsStatus, 
  changeJobVisibility, 
  getCompanyData, 
  getCompanyJobApplicants, 
  getCompanyPostedJobs, 
  loginCompany, 
  postJob, 
  registerCompany 
} from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middleware/authMiddleware.js";

const router = Router();

// Register a company
router.post("/register",upload.single("image"), registerCompany);

// Company login
router.post("/login", loginCompany);

// Get company data
router.get("/company",protectCompany, getCompanyData);

// Post a job
router.post("/post-job",protectCompany, postJob);

// Get applicants data of company
router.get("/applicants",protectCompany, getCompanyJobApplicants);

// Get company job list
router.get("/list-jobs",protectCompany, getCompanyPostedJobs);

// Change applicant status
router.post("/change-status", changeJobApplicationsStatus);

// Change applicant visibility
router.post("/change-visibility",protectCompany, changeJobVisibility);

export default router;
