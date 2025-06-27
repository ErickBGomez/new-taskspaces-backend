import { MemberNotFoundError } from '../errors/member.error.js';
import * as memberRepository from '../repositories/member.repository.js';

export const findMemberRoleByWorkspaceId = async (workspaceId, userId) => {
  const memberRole = await memberRepository.getMemberRoleByWorkspaceId(
    workspaceId,
    userId
  );

  if (!memberRole) {
    throw new MemberNotFoundError();
  }

  return memberRole;
};

export const findMemberRoleByProjectId = async (projectId, userId) => {
  const memberRole = await memberRepository.getMemberRoleByProjectId(
    projectId,
    userId
  );

  if (!memberRole) {
    throw new MemberNotFoundError();
  }

  return memberRole;
};

export const findMemberRoleByTaskId = async (taskId, userId) => {
  const memberRole = await memberRepository.getMemberRoleByTaskId(
    taskId,
    userId
  );

  if (!memberRole) {
    throw new MemberNotFoundError();
  }

  return memberRole;
};
