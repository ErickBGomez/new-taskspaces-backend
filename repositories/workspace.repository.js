import Workspace from '../models/workspace.model.js';

export const findAllWorkspaces = async () => {
  return await Workspace.find();
};

export const findWorkspaceById = async (id) => {
  return await Workspace.findById(id);
};

export const findWorkspaceByTitle = async (title, userId) => {
  return await Workspace.findOne({ title, owner: userId });
};

export const findWorkspacesByOwnerId = async (ownerId) => {
  return await Workspace.find({ owner: ownerId });
};

export const createWorkspace = async (workspace) => {
  return await Workspace.create(workspace);
};

export const updateWorkspace = async (id, workspace) => {
  return await Workspace.findByIdAndUpdate(id, workspace, { new: true });
};

export const deleteWorkspace = async (id) => {
  return await Workspace.findByIdAndDelete(id);
};

// Members
export const findMembers = async (workspaceId) => {
  const workspace = await Workspace.findById(workspaceId).populate(
    'members.user',
    '-password -role'
  );

  if (!workspace) return null;

  return workspace.members;
};

export const findMember = async (workspaceId, memberId) => {
  const workspace = await Workspace.findById(workspaceId).populate(
    'members.user',
    '-password -role'
  );

  if (!workspace) return null;

  const member = workspace.members.find(
    (member) => member.user?._id.toString() === memberId
  );

  if (!member) return null;

  return member;
};

export const inviteMember = async (workspaceId, memberId, memberRole) => {
  return await Workspace.findByIdAndUpdate(
    workspaceId,
    {
      $push: { members: { user: memberId, memberRole } },
    },
    { new: true }
  );
};

export const updateMember = async (workspaceId, memberId, memberRole) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, 'members.user': memberId },
    { $set: { 'members.$.memberRole': memberRole } },
    { new: true }
  );
};

export const removeMember = async (workspaceId, memberId) => {
  return await Workspace.findByIdAndUpdate(
    workspaceId,
    {
      $pull: { members: { user: memberId } },
    },
    { new: true }
  );
};
