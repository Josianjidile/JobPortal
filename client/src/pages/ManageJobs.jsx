import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]); // Fix: Initialize as an empty array
  const { backendUrl, companyToken } = useContext(AppContext);

  // Function to fetch company job applications data
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companyToken },
      });

      if (data.success && Array.isArray(data.jobsData)) {
        setJobs([...data.jobsData].reverse());
      } else {
        setJobs([]);
        toast.error(data.message || "No jobs found.");
      }
    } catch (error) {
      toast.error(error.message);
      setJobs([]);
    }
  };

  // function to change job visibility

  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        {
          headers: { token: companyToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobs();
  }, [companyToken]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Manage Jobs</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Applicants
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Visible
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {job.applicants}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <input
                      onChange={() => changeJobVisibility(job._id)}
                      type="checkbox"
                      checked={job.visible}
                      readOnly
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700"
          onClick={() => navigate("/dashboard/add-job")}
        >
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
