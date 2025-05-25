import * as tagService from '../services/tag.service.js';
import { TagAlreadyAssigned, TagNotFoundError } from '../errors/tag.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { TaskNotFoundError } from '../errors/task.errors.js';

export const getAllTags = async (req, res, next) => {
  try {
    const tags = await tagService.findAllTags();

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tags found')
          .setContent(tags)
          .build()
      );
  } catch (error) {
    next(error);
  }
};

export const getTagsByProjectId = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const tags = await tagService.findTagsByProjectId(projectId);
    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tags found')
          .setContent(tags)
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

export const getTagById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await tagService.findTagById(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tag found')
          .setContent(tag)
          .build()
      );
  } catch (error) {
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

    next(error);
  }
};

export const getTagsByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const tags = await tagService.findTagsByTaskId(taskId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tags found')
          .setContent(tags)
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

export const createTag = async (req, res, next) => {
  try {
    const { title, color } = req.body;
    const { projectId } = req.params;

    const tag = await tagService.createTag(
      {
        title,
        color,
      },
      projectId
    );

    res
      .status(201)
      .json(
        new SuccessResponseBuilder()
          .setStatus(201)
          .setMessage('Tag created')
          .setContent(tag)
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

export const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, color } = req.body;

    const tag = await tagService.updateTag(id, { title, color });

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tag updated')
          .setContent(tag)
          .build()
      );
  } catch (error) {
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

    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    await tagService.deleteTag(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tag deleted')
          .build()
      );
  } catch (error) {
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

    next(error);
  }
};

export const assignTagToTask = async (req, res, next) => {
  try {
    const { id, taskId } = req.params;

    await tagService.assignTagToTask(id, taskId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tag assigned to task')
          .build()
      );
  } catch (error) {
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

    if (error instanceof TagAlreadyAssigned)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Tag already assigned to task')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const unassignTagFromTask = async (req, res, next) => {
  try {
    const { id, taskId } = req.params;

    await tagService.unassignTagFromTask(id, taskId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Tag unassigned from task')
          .build()
      );
  } catch (error) {
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
