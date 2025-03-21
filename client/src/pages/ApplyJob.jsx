import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets, jobsData } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const ApplyJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getToken } = useAuth();
  const [jobData, setJobData] = useState(null);
  const [isApplied, setIsApplied] = useState(false); 
  const { jobs, backendUrl, userData, userApplications = [] } = useContext(AppContext);

  // Fetch Job Function
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
        checkAlreadyApplied(data.job._id);
      } else {
        toast.error(data.message || "Failed to fetch job details.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred while fetching job details.");
    }
  };

  // Function to check if user has already applied for the job
  const checkAlreadyApplied = (jobId) => {
    const hasApplied = userApplications.some(item => item.jobId._id === jobId);
    setIsApplied(hasApplied);
  };

  const applyHandler = async () => {
    if (!userData || !userData._id) {
      toast.error("Please log in/Register to apply for this job.");
      return;
    }
  
    if (isApplied) {
      toast.error("You have already applied for this job.");
      return;
    }
  
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData._id, userId: userData._id }, // Ensure userId is sent
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (data.success) {
        toast.success(data.message || "Successfully applied for the job.");
        setIsApplied(true);
      } else {
        toast.error(data.message || "Error applying for job");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };
  

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkAlreadyApplied(jobData._id);  
    }
  }, [jobData, userApplications, id]);

  if (!jobData) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={jobData.companyId?.image || assets.default_company_logo}
                alt={jobData.companyId?.name || "Company Logo"}
                className="w-24 h-24 object-cover bg-white rounded-lg p-4 max-md:mb-4 border"
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium mb-4">{jobData.title}</h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-6">
                  <span className="flex items-center gap-2 text-gray-600">
                    <img src={assets.suitcase_icon} alt="" className="w-5 h-5" />
                    {jobData.companyId?.name || "Unknown Company"}
                  </span>
                  <span className="flex items-center gap-2 text-gray-600">
                    <img src={assets.location_icon} alt="" className="w-5 h-5" />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-2 text-gray-600">
                    <img src={assets.person_icon} alt="" className="w-5 h-5" />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-2 text-gray-600">
                    <img src={assets.money_icon} alt="" className="w-5 h-5" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Section (Right-Aligned) */}
            <div className="flex flex-col items-end">
              <p className="text-gray-500 text-sm mb-2">Posted {moment(jobData.date).fromNow()}</p>
              <button
                onClick={applyHandler}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${isApplied ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isApplied}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>

              <button
                onClick={applyHandler}
                className={`px-6 py-2 mt-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${isApplied ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isApplied}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>
            </div>

            {/* Right section: More Jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More Jobs from {jobData.companyId?.name || "This Company"}</h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData._id &&
                    job.companyId?._id === jobData.companyId?._id &&
                    !userApplications.some(app => app.jobId._id === job._id)  
                )
                .slice(0, 4)
                .map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyJob;
