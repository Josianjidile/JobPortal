import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../components/Loading";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(null); // Use null instead of false

  // Function to fetch company job applications
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });

      if (data.success && Array.isArray(data.applications)) {
        setApplicants([...data.applications].reverse()); // Use 'applications' instead of 'applicants'
      } else {
        setApplicants([]); // Avoid undefined issues
        toast.error(data.message || "No applications found");
      }
    } catch (error) {
      setApplicants([]); // Handle errors properly
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Function to update job application status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        {
          headers: { token: companyToken },
        }
      );

      if (data.success) {
        toast.success(`Application ${status}`);
        fetchCompanyJobApplications(); // Refresh the list after status change
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  if (applicants === null) {
    return <Loading />; // Show loading while fetching data
  }

  if (applicants.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No applications found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div>
        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">User Name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants
              .filter((item) => item?.jobId && item?.userId)
              .map((applicant, index) => (
                <tr className="text-gray-700" key={applicant._id}>
                  <td className="py-2 px-4 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b flex items-center">
                    <img
                      className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                      src={applicant?.userId?.image || assets.default_profile}
                      alt="User Profile"
                    />
                    <span>{applicant?.userId?.name || "Unknown"}</span>
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {applicant?.jobId?.title || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {applicant?.jobId?.location || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {applicant?.userId?.resume ? (
                      <a
                        href={applicant.userId.resume}
                        className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Resume{" "}
                        <img
                          src={assets.resume_download_icon}
                          alt="Resume Icon"
                        />
                      </a>
                    ) : (
                      <span className="text-gray-400">No Resume</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b relative">
                    {applicant.status === "Pending" ? (
                      <div className="relative inline-block text-left group">
                        <button className="text-gray-500 action-button">
                          ...
                        </button>
                        <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border-gray-200 rounded shadow group-hover:block">
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(
                                applicant._id,
                                "Accepted"
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(
                                applicant._id,
                                "Rejected"
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>{applicant.status}</div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
