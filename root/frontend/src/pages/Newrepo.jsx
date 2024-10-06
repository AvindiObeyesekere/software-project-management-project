import React, { useState } from "react";
import { FaClone } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const Newrepo = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [repoCloned, setRepoCloned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [urlError, setUrlError] = useState(null); // State for URL validation error
  const navigate = useNavigate();
  const { projectId } = useParams(); // Retrieve projectId from URL

  const validateUrl = (url) => {
    // Regular expression to match a valid GitHub repo URL (e.g., https://github.com/username/repo.git)
    const githubUrlRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\.git$/;
    return githubUrlRegex.test(url);
  };

  const handleClone = async () => {
    // Check if the URL is valid before proceeding
    if (!validateUrl(repoUrl)) {
      setUrlError("Invalid URL format. The URL should be in this format: https://github.com/username/repo.git");
      return;
    }

    setLoading(true);
    setError(null);
    setUrlError(null); // Clear URL validation error

    try {
      const encodedUrl = encodeURIComponent(repoUrl);
      const response = await fetch(
        `http://localhost:5000/api/github/repo-files?repoUrl=${encodedUrl}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch repository files");
      }
      const data = await response.json();
      setFiles(data);
      setRepoCloned(true);
    } catch (error) {
      setError(
        "Error fetching repository files. Please check the repository URL."
      );
      console.error("Error fetching repository files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const repoNameMatch = repoUrl.match(
        /github\.com\/([^\/]+)\/([^\/]+)\.git/
      );
      const repoName = repoNameMatch ? repoNameMatch[2] : "unknown";

      // Save files to Firebase
      const response = await fetch(
        "http://localhost:5000/api/github/save-to-firebase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ files, repoName, projectId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save files to Firebase");
      }

      // After saving to Firebase, update the cloned repository URL
      const clonedRepoUrl = repoUrl; // Get the cloned repo URL
      const updateResponse = await fetch(
        `http://localhost:5000/api/projects/${projectId}/add-clonedRepoUrl`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clonedRepoUrl }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update cloned repository URL");
      }

      console.log("Files saved to Firebase and repository URL updated");
      navigate("/displayproj");
    } catch (error) {
      setError(
        "Error saving files to Firebase or updating the repository URL. Please try again."
      );
      console.error("Error saving files or updating clonedRepoUrl:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-4 space-y-4">
      <div className="w-1/2 bg-[#e0e0e0] p-4 border border-[#c0c0c0] rounded-md shadow-md flex items-center">
        <input
          type="text"
          placeholder="Paste repository URL here"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className={`flex-grow p-2 bg-[#f0f9f9] border ${
            urlError ? "border-red-500" : "border-gray-300"
          } rounded-l-md focus:outline-none focus:border-[#41889e] transition-colors duration-300`}
        />
        <button
          onClick={handleClone}
          className="bg-[#41889e] text-white p-2 rounded-r-md hover:bg-[#357a8d] flex items-center"
          disabled={loading}
        >
          <FaClone className="mr-2" />
          {loading ? "Cloning..." : "Clone Repository"}
        </button>
      </div>

      {/* Display URL validation error */}
      {urlError && (
        <div className="w-1/2 p-4 bg-red-100 border border-red-300 text-red-800 rounded-md">
          {urlError}
        </div>
      )}

      {error && (
        <div className="w-1/2 p-4 bg-red-100 border border-red-300 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <div className="w-1/2 mt-4">
        {files.length > 0 ? (
          <>
            <div className="p-4 bg-gray-100 rounded-md">
              <p>Files</p>
            </div>
            {files.map((file) => (
              <div
                key={file.sha}
                className="flex items-center p-2 bg-white border border-gray-300 rounded-md mb-2"
              >
                <a
                  href={file.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow"
                >
                  {file.name}
                </a>
              </div>
            ))}
            {repoCloned && (
              <button
                onClick={handleAddToProject}
                className="bg-[#41889e] text-white p-2 rounded-md hover:bg-[#357a8d] mt-4 flex items-center"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add To Project"}
              </button>
            )}
          </>
        ) : (
          <p>No files to display</p>
        )}
      </div>
    </div>
  );
};

export default Newrepo;
