import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth(); 
  const { backendUrl, userData, userApplications, fetchUserData } = useContext(AppContext);

  const UpdateResume = async () => {
    try {
      if (!resume) {
        return toast.error("Please select a resume to upload");
      }

      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsEdit(false);
    setResume(null);
  };

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <p className="text-xl font-semibold">
          {resume ? resume.name : userData?.resume ? "Resume Selected" : "Select Resume"}
        </p>

        <div className="flex gap-2 mt-3 mb-6">
          {isEdit || (userData && !userData.resume) ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  Select Resume
                </p>
                <input
                  onChange={(e) => setResume(e.target.files[0])}
                  type="file"
                  hidden
                  accept="application/pdf"
                  id="resumeUpload"
                />
                <img src={assets.profile_upload_icon} alt="Upload Icon" />
              </label>
              <button
                onClick={UpdateResume}
                className="bg-green-100 text-green-600 px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </>
          ) : userData?.resume ? (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
                href={userData.resume}
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-400 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          ) : (
            <p className="text-red-500">No resume uploaded</p>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        {userApplications?.length > 0 ? (
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b text-left">Company</th>
                <th className="py-3 px-4 border-b text-left">Job Title</th>
                <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
                <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.map((job, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 flex items-center gap-2 border-b">
                    <img src={job?.companyId?.image} alt="Company Logo" className="w-8 h-8" />
                    {job?.companyId?.name || "Unknown"}
                  </td>
                  <td className="py-2 px-4 border-b">{job?.jobId?.title || "N/A"}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">{job?.jobId?.location || "N/A"}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job?.date ? moment(job.date).format("ll") : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`${
                        job?.status === "Accepted"
                          ? "bg-green-100"
                          : job?.status === "Rejected"
                          ? "bg-red-100"
                          : job?.status === "Pending"
                          ? "bg-yellow-100"
                          : ""
                      } px-2 py-1 rounded-md`}
                    >
                      {job?.status || "Unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No job applications found.</p>
        )}
      </div>
    </>
  );
};

export default Applications;
