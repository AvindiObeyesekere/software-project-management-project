const express = require("express");
const router = express.Router();
const axios = require("axios");
const admin = require("firebase-admin");
const path = require("path");
const Project = require("../models/project"); // Import the MongoDB model

// Initialize Firebase Admin (Firestore and Storage)
const serviceAccountPath = path.resolve(
  "src/repository-fab74-firebase-adminsdk-qojz1-7280c2c782.json"
);

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  storageBucket: "repository-fab74.appspot.com",
});

const bucket = admin.storage().bucket();

// GitHub token (add your GitHub token here)
const token = "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"; // Replace with your GitHub token

// Utility function to convert GitHub URL to API URL
const getApiPathFromUrl = (url) => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\.git/);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
};

// Fetch repository files from GitHub
router.get("/repo-files", async (req, res) => {
  const { repoUrl } = req.query;

  if (!repoUrl) {
    return res.status(400).json({ message: "Repository URL is required" });
  }

  const repoInfo = getApiPathFromUrl(repoUrl);
  if (!repoInfo) {
    return res.status(400).json({ message: "Invalid repository URL" });
  }

  const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const files = response.data;
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching repository files:", error);
    res.status(500).json({ message: "Failed to fetch repository files" });
  }
});

// Route to save files to Firebase Storage and update MongoDB with folder URL
router.post("/save-to-firebase", async (req, res) => {
  const { files, repoName, projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  try {
    // Loop through each file and upload to Firebase Storage
    for (let file of files) {
      // Check if file has a valid download_url
      if (!file.download_url) {
        console.error(`Invalid or missing download_url for file: ${file.path}`);
        continue; // Skip this file
      }

      // Download file content from GitHub using arraybuffer response type
      const fileResponse = await axios.get(file.download_url, {
        headers: {
          Authorization: `token ${token}`,
        },
        responseType: "arraybuffer", // Ensure raw data is fetched
      });

      // Convert the raw data into a buffer
      const buffer = Buffer.from(fileResponse.data);

      // Upload to Firebase Storage using repository name as part of the path
      const fileUpload = bucket.file(`${repoName}/${file.path}`);
      await fileUpload.save(buffer, {
        metadata: { contentType: file.type }, // Ensure the contentType is set appropriately
      });
    }

    // Construct the folder URL for the repository in Firebase Storage
    const folderUrl = `https://storage.googleapis.com/${bucket.name}/${repoName}/`;

    // Update MongoDB with folder URL
    const project = await Project.findByIdAndUpdate(
      projectId,
      { repositoryUrl: folderUrl },
      { new: true }
    );

    if (project) {
      res.status(200).json({
        message:
          "Files successfully saved to Firebase Storage and repositoryUrl updated",
        folderUrl,
      });
    } else {
      res.status(404).json({ message: "Project not found in MongoDB" });
    }
  } catch (error) {
    console.error("Error uploading files or updating MongoDB:", error);
    res.status(500).json({
      message: "Failed to upload files to Firebase or update MongoDB",
    });
  }
});


// New route to fetch commit count, author names, and avatar URLs
router.get("/commit-info", async (req, res) => {
  const { repoUrl } = req.query;

  if (!repoUrl) {
    return res.status(400).json({ message: "Repository URL is required" });
  }

  const repoInfo = getApiPathFromUrl(repoUrl);
  if (!repoInfo) {
    return res.status(400).json({ message: "Invalid repository URL" });
  }

  const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const commits = response.data;

    // Get the total number of commits
    const commitCount = commits.length;

    // Extracting necessary author information for each commit
    const authorInfo = commits.map((commit) => {
      return {
        committerName: commit.committer ? commit.committer.login : "Unknown",
        numberOfCommits: commitCount,
        authorEmail: commit.committer ? commit.committer.email : "No email available",
        createdDate: commit.commit.author.date,
        organizations: commit.author ? commit.author.login : "N/A", // Change this line based on how you want to get organization data
      };
    });

    res.status(200).json({ commitCount, authorInfo });
  } catch (error) {
    console.error("Error fetching commit info:", error);
    res.status(500).json({ message: "Failed to fetch commit info" });
  }
});


module.exports = router;
