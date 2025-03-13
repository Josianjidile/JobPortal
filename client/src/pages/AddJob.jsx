import React, { useState, useRef, useEffect, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Dar Es Salaam");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState(0);
  const [description, setDescription] = useState("");

  const { backendUrl,companyToken } = useContext(AppContext);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const description = quillRef.current.root.innerHTML;

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        {
          title,
          description,
          location,
          salary,
          category,
          level,
        },
        { headers: { token: companyToken } }
      );

      if(data.success){
        toast.success(data.message)
        setTitle('')
        setTitle(0)
        quillRef.current.root.innerHTML =  ""
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Enter job description...",
      });

      quillRef.current.on("text-change", () => {
        setDescription(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
    <h2 className="text-2xl font-semibold text-center mb-6">
      Post a New Job
    </h2>
    <form onSubmit={onSubmitHandler} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium">Job Title</label>
        <input
          type="text"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div>
        <label className="block text-gray-700 font-medium">
          Job Description
        </label>
        <div ref={editorRef} className="min-h-[150px] border p-2 rounded-md"></div>
      </div>
  
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-gray-700 font-medium">Job Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
  
        <div className="w-1/2">
          <label className="block text-gray-700 font-medium">Job Location</label>
          <select
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
  
      <div className="flex space-x-4 mt-4">
        <div className="w-1/2">
          <label className="block text-gray-700 font-medium">Job Level</label>
          <select
            onChange={(e) => setLevel(e.target.value)}
            value={level}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
  
        <div className="w-1/2">
          <label className="block text-gray-700 font-medium">Job Salary ($)</label>
          <input
            onChange={(e) => setSalary(e.target.value)}
            type="number"
            min={0}
            placeholder="2500"
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
  
      <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
        ADD
      </button>
    </form>
  </div>
  
  );
};

export default AddJob;
