import Workspace from '../models/workspace.model.js';

export const findAllWorkspaces = async (userId) => {
  return await Workspace.find({ owner: userId }).populate('members.user');
};

export const findWorkspaceById = async (id, userId) => {
  return await Workspace.findOne({ _id: id, owner: userId }).populate(
    'members.user'
  );
};

export const findWorkspaceByTitle = async (title, userId) => {
  return await Workspace.findOne({ title, owner: userId });
};

export const findWorkspacesByOwnerId = async (ownerId) => {
  return await Workspace.find({ owner: ownerId });
};

export const findWorkspaceByOwnerId = async (id, ownerId) => {
  return await Workspace.findOne({ _id: id, owner: ownerId }).populate(
    'members.user'
  );
};

export const createWorkspace = async (workspace) => {
  return await Workspace.create(workspace);
};

export const inviteMember = async (workspaceId, ownerId, memberId, role) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, owner: ownerId, 'members.user': memberId },
    {
      $set: { 'members.$.role': role },
    },
    { new: true }
  ).then(async (workspace) => {
    if (!workspace) {
      return await Workspace.findOneAndUpdate(
        { _id: workspaceId, owner: ownerId },
        {
          $push: { members: { user: memberId, role } },
        },
        { new: true }
      );
    }
    return workspace;
  });
};

export const removeMember = async (workspaceId, ownerId, memberId) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, owner: ownerId },
    {
      $pull: { members: { user: memberId } },
    },
    { new: true }
  );
};

export const updateWorkspace = async (id, userId, workspace) => {
  return await Workspace.findOneAndUpdate(
    { _id: id, owner: userId },
    workspace,
    { new: true }
  );
};

export const deleteWorkspace = async (id, userId, workspace) => {
  return await Workspace.findOneAndDelete(
    { _id: id, owner: userId },
    workspace
  );
};
