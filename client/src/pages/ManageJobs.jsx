import React from 'react';
import { manageJobsData } from '../assets/assets';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ManageJobs = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Manage Jobs</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Job Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Location</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Applicants</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Visible</th>
            </tr>
          </thead>
          <tbody>
            {manageJobsData.map((job, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{job.title}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{moment(job.date).format("ll")}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{job.location}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{job.applicants}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  <input type="checkbox" name="" id="" checked={job.visible} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700"
          onClick={() => navigate('/dashboard/add-job')} // Navigate to the "Add New Job" page
        >
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
