const mongoose = require('mongoose');

const submittedProjectSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to Project model
  developerEmail: { type: String, required: true }, // Email of the developer
  githubLink: { type: String, required: true }, // GitHub link for the project
  youtubeLink: { type: String, required: true }, // YouTube link for the project
//   description: { type: String, required: true }, // Description of the project
//   submissionDate: { type: Date, default: Date.now } // Date of submission (optional, can be removed if not needed)
});

const SubmittedProject = mongoose.model('SubmittedProject', submittedProjectSchema);

module.exports = SubmittedProject;
