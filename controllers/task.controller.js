import * as taskService from '../services/task.service.js';
import * as tagService from '../services/tag.service.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { TagNotFoundError } from '../errors/tag.errors.js';

export const getAllTasks = async (req, res) => {
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
    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const getTasksByProjectId = async (req, res) => {
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

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const getTaskById = async (req, res) => {
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

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const createTask = async (req, res) => {
  try {
    // In the case of create task, it's necessary to retrieve the projectId
    // because its part of the task schema to have the reference to the project

    // tags: Should be an array of tag Ids in it.
    // I was considering of creating the tags here and then assigned them to the task
    // but that action does not belong to this controller and may complicate the logic
    // So, for the client, it should create the tag before somewhere else and then assign it to the task
    const { projectId } = req.params;
    const { title, description, status, tags, date, timer, assignedMembers } =
      req.body;

    // TODO: When a task with tags is created, the new tags are not showing in the created task
    // But it appears after fetching this task from another request
    const task = await taskService.createTask(projectId, {
      title,
      description,
      status,
      // tags,
      date,
      timer,
      assignedMembers,
    });

    if (tags)
      tags.forEach(async (tag) => {
        await tagService.assignTagToTask(tag, task._id.toString());
      });

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

    if (error instanceof TagNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Tag not found')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const updateTask = async (req, res) => {
  try {
    // In the case of update task, it's not necessary to retrieve the projectId
    // because projectId cannot be updated, and the member role has been checked before
    // in checkMemberRoleMiddleware
    const { id } = req.params;
    const { title, description, status, tags, date, timer, assignedMembers } =
      req.body;

    const task = await taskService.updateTask(id, {
      title,
      description,
      status,
      tags,
      date,
      timer,
      assignedMembers,
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

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id, projectId } = req.params;

    await taskService.deleteTask(id, projectId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Task deleted')
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

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};
