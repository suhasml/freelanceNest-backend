const mongoose = require('mongoose');

const projectDeveloperSchema = new mongoose.Schema({
  developerEmail: { type: String, required: true }, // Email of the developer
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true } // Reference to Project model
});

const ProjectDeveloper = mongoose.model('ProjectDeveloper', projectDeveloperSchema);

module.exports = ProjectDeveloper;
