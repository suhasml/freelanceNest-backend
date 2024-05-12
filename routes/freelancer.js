const express = require('express');
const router = express.Router();
const Developer = require('../models/developer');
const ProjectDeveloper = require('../models/projectDeveloper');

// Route to add developer
router.post('/developers', async (req, res) => {
  try {
    const { email } = req.body;
    const existingDeveloper = await Developer.findOne({ email });
    if (!existingDeveloper) {
      const newDeveloper = new Developer({ email });
      await newDeveloper.save();
      res.status(201).json(newDeveloper);
    } else {
      res.json(existingDeveloper);
    }
  } catch (error) {
    console.error('Error adding developer:', error);
    res.status(400).json({ message: error.message });
  }
});

// Route to update developer profile
router.post('/developers/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { firstName, lastName, linkedin, github, techStack } = req.body;
    const developer = await Developer.findOne({ email });
    if (developer) {
      developer.firstName = firstName;
      developer.lastName = lastName;
      developer.linkedin = linkedin;
      developer.github = github;
      developer.techStack = techStack;
      await developer.save();
      res.status(200).json(developer);
    } else {
      res.status(404).json({ message: 'Developer not found' });
    }
  } catch (error) {
    console.error('Error updating developer:', error);
    res.status(400).json({ message: error.message });
  }
});


// Route to add developer to project
router.post('/projects/developers', async (req, res) => {
  try {
    const { developerEmail, projectId } = req.body;
    const projectDeveloper = new ProjectDeveloper({ developerEmail, projectId });
    await projectDeveloper.save();
    res.status(201).json(projectDeveloper);
  } catch (error) {
    console.error('Error adding developer to project:', error);
    res.status(400).json({ message: error.message });
  }
});

// Route to retrieve projects involved by developer
router.get('/developers/:email/projects', async (req, res) => {
  try {
    const { email } = req.params;
    const projects = await ProjectDeveloper.find({ developerEmail: email }).populate('projectId');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error retrieving projects involved by developer:', error);
    res.status(500).json({ message: error.message });
  }
});

const SubmittedProject = require('../models/submittedProject');


router.post('/projects/:projectId/add-email', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    // Create a new project developer record
    const projectDeveloper = new ProjectDeveloper({ projectId, developerEmail: email });
    await projectDeveloper.save();
    console.log('Developer email added to project:', projectDeveloper);
    res.status(201).json(projectDeveloper);
  } catch (error) {
    console.error('Error adding developer email to project:', error);
    res.status(400).json({ message: error.message });
  }
});



router.post('/projects/:projectId/submit', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { developerEmail, githubLink, youtubeLink } = req.body;

    // Create a new submitted project record
    const submittedProject = new SubmittedProject({ projectId, developerEmail, githubLink, youtubeLink });
    await submittedProject.save();

    res.status(201).json(submittedProject);
  } catch (error) {
    console.error('Error submitting project information:', error);
    res.status(400).json({ message: error.message });
  }
});


router.get('/projects/:projectId/developers', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find all developers associated with the project ID
    const developers = await ProjectDeveloper.find({ projectId });

    // Extract developer emails from the result
    const developerEmails = developers.map((developer) => developer.developerEmail);

    res.status(200).json(developerEmails);
  } catch (error) {
    console.error('Error retrieving developers for project:', error);
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
