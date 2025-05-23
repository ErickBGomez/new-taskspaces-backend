import prisma from '../utils/prisma.js';
import { MEMBER_ROLE_STRING_TO_INT } from '../utils/workspace.utils.js';

export const findAllWorkspaces = async () => {
  return await prisma.workspace.findMany({
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const findWorkspaceById = async (id) => {
  return await prisma.workspace.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const findWorkspaceByTitle = async (title, userId) => {
  return await prisma.workspace.findFirst({
    where: {
      title,
      owner_id: parseInt(userId),
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const findWorkspacesByOwnerId = async (ownerId) => {
  return await prisma.workspace.findMany({
    where: {
      owner_id: parseInt(ownerId),
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const createWorkspace = async (workspace) => {
  return await prisma.workspace.create({
    data: {
      title: workspace.title,
      owner_id: parseInt(workspace.owner),
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const updateWorkspace = async (id, workspace) => {
  return await prisma.workspace.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title: workspace.title,
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const deleteWorkspace = async (id) => {
  return await prisma.workspace.delete({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });
};

// Members
export const findMembers = async (workspaceId) => {
  const members = await prisma.workspace_member.findMany({
    where: {
      workspace_id: parseInt(workspaceId),
    },
    select: {
      user_app: {
        select: {
          id: true,
          fullname: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      member_role: {
        select: {
          value: true,
        },
      },
    },
  });

  if (!members) return null;

  return members.map((member) => ({
    user: member.user_app,
    member_role: member.member_role.value,
  }));
};

export const findMember = async (workspaceId, memberId) => {
  const member = await prisma.workspace_member.findFirst({
    where: {
      workspace_id_user_id: {
        workspace_id: parseInt(workspaceId),
        user_id: parseInt(memberId),
      },
    },
    select: {
      user_app: {
        select: {
          id: true,
          fullname: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      member_role: {
        select: {
          value: true,
        },
      },
    },
  });

  if (!member) return null;

  return {
    user: member.user_app,
    member_role: member.member_role.value,
  };
};

export const inviteMember = async (workspaceId, memberId, memberRole) => {
  const invitedMember = await prisma.workspace_member.create({
    data: {
      workspace_id: parseInt(workspaceId),
      user_id: parseInt(memberId),
      member_role_id: MEMBER_ROLE_STRING_TO_INT[memberRole] || 1, // Default to READER if role is not recognized
    },
    select: {
      user_app: {
        select: {
          id: true,
          fullname: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      member_role: {
        select: {
          value: true,
        },
      },
    },
  });

  if (!invitedMember) return null;

  return {
    user: invitedMember.user_app,
    member_role: invitedMember.member_role.value,
  };
};

export const updateMember = async (workspaceId, memberId, memberRole) => {
  const updatedMember = await prisma.workspace_member.update({
    where: {
      workspace_id_user_id: {
        workspace_id: parseInt(workspaceId),
        user_id: parseInt(memberId),
      },
    },
    data: {
      member_role_id: MEMBER_ROLE_STRING_TO_INT[memberRole] || 1, // Default to READER if role is not recognized
    },
    select: {
      user_app: {
        select: {
          id: true,
          fullname: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      member_role: {
        select: {
          value: true,
        },
      },
    },
  });

  if (!updatedMember) return null;

  return {
    user: updatedMember.user_app,
    member_role: updatedMember.member_role.value,
  };
};

export const removeMember = async (workspaceId, memberId) => {
  // return await Workspace.findByIdAndUpdate(
  //   workspaceId,
  //   {
  //     $pull: { members: { user: memberId } },
  //   },
  //   { new: true }
  // );

  const removedMember = await prisma.workspace_member.delete({
    where: {
      workspace_id_user_id: {
        workspace_id: parseInt(workspaceId),
        user_id: parseInt(memberId),
      },
    },
    select: {
      user_app: {
        select: {
          id: true,
          fullname: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      member_role: {
        select: {
          value: true,
        },
      },
    },
  });

  if (!removedMember) return null;

  return {
    user: removedMember.user_app,
    member_role: removedMember.member_role.value,
  };
};
