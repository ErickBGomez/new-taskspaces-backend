import * as taskService from '../services/task.service.js';
import {
  InvalidDateTimeFormatError,
  TaskNotFoundError,
} from '../errors/task.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { normalizeDateTime } from '../helpers/datetime.helper.js';

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.findAllTasks();

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tasks found')
          .setContent(tasks)
          .build()
      );
  } catch (error) {
    next(error);
  }
};

export const getTasksByProjectId = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const tasks = await taskService.findTasksByProjectId(projectId);
    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tasks found')
          .setContent(tasks)
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

    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await taskService.findTaskById(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Task found')
          .setContent(task)
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

    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    // In the case of create task, it's necessary to retrieve the projectId
    // because its part of the task schema to have the reference to the project

    const { projectId } = req.params;
    const { title, description, status, deadline, timer } = req.body;

    const parsedDeadline = normalizeDateTime(deadline);

    const task = await taskService.createTask(
      {
        title,
        description,
        status,
        deadline: parsedDeadline,
        timer,
      },
      projectId
    );

    res
      .status(201)
      .json(
        new SuccessResponseBuilder()
          .setStatus(201)
          .setMessage('Task created')
          .setContent(task)
          .build()
      );
  } catch (error) {
    if (error instanceof InvalidDateTimeFormatError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Invalid datetime format')
            .setError(error.message)
            .build()
        );

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

    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    // In the case of update task, it's not necessary to retrieve the projectId
    // because projectId cannot be updated, and the member role has been checked before
    // in checkMemberRoleMiddleware

    // Tags should NOT be included in the update task request
    // This action is being handled from another route (assignTagToTask and unassignTagToTask from Tag module)
    const { id } = req.params;
    const { title, description, status, deadline, timer } = req.body;

    const parsedDeadline = normalizeDateTime(deadline);

    const task = await taskService.updateTask(id, {
      title,
      description,
      status,
      deadline: parsedDeadline,
      timer,
    });

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Task updated')
          .setContent(task)
          .build()
      );
  } catch (error) {
    if (error instanceof InvalidDateTimeFormatError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Invalid datetime format')
            .setError(error.message)
            .build()
        );

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

    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;

    const task = await taskService.deleteTask(id, projectId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Task deleted')
          .setContent(task)
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

    next(error);
  }
};

export const getAssignedMembersByTaskId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const assignedMembers = await taskService.findAssignedMembersByTaskId(id);
    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Assigned members to task found')
          .setContent(assignedMembers)
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

    next(error);
  }
};

export const assignMemberToTask = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    const task = await taskService.assignMemberToTask(id, memberId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member assigned to task')
          .setContent(task)
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

    next(error);
  }
};

export const unassignMemberToTask = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    const task = await taskService.unassignMemberToTask(id, memberId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member unassigned from task')
          .setContent(task)
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

    next(error);
  }
};
