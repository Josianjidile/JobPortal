import Company from "../models/company.js";
import JobApplication from "../models/JobApplication.js";

import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";

// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res
        .status(409)
        .json({ success: false, message: "Company already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    return res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("Error registering company:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing email or password" });
  }

  try {
    const company = await Company.findOne({ email });

    if (!company) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    return res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("Error logging in company:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get company data
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;

  const companyId = req.company._id;

  console.log(companyId, { title, description, location, salary });

  try {
    const newJob = await Job.create({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
    });
    await newJob.save();

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      newJob,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//get company company

export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    // Find job applications for the company and populate relevant data
    const applications = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category")
      .exec();

    return res.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get company data
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    // Adding no. of applicants info in data
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return {
          ...job.toObject(),
          applicants: applicants.length,
        };
      })
    );

    res.status(200).json({ success: true, jobsData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get company data

export const changeJobApplicationsStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    await JobApplication.findOneAndUpdate({ _id: id }, { status });

    res
      .status(200)
      .json({ success: true, message: "Application status updated" });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get company data

export const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
      await job.save();
      return res.status(200).json({ success: true, job });
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this job",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
