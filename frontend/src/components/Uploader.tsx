import React, { useState, useCallback } from "react";
//import "../styles/tailwind.css";
import "./login.css";
import { FiX } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faLightbulb,
  faSearch,
  faSignIn,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
//import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";
import backgroundPic from "../assets/resumai-background.jpg";
import { useDropzone, DropzoneOptions } from "react-dropzone";

// const USER_DETAILS = gql`
//   fragment SignedInUserDetails on User {
//     username
//     imgUrl
//     university
//     major
//     favCuisines
//     email
//     name
//     bio
//   }
// `;

// const VERIFY_USER = gql`
//   mutation ValidateUser($input: UserInputLogin!) {
//     userLogin(input: $input) {
//       ...SignedInUserDetails
//     }
//   }
//   ${USER_DETAILS}
// `;

type ResumeUploadProps = {
  onFileUpload: (file: File) => void;
};

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      onFileUpload(acceptedFiles[0]);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf" as unknown as DropzoneOptions["accept"],
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed text-white border-black p-4"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the resume PDF file here...</p>
      ) : (
        <p>Drag and drop a resume PDF file here, or click to select a file.</p>
      )}
    </div>
  );
};

const Uploader = () => {
  //implement for recommendations and userprofile page

  const navigate = useNavigate();

  //const [validateUser, validatedUser] = useMutation(VERIFY_USER);
  //const validatedUser = useQuery(VERIFY_USER); //the response implies that the user has been validated in the backend

  //const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const [formData, setFormData] = useState({
    password: "",
    username: "",
  });

  //updates the formData above whenever a change is detected in the text field via user interaction
  // const handleChange = (e: any) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Send the pdf to the backend/API for text classification
    try {
      const { username, password } = formData; //destructuring the data to be passed as a req in createUser
      //graphql req: input payload
      const input = {
        username, //this value has to be passed in from the signup flow to establish the relationship
        password,
      };

      // try {
      //   const signedUser = await validateUser({
      //     variables: { input }, //the input has to match the input schema type defined in backend
      //   });
      //   // signedUserData = signedUser["userLogin"]
      //   console.log("API response:", signedUser.data);
      //   navigate("/home", { state: { signedUser } });
      // } catch (error) {
      //   console.error("API error:", error);
      //   alert("incorrect credentials");
      //   // Handle the error, e.g., show error message, etc.
      // }
    } catch (error) {
      console.error("API error:", error);
      // Handle the error, e.g., show error message, etc.
      //implement toastify
    }
  };

  function handleFileUpload(file: File): void {
    throw new Error("Function not implemented.");
  }

  /* the react component to handle resume uploads from local disk and send data to backend for classification*/
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundPic})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className=" bg-blue-500 bg-opacity-20 backdrop-blur-md p-8 border border-black rounded-lg shadow-md w-full max-w-md mx-auto"
      >
        {/* ... */}
        <div className="rounded-md shadow-sm -space-y-px mb-4">
          {/* ... */}
          <div className="mt-4">
            <h1 className="block mb-4 text-white">Upload your resume (PDF):</h1>
            <ResumeUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
        {/* ... */}
        <button
          type="submit"
          className="px-4 py-2 text-white font-semibold rounded hover:bg-opacity-80 mt-2 transition-all"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(37, 99, 235, 0.6)",
          }}
        >
          Enhance
        </button>
      </form>
    </div>
  );
};

export default Uploader;
