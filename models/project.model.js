import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    statuses: {
      type: [String],
      default: ['pending', 'doing', 'done'],
    },
    tags: {
      type: [String],
      default: ['Low', 'Medium', 'High'],
    },
    icon: {
      type: String, // TODO: Change to a proper icon type
      default: '🚀',
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
