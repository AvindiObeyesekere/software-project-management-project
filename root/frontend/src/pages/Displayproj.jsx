import React, { useState, useEffect } from "react";
import ProjectDetailsPrint from "./ProjectDetailsPrint";

import {
  FaEllipsisV,
  FaArrowRight,
  FaSort,
  FaHeart,
  FaEdit,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CloneModal from "./CloneModal";
import { FaPrint } from "react-icons/fa"; // Import the print icon from react-icons

const Displayproj = () => {
  const [projects, setProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [files, setFiles] = useState([]);
  const [repoName, setRepoName] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [editedProject, setEditedProject] = useState({
    projectName: "",
    projectDetails: "",
    repositoryName: "",
  }); // State for edited project
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeProjectId, setActiveProjectId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCloneLocally = () => {
    setIsModalOpen(true); // Set modal state to true
  };

  // Function to handle cloning logic
  const handleClone = async (url, folderPath) => {
    // Accept folderPath as an argument
    console.log("Cloning repository:", url);
    console.log("Cloning to folder:", folderPath); // Log the folder path
    // Simulate cloning process with a 2-second delay
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleSaveToFirebase = async (projectId, files, repoName) => {
    try {
      const response = await fetch("http://localhost:5000/save-to-firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files, repoName, projectId }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Files saved to Firebase:", data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error saving to Firebase:", error);
    }
  };

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (project) => {
    setEditedProject({
      projectName: project.projectName,
      projectDetails: project.projectDetails,
      repositoryName: project.repositoryName,
    });
    setSelectedProjectId(project._id);
    setModalVisible(true); // Show the modal
    setErrorMessage(""); // Reset error message
  };

  const handleUpdateProject = async () => {
    console.log("Updating project with data:", editedProject);
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${selectedProjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedProject),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      // Update the projects state with the updated project
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === selectedProjectId
            ? { ...project, ...editedProject }
            : project
        )
      );

      setModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error updating project:", error);
      setErrorMessage(error.message); // Set the error message
    }
  };

  return (
    <div className="container mx-auto p-4 relative bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen p-4">
      <div className="flex justify-between mb-12 items-center">
        {/* Left side content */}
        <div className="flex space-x-6 items-center">
          {/* Search input */}
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none pl-10" // Padding for the search icon
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />{" "}
            {/* Search icon */}
          </div>

          {/* Sort by empty projects button */}
          <button className="flex relative w-1/2 items-center px-4 py-2 border rounded-full bg-[#41889e] text-white hover:bg-[#357a8d] focus:outline-none">
            <FaSort className="mr-2" />
            Sort By Empty Projects
          </button>

          {/* Project count */}
          <span className="flex   text-[#41889e] font-semibold">
            {filteredProjects.length} Project
            {filteredProjects.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Right side content */}
        <div>
          {/* Projects List */}
          {filteredProjects.map((project) => (
            <div key={project._id}>
              {/* Render project details or any other content */}
              <h3>{project.name}</h3>
            </div>
          ))}

          {/* Button shown only once, outside the map */}
          <button
            onClick={() => setActiveProjectId(filteredProjects[0]?._id)} // Set the first project as default (or handle selecting another project)
            className="flex items-center px-4 py-2 border border-[#41889e] text-[#41889e] hover:bg-[#41889e] hover:text-white rounded-md shadow transition-all duration-200"
          >
            <FaPrint className="mr-2" /> {/* Icon with margin right */}
            Print Project Details
          </button>

          {/* Render the Print Modal only if there's an active project */}
          {activeProjectId && (
            <ProjectDetailsPrint
              projectId={activeProjectId} // Pass the selected project ID
              onClose={() => setActiveProjectId(null)} // Handle modal close
            />
          )}
        </div>
      </div>

      {filteredProjects.map((project, index) => (
        <div
          key={project._id}
          className="mb-4 p-4 border rounded-md shadow-md space-y-2 bg-white"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{project.projectName}</h2>
              <p className="text-sm text-gray-600">{project.projectDetails}</p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Repository Name:</strong> {project.repositoryName}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                <strong>Repository URL:</strong>{" "}
                {project.repositoryUrl &&
                project.repositoryUrl.trim() !== "" ? (
                  project.repositoryUrl
                ) : (
                  <span>No repo cloned</span>
                )}
              </p>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mt-2">
                  <strong>File Path:</strong>{" "}
                  {project.filePath && project.filePath.trim() !== "" ? (
                    project.filePath
                  ) : (
                    <span>No file path added</span>
                  )}
                </p>
              </div>

              {/* Conditionally render the "Add Repository" button */}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)} // Open the modal on click
                className="px-4 py-2 border border-transparent text-[#66b3b8] rounded-md transition duration-300 hover:border-[#66b3b8] hover:bg-transparent flex justify-center items-center"
                style={{ width: "150px" }} // Reduce the button width
              >
                Add File Path
              </button>
              {/* Render CloneModal and pass required props */}
              <CloneModal
                isOpen={isModalOpen} // Pass the modal visibility state
                onClose={() => setIsModalOpen(false)} // Close the modal when the user clicks outside or presses close
                projectId={project._id} // Pass the project ID to the modal
              />
              {project.repositoryUrl.trim() === "" && (
                <a
                  onClick={() => navigate(`/newrepo/${project._id}`)} // Use project ID to navigate
                  className="flex items-center px-4 py-2 text-[#41889e] hover:shadow-md hover:shadow-gray-400 focus:outline-none transition-shadow duration-300 cursor-pointer"
                >
                  <span className="mr-2">Add Repository</span>
                  <FaArrowRight />
                </a>
              )}

              <a
                onClick={() => handleEditClick(project)} // Show modal on click
                className="flex items-center px-4 py-2 text-[#41889e] hover:shadow-md hover:shadow-gray-400 focus:outline-none transition-shadow duration-300"
              >
                <span className="mr-2">Edit</span>
                <FaEdit />
              </a>
              <FaHeart className="text-[#41889e] cursor-pointer" />
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="focus:outline-none"
                >
                  <FaEllipsisV className="text-[#41889e]" />
                </button>
                {dropdownVisible === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      Delete Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <a
        href="/createrepo"
        className="fixed bottom-4 right-4 bg-[#41889e] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#357a8d] focus:outline-none flex items-center space-x-2"
      >
        <div className="text-white text-xl font-bold">+</div>
        <span>Add New Project</span>
      </a>

      {/* Modal for Editing Project */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit Project</h2>
            <div>
              <label className="block mb-2" htmlFor="projectName">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                className="w-full border rounded-md px-3 py-2"
                value={editedProject.projectName}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    projectName: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2" htmlFor="projectDetails">
                Project Details
              </label>
              <textarea
                id="projectDetails"
                className="w-full border rounded-md px-3 py-2"
                value={editedProject.projectDetails}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    projectDetails: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2" htmlFor="repositoryName">
                Repository Name
              </label>
              <input
                type="text"
                id="repositoryName"
                className="w-full border rounded-md px-3 py-2"
                value={editedProject.repositoryName}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    repositoryName: e.target.value,
                  })
                }
              />
            </div>
            {errorMessage && (
              <div className="mt-4 text-red-500">
                {errorMessage} {/* Display the error message */}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-[#41889e] text-white rounded-md hover:bg-[#357a8d] mr-2"
                onClick={handleUpdateProject}
              >
                Save
              </button>
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Displayproj;
