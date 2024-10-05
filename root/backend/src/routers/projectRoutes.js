const express = require('express');
const router = express.Router();
const Project = require('../models/project'); // Adjust path if necessary

// Route to create a new project
// Route to create a new project
router.post('/', async (req, res) => {
  try {
    const projectData = req.body;

    // Validate required fields
    const requiredFields = ['projectName', 'projectDetails', 'access', 'authorName', 'repositoryName'];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    // Initialize filePaths as an empty array
    projectData.filePaths = projectData.filePaths || ""; // Initialize filePaths

    // Set the repositoryUrl if not provided
    projectData.repositoryUrl = projectData.repositoryUrl || "";

    const newProject = new Project(projectData);
    await newProject.save();
    res.status(200).json({ message: 'Project created successfully!' });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// Route to fetch all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Route to delete a project by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // This matches with _id in MongoDB
    console.log(`Deleting project with ID: ${id}`);
    const result = await Project.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully!' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Route to get a project by ID
router.get('/:id', async (req, res) => {
  try {
    const projectId = req.params.id; // Extract project ID from the URL

    const project = await Project.findById(projectId); // Fetch project by ID

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
});

// Route to update a project by ID
// Route to update a project by ID
router.put('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const projectData = req.body;

    // Create an object with all the fields to be updated
    const updatedFields = {};
    if (projectData.projectName) updatedFields.projectName = projectData.projectName;
    if (projectData.projectDetails) updatedFields.projectDetails = projectData.projectDetails;
    if (projectData.repositoryName) updatedFields.repositoryName = projectData.repositoryName;
    if (projectData.access) updatedFields.access = projectData.access;
    if (projectData.authorName) updatedFields.authorName = projectData.authorName; // Include authorName

    // Ensure at least one field is present to update
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updatedProject = await Project.findByIdAndUpdate(projectId, updatedFields, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully!', project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// Route to add or update the file path for a project
// Route to add or update the file path for a project
router.put('/:id/add-path', async (req, res) => {
  try {
    const projectId = req.params.id;  // Extract project ID from URL
    const { filePath } = req.body;    // Extract filePath from request body

    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }

    // Find the project and update the file path field
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { filePath },  // Set the filePath field directly
      { new: true }  // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      message: 'File path added successfully!',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error adding file path:', error);
    res.status(500).json({ message: 'Failed to add file path' });
  }
}
);

router.put('/:id/add-clonedRepoUrl', async (req, res) => {
  try {
    const projectId = req.params.id; // Extract project ID from URL
    const { clonedRepoUrl } = req.body; // Extract clonedRepoUrl from request body

    if (!clonedRepoUrl) {
      return res.status(400).json({ message: 'clonedRepoUrl is required' });
    }

    // Find the project and update the clonedRepoUrl field
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { clonedRepoUrl }, // Set the clonedRepoUrl field directly
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      message: 'clonedRepoUrl added successfully!',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error adding clonedRepoUrl:', error);
    res.status(500).json({ message: 'Failed to add clonedRepoUrl' });
  }
});



module.exports = router;
