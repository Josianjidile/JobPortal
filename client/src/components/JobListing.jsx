import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedLocations.length === 0 || selectedLocations.includes(job.location);

    const matchesTitle = (job) =>
      searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter((job) => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job));

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  return (
    <div className="container mx-auto px-4 sm:px-10 py-2 flex flex-col lg:flex-row max-lg:space-y-8">
      {/* Sidebar (Search Filters) */}
      <div className="w-full lg:w-1/4 p-4">
        {/* Search Filter Section */}
        {isSearched && (searchFilter.title || searchFilter.location) && (
          <>
            <h3 className="font-medium text-lg mb-2 text-gray-900">Current Search</h3>
            <div className="mb-3 text-gray-500 flex flex-wrap gap-3">
              {searchFilter.title && (
                <span className="ml-2 inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded text-gray-700 text-sm">
                  {searchFilter.title}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, title: "" }))}
                    src={assets.cross_icon}
                    className="h-4 w-4 cursor-pointer"
                    alt="Remove"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-blue-200 px-4 py-1.5 rounded text-gray-700 text-sm">
                  {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, location: "" }))}
                    src={assets.cross_icon}
                    className="h-4 w-4 cursor-pointer"
                    alt="Remove"
                  />
                </span>
              )}
            </div>
          </>
        )}
        <button onClick={() => setShowFilter((prev) => !prev)} className="px-6 py-1.5 rounded border border-gray-400 lg:hidden">
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-6">Search by Category</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  type="checkbox"
                  name={category}
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                  id={`category-${index}`}
                />
                <label htmlFor={`category-${index}`}>{category}</label>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-6">Search by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  type="checkbox"
                  name={location}
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocations.includes(location)}
                  id={`location-${index}`}
                />
                <label htmlFor={`location-${index}`}>{location}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listing */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-listing">
          Latest Jobs
        </h3>
        <p className="mb-8">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>

        {/* Pagination (Always Show at Least One Page) */}
        {filteredJobs.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
            >
              <img src={assets.left_arrow_icon} alt="Previous" />
            </a>

            {Array.from({ length: Math.max(1, Math.ceil(filteredJobs.length / 6)) }).map((_, index) => (
              <a href="#job-listing" key={index}>
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                    currentPage === index + 1 ? "bg-blue-100" : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </button>
              </a>
            ))}

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredJobs.length / 6)));
              }}
            >
              <img src={assets.right_arrow_icon} alt="Next" />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
