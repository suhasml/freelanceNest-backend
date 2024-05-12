const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  linkedin: { type: String },
  github: { type: String },
  techStack: { type: [String] }, // Array of strings for tech stack
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] // Reference to Project model
});

const Developer = mongoose.model('Developer', developerSchema);

module.exports = Developer;
