import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    // TODO: Create status model to create custom status columns
    statuses: {
      type: [String],
      default: ['pending', 'doing', 'done'],
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
