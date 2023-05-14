// Layout.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
//import Navbar from './Navbar';
import "./signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/pulse.css";
import "../styles/nav.css";
import { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  setSearchResults,
  setActiveSearch,
} from "../redux/actions/searchActions";
import { useDispatch } from "react-redux";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
//...

interface LayoutProps {
  children: React.ReactNode;
}

const ELASTICUSER_DETAILS = gql`
  fragment ElasticUserDetails on User {
    username
    name
    bio
    email
    hygiene
    personality
    university
    gender
    major
    sleepTime
    smoke
    pets
    similarity
    imgUrl
    hobbies
    savedImages {
      imgUrl
      prompt
    }
  }
`;

const SEARCH_USER = gql`
  mutation SearchUser($input: UserElasticSearch) {
    elasticSearch(input: $input) {
      ...ElasticUserDetails
    }
  }
  ${ELASTICUSER_DETAILS}
`;

const HomePageNav: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch(); //redux dispatch
  const navigate = useNavigate();

  // Add this inside HomePageNav functional component
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRecipes, searchedRecipes] = useMutation(SEARCH_USER);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<any>(false);

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault();
    dispatch(setActiveSearch("redux")); //dispatch the search results to redux store
    // Implement your logic to search for roommate profiles using the Elasticsearch service
    const input = {
      query: searchQuery,
    };

    // let searchedUsers1 = await searchRecipes({
    //   variables: { input }, //the input has to match the input schema type defined in backend
    // });

    //console.log("response from elastic search", searchedUsers1);
    console.log("elastic search accessed");

    //dispatch(setSearchResults(searchedUsers1.data.elasticSearch)); //dispatch the search results to redux store
    //dispatch the search results to redux store
  };

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    //dispatch(setChatbotStatus("inactive")); //dispatch the search results to redux store
    //window.location.href = "/";
    navigate("/");
    // Navigate to the root route
    // window.location.reload(); // Force a refresh of the landing page
  };

  return (
    <>
      <nav className="golden fixed top-0 left-0 w-full bg-blue-500 backdrop-blur-md bg-opacity-20 shadow-md z-10 border-t border-black">
        <div className="container mx-auto px-0 py-3 flex items-center justify-between">
          <div className="flex-shrink-0">
            {/* Logo and header */}
            <div className="bruh relative" style={{ marginLeft: "-10px" }}>
              <h1 className="text-2xl font-bold text-white rounded p-2 mb-1 relative">
                Ambrosia
              </h1>
            </div>
          </div>

          <div className="hidden md:flex md:flex-grow mr-20">
            {/* Search bar */}
            <form
              className="w-full md:w-auto mx-auto flex items-center"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="search"
                className="flex ml-5 md:w-auto rounded-l-lg p-2 focus:outline-none bg-opacity-60 focus:border-blue-600 border-2 border-blue-500 bg-white"
                style={{
                  // backgroundColor: "rgba(255, 255, 255, 0.8)",
                  width: "500px",
                }}
                placeholder="search recipes (ex: country, dish, cuisine etc)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <style>
                {`
                    input::-webkit-input-placeholder {
                      color: #555;
                      font-size: 14px;
                    }
                    input::-moz-placeholder {
                      color: #555;
                      font-size: 14px;
                    }
                    input:-ms-input-placeholder {
                      color: #555;
                      font-size: 14px;
                    }
                    input::-ms-input-placeholder {
                      color: #555;
                      font-size: 14px;
                    }
                    input::placeholder {
                      color: #555;
                      font-size: 14px;
                      }
                `}
              </style>
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-r-lg border-2 border-blue-500"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex-shrink-0">
            {/* Sign out icon */}
            <Link
              to="/"
              className="text-lg font-semibold text-white hover:text-blue-600"
              onClick={handleSignOut}
            >
              <div>
                <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0 ml-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              <FontAwesomeIcon icon={faBars} size="2x" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:hidden w-full mt-2`}
        >
          <form
            className="w-full mx-auto mb-4 flex items-center"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="search"
              className="flex w-full rounded-l-lg p-2 focus:outline-none bg-opacity-60 focus:border-blue-600 border-2 border-blue-500 bg-white"
              placeholder="Search for roommates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-r-lg border
        border-2 border-blue-500"
            >
              Search
            </button>
          </form>
        </div>
      </nav>

      <main>{children}</main>
    </>
  );
};

export default HomePageNav;
