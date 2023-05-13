import React, { useState } from "react";
import "../styles/tailwind.css";
//import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundPic from "../assets/backgroundramsai.jpg";
import "./signup.css";

const VERIFY_USERNAME = gql`
  mutation CreateUser($input: UniqueID) {
    verifyUniqueness(input: $input)
  }
`;

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [verifyUniqueness, uniqueUsername] = useMutation(VERIFY_USERNAME);

  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    email: "",
    username: "",
  });

  const validatePassword = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  //updates the formData above whenever a change is detected in the text field via user interaction
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleError = (error: any) => {
    console.error("API error:", error);
    toast.error(error.message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Perform validation logic here
    const isPasswordValid = validatePassword();
    if (!isPasswordValid) {
      // Submit form data
      alert("Passwords do not match");
      return;
    } else {
      // Send data to the backend/API for registration
      try {
        const { password, username, email } = formData; //destructuring the data to be passed as a req in createUser
        //graphql req: input payload passed as state var to profile info page
        const input = {
          password,
          username,
          email,
        };
        try {
          //validate the uniqueness of the login creds
          const response = await verifyUniqueness({
            variables: { input },
          });

          console.log("verify uniqueness response", response);
          if (response["data"].verifyUniqueness === "username already taken") {
            //throw toastify alert about duplicate username
            //throw console.error("username already taken");
            throw new Error("username already taken");
          } else {
            navigate("/profile-setup", { state: { input } }); //passing the username from response as context for the personal info page
          }
        } catch (error) {
          console.error("API error:", error);
          // Handle the error, e.g., show error message, etc.
          handleError(error);
        }

        // You can handle the response data here, e.g., show success message, redirect, etc.
      } catch (error) {
        console.error("API error:", error);
        // Handle the error, e.g., show error message, etc.
      }
      console.log("Form submitted:", formData);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundPic})`,
      }}
    >
      <div className=" max-w-md border border-black backdrop-blur-md bg-blue-500 bg-opacity-20 w-full space-y-8 p-6 rounded-lg shadow-lg">
        <Link
          to="/login"
          className="position: relative top-2 right-2 text-blue"
        >
          <FiArrowLeft size={29} />
        </Link>
        <div>
          <h2
            className="text-2xl font-semibold mb-4 text-center text-white"
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            Create Profile
          </h2>
        </div>
        <hr className="border-1 border-black mb-8" />
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-2">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="my-input appearance-none rounded-none relative block w-full px-3 py-2 border border-black placeholder-black-500 text-white rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                style={{ backgroundColor: "rgba(0, 123 , 123, 0.3)" }}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="my-input mb-2 appearance-none rounded-none relative block w-full px-3 py-2 border border-black placeholder-black-500 text-white rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                style={{ backgroundColor: "rgba(0, 123 , 123, 0.3)" }}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="my-input appearance-none mb-2 rounded-none relative block w-full px-3 py-2 border border-black placeholder-black-500 text-white rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                style={{ backgroundColor: "rgba(0, 123 , 123, 0.3)" }}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="my-input appearance-none mb-2 rounded-none relative block w-full px-3 py-2 border border-black placeholder-black-500 text-white rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                style={{ backgroundColor: "rgba(0, 123 ,123, 0.3)" }}
              />
            </div>
          </div>

          {confirmPasswordError && (
            <div className="mt-3 text-sm text-red-600">
              {confirmPasswordError}
            </div>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-white font-semibold rounded hover:bg-opacity-80 transition-all mr-4"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(37, 99, 235, 0.6)",
            }}
          >
            Next
          </button>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
