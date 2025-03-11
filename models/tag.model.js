import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
      default: '#7A35DB',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
