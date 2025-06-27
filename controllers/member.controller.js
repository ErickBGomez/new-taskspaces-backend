import { MemberNotFoundError } from '../errors/member.error.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import {
  InvalidMemberRoleError,
  WorkspaceNotFoundError,
} from '../errors/workspace.errors.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import * as memberService from '../services/member.service.js';

export const getMemberRoleByWorkspaceId = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { id: userId } = req.user;

    const memberRole = await memberService.findMemberRoleByWorkspaceId(
      workspaceId,
      userId
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member role found')
          .setContent({ memberRole })
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof InvalidMemberRoleError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Invalid member role')
            .setError(error.message)
            .build()
        );

    if (error instanceof MemberNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Member not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const getMemberRoleByProjectId = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { id: userId } = req.user;

    const memberRole = await memberService.findMemberRoleByProjectId(
      projectId,
      userId
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member role found')
          .setContent({ memberRole })
          .build()
      );
  } catch (error) {
    if (error instanceof ProjectNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Project not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof InvalidMemberRoleError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Invalid member role')
            .setError(error.message)
            .build()
        );

    if (error instanceof MemberNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Member not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const getMemberRoleByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { id: userId } = req.user;

    const memberRole = await memberService.findMemberRoleByTaskId(
      taskId,
      userId
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member role found')
          .setContent({ memberRole })
          .build()
      );
  } catch (error) {
    if (error instanceof TaskNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Task not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof InvalidMemberRoleError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Invalid member role')
            .setError(error.message)
            .build()
        );

    if (error instanceof MemberNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Member not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};
