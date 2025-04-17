import mongoose from 'mongoose';

// TODO: Check assignedMembers functionality
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // TODO: Get first status from project instead of hardcoding it
    status: {
      type: String,
      default: 'pending',
    },
    description: {
      type: String,
    },
    // TODO: Use tag model instead of strings
    tags: [
      {
        type: String,
      },
    ],
    date: {
      type: String,
      nullable: true,
    },
    timer: {
      type: Number,
      default: 0,
    },
    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
