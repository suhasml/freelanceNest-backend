const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true },
  justification: { type: String, required: true }
}); 

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  problemStatement: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  level: { type: String, required: true },
  duration: { type: String, required: true },
  money: { type: String, required: true },
  question : { type: String},
  feedback : [feedbackSchema]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
