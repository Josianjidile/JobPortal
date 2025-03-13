import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const [state, setState] = useState("Login");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  // Get function from context
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  // Disable scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    if (state === "Sign Up" && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true);
      return;
    }
  
    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });
  
        if (data.success) {
          console.log(data);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Login failed. Please try again.");
        }
      } else {
        // Handle Sign Up
        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("email", email);
        formData.append("image", image);
  
        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formData
        );
  
        if (data.success) {
          console.log(data);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login/Signup error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };
  

  useEffect(() => {
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [image]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-96"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state === "Sign Up" && isTextDataSubmitted ? (
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image" className="cursor-pointer hover:opacity-80">
              <img
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Upload Logo"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
                accept="image/*"
              />
            </label>
            <p>
              Upload Company <br /> Logo
            </p>
          </div>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="icon" className="w-5 h-5" />
                <input
                  className="outline-none text-sm w-full"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="icon" className="w-5 h-5" />
              <input
                className="outline-none text-sm w-full"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Id"
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="icon" className="w-5 h-5" />
              <input
                className="outline-none text-sm w-full"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {state === "Login" && (
          <p className="text-sm text-blue-500 my-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button className="bg-blue-700 w-full text-white py-2 rounded-full mt-4">
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create Account"
            : "Next"}
        </button>

        <p className="mt-5 text-center">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setState("Sign Up")}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setState("Login")}
              >
                Login
              </span>
            </>
          )}
        </p>

        {setShowRecruiterLogin && typeof setShowRecruiterLogin === "function" && (
          <img
            onClick={() => setShowRecruiterLogin(false)}
            src={assets.cross_icon}
            className="absolute top-5 right-5 cursor-pointer"
            alt="Close"
          />
        )}
      </form>
    </div>
  );
};

export default RecruiterLogin;
