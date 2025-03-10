import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
    console.log({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-10 py-16">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white p-10 rounded-lg text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Over 10,000 jobs to apply
        </h2>
        <p className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base">
          Your next big career move starts right here – explore the best job
          opportunities and step toward your future.
        </p>

        {/* Search Inputs Section */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto bg-white p-3 rounded-lg">
          {/* Job Search Input */}
          <div className="flex items-center gap-2 bg-gray-100 p-3 w-full rounded-lg">
            <img src={assets.search_icon} alt="Search Icon" className="h-5 w-5" />
            <input
              type="text"
              placeholder="Search for a job"
              className="text-gray-700 text-sm p-2 outline-none flex-1 bg-transparent w-full"
              ref={titleRef}
            />
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2 bg-gray-100 p-3 w-full rounded-lg">
            <img src={assets.location_icon} alt="Location Icon" className="h-5 w-5" />
            <input
              type="text"
              placeholder="Location"
              className="text-gray-700 text-sm p-2 outline-none flex-1 bg-transparent w-full"
              ref={locationRef}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto hover:bg-blue-800 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="mt-10 p-6 rounded-md text-center border border-gray-300 shadow-md">
        <p className="text-gray-600 text-sm sm:text-base font-semibold">Trusted By</p>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-4 items-center justify-center">
          <img src={assets.microsoft_logo} alt="Microsoft" className="h-10 mx-auto" />
          <img src={assets.walmart_logo} alt="Walmart" className="h-10 mx-auto" />
          <img src={assets.accenture_logo} alt="Accenture" className="h-10 mx-auto" />
          <img src={assets.samsung_logo} alt="Samsung" className="h-10 mx-auto" />
          <img src={assets.amazon_logo} alt="Amazon" className="h-10 mx-auto" />
          <img src={assets.adobe_logo} alt="Adobe" className="h-10 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
