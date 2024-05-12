const mongoose = require('mongoose');

const projectManagerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] // Reference to Project model
});

const ProjectManager = mongoose.model('ProjectManager', projectManagerSchema);

module.exports = ProjectManager;
