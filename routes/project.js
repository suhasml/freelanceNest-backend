  const express = require('express');
  const router = express.Router();
  const Project = require('../models/project');
  const ProjectManager = require('../models/projectManager');

  // Add User's Email to the Project Managers Collection
  router.post('/users', async (req, res) => {
    try {
      const { email } = req.body;
      console.log('Received POST request to add user:', email); // Add console log to check if the route is being triggered
      // Check if user email already exists in projectmanagers collection
      const existingManager = await ProjectManager.findOne({ email });
      if (!existingManager) {
        // If user email doesn't exist, create a new record
        const newManager = new ProjectManager({ email });
        await newManager.save();
        console.log('New project manager added:', newManager); // Add console log to check the new manager added
        res.status(201).json(newManager);
      } else {
        // If user email already exists, return existing record
        console.log('Project manager already exists:', existingManager); // Add console log to check the existing manager
        res.json(existingManager);
      }
    } catch (error) {
      console.error('Error adding project manager:', error); // Add console log to check if there's any error
      res.status(400).json({ message: error.message });
    }
  });

  // Append Projects to the User's Record in the Project Managers Collection
  // Route for adding projects
  router.post('/projects', async (req, res) => {
    try {
      const { userEmail, projectName, problemStatement, description, technologies, level, duration, money } = req.body;
      console.log('Received project data:', req.body);

      // Find the project manager by email
      const manager = await ProjectManager.findOne({ email: userEmail });
      console.log('Found manager:', manager);

      if (manager) {
        // Create a new project document
        const project = new Project({ projectName, problemStatement, description, technologies, level, duration, money });
        console.log('New project:', project);

        // Save the project to the Projects collection
        const savedProject = await project.save();

        // Add the project reference to the project manager's projects array
        manager.projects.push(savedProject._id);
        await manager.save();
        console.log('Project added to manager:', manager);

        res.status(201).json(savedProject);
      } else {
        console.log('Project manager not found');
        res.status(404).json({ message: 'Project manager not found' });
      }
    } catch (error) {
      console.error('Error adding project:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Retrieve all projects
  router.get('/projects', async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Retrieve projects by user email
  router.get('/projects/:userEmail', async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
      console.log('Fetching projects for user:', userEmail); // Add console log to track which user's projects are being fetched
      // Find the project manager by email
      const manager = await ProjectManager.findOne({ email: userEmail }).populate('projects');
      if (manager) {
        console.log('Projects found:', manager.projects); // Add console log to display the projects found
        res.status(200).json(manager.projects);
      } else {
        console.log('Project manager not found for user:', userEmail); // Add console log to indicate project manager not found
        res.status(404).json({ message: 'Project manager not found' });
      }
    } catch (error) {
      console.error('Error fetching projects:', error); // Add console log to log any errors that occur
      res.status(500).json({ message: error.message });
    }
  });

  // Route for updating projects
  router.put('/projects/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const { userEmail, question } = req.body;
        console.log('Received updated project data:', req.body);

        // Find the project by ID
        const project = await Project.findById(projectId);
        if (!project) {
            console.log('Project not found');
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update project details
        project.question = question;
        // Optionally, you can update other project details here if needed

        // Save the updated project
        const updatedProject = await project.save();
        console.log('Updated project:', updatedProject);

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(400).json({ message: error.message });
    }
  });

  router.get('/projects/questions/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        console.log('Fetching question for project:', projectId);

        // Find the project by ID
        const project = await Project.findById(projectId);
        
        if (project) {
            const question = project.question || null;
            console.log('Question found:', question);
            res.status(200).json({ question });
        } else {
            console.log('Project not found');
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: error.message });
    }
  });

  router.get('/allprojects', async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: error.message });
    }
  });

// Add route for updating project feedback for a user
router.put('/projects/:projectId/feedback/:email', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userEmail = req.params.email;
    const { grade, justification } = req.body;

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the project already has feedback array, if not, create one
    if (!project.feedback) {
      project.feedback = [];
    }

    // Find feedback for the user, if exists
    const userFeedbackIndex = project.feedback.findIndex((feedback) => feedback.userId === userEmail);

    // If user feedback exists, update it; otherwise, add new feedback
    if (userFeedbackIndex !== -1) {
      project.feedback[userFeedbackIndex] = { userId: userEmail, grade, justification };
    } else {
      project.feedback.push({ userId: userEmail, grade, justification });
    }

    // Save the updated project
    const updatedProject = await project.save();
    console.log('Updated project feedback:', updatedProject.feedback);

    res.status(200).json(updatedProject.feedback);
  } catch (error) {
    console.error('Error updating project feedback:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/projects/:projectId/feedback', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    res.json(project.feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
    

  module.exports = router;
