import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';


// Get user data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId; // Assuming userId is attached to req.auth in your middleware

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//apply for a job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId; 

  try {
    
    const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });

    if (isAlreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    
    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found." });
    }

 
    const jobApplication = new JobApplication({
      userId,
      companyId: jobData.companyId,
      jobId,
      date: Date.now(),
    });


    await jobApplication.save();

    res.status(201).json({
      success: true,
      message: "Successfully applied for the job.",
      jobApplication,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//get user applied job
export const getUserJobApplications = async (req, res) => {
    try {
      const userId = req.auth.userId; 
  
      // Fetch the job applications for the user, populating the related data
      const applications = await JobApplication.find({ userId })
        .populate("companyId", "name email image")
        .populate("jobId", "title description location category level salary")
        .exec();
  
   
      if (applications.length === 0) {
        return res.status(404).json({ success: false, message: "No job applications found." });
      }
  
      res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      console.error("Error fetching user job applications:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

//update user resume
export const updateUserResume = async (req, res) => {
    try {
      const userId = req.auth.userId; 
      const resumeFile = req.file; 
  
      const userData = await User.findById(userId);
  
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (resumeFile) {
        const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
        userData.resume = resumeUpload.secure_url; 
      }
  
      await userData.save(); 
  
      return res.json({ success: true, message: "Resume updated successfully" });
  
    } catch (error) {
      console.error("Error updating user resume:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
