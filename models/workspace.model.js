import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  memberRole: {
    type: String,
    enum: ['ADMIN', 'COLLABORATOR', 'READER'],
    required: true,
  },
});

const workspaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    members: [memberSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
