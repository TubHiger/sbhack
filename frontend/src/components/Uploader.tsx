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
  //const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (selectedFile) {
      handleFileUpload(selectedFile);
    }

    // Send the pdf to the backend/API for text classification
  };

  async function handleFileUpload(file: File): Promise<void> {
    //throw new Error("Function not implemented.");
    // Make an API call to upload the file
    try {
      // const { data } = await uploadResumeMutation({
      //   variables: { file },
      // });
      // console.log("File upload response:", data);
      // //console.log("File uploaded:", data.uploadResume.file);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("File upload response:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle the error, e.g., show an error message, etc.
    }

    console.log("File uploaded:", file);
  }

  const handleSelectedFile = (file: File) => {
    setSelectedFile(file);
  };

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

            <ResumeUpload onFileUpload={handleSelectedFile} />

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
