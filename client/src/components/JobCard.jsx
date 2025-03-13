import React from 'react';
import { assets } from '../assets/assets';
import {useNavigate} from "react-router-dom"

const JobCard = ({ job }) => {
  const navigate = useNavigate()
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      {/* Company Logo */}
      <div className="mb-3">
        <img src={job.companyId.image} alt={`${job.company} logo`} className="h-12 w-12" />
      </div>

      {/* Job Title */}
      <h4 className="text-lg font-semibold">{job.title}</h4>

      {/* Job Details */}
      <div className="flex gap-3 text-gray-600 text-sm my-2">
        <span className=' bg-blue-50 border border-blue-200 px-4 py-1.5 rounded text-gray-700 text-sm'>{job.location}</span>
        <span className=' bg-red-50 border border-blue-200 px-4 py-1.5 rounded text-gray-700 text-sm'>{job.level}</span>
      </div>

      {/* Job Description Preview */}
      <p className="text-gray-700 text-sm">
        <span dangerouslySetInnerHTML={{ __html: job.description?.slice(0, 150) || '' }}></span>...
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button onClick={()=> {navigate(`/apply-job/${job._id}`); scrollTo(0,0)}} className="bg-blue-500 text-white px-4 py-2 rounded">Apply Now</button>
        <button onClick={()=> {navigate(`/apply-job/${job._id}`); scrollTo(0,0)}} className="border px-4 py-2 rounded">Learn More</button>
      </div>
    </div>
  );
};

export default JobCard;
