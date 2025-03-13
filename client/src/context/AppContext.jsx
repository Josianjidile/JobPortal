import { useEffect, useState, createContext, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch jobs");
    }
  };

  // Fetch Company Data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch company data"
      );
    }
  };

  //function  to fetch user's applied  applications data

  const fetchUserApplications = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserApplications(data.applications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
  if(user){
    fetchUserData()
    fetchUserApplications( )
  }
  }, [user])

  // Fetch User Data
  const fetchUserData = async () => {
    try {
      if (!user) return; // Ensure user is defined before proceeding

      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  // Fetch user data when the user is available
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]); // Runs only when `user` changes

  // Fetch jobs and check for stored company token on mount
  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []); // Runs once when the component mounts

  // Fetch company data when companyToken changes
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]); // Runs when `companyToken` changes

  const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    setShowRecruiterLogin,
    showRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    userData,
    userApplications,
    backendUrl,
    setUserData,
    setUserApplications,
    fetchUserData,
    fetchUserApplications
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
