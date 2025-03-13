import express from "express";
import { getJobById, getJobs } from "../controllers/jobController.js";

const router = express.Router();

// ROUTE TO GET ALL JOB DATA
router.get("/", getJobs);

// ROUTE to get a single job by ID
router.get("/:id", getJobById);

export default router; // Moved this line to the bottom

