import Job from "../models/Job.js"; // Added missing `.js` extension

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password",
    });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get a single job by ID
export const getJobById = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id).populate({
        path: "companyId",
        select: "-password",
      });
  
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      return res.status(200).json({
        success: true,
        job,
      });
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };