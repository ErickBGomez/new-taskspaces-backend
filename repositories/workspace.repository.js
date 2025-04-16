import Workspace from '../models/workspace.model.js';

export const findAllWorkspaces = async (userId) => {
  return await Workspace.find({ owner: userId }).populate('members.user');
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

export const findWorkspaceByOwnerId = async (id, ownerId) => {
  return await Workspace.findOne({ _id: id, owner: ownerId }).populate(
    'members.user'
  );
};

export const createWorkspace = async (workspace) => {
  return await Workspace.create(workspace);
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

// Members
export const findMember = async (workspaceId, memberId) => {
  const workspace =
    await Workspace.findById(workspaceId).populate('members.user');

  if (!workspace) return null;

  const member = workspace.members.find(
    (member) => member.user._id.toString() === memberId
  );

  if (!member) return null;

  return member;
};

export const inviteMember = async (
  workspaceId,
  ownerId,
  memberId,
  memberRole
) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, owner: ownerId, 'members.user': memberId },
    {
      $set: { 'members.$.memberRole': memberRole },
    },
    { new: true }
  ).then(async (workspace) => {
    if (!workspace) {
      return await Workspace.findOneAndUpdate(
        { _id: workspaceId, owner: ownerId },
        {
          $push: { members: { user: memberId, memberRole } },
        },
        { new: true }
      );
    }
    return workspace;
  });
};

export const updateMember = async (
  workspaceId,
  ownerId,
  memberId,
  memberRole
) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, owner: ownerId, 'members.user': memberId },
    {
      $set: { 'members.$.memberRole': memberRole },
    },
    { new: true }
  );
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
