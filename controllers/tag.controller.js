import * as tagService from '../services/tag.service.js';
import { TagNotFoundError } from '../errors/tag.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';

export const getAllTags = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tags = await tagService.findAllTags(projectId);
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

export const getTagById = async (req, res) => {
  try {
    const { id, projectId } = req.params;

    const tag = await tagService.findTagById(id, projectId);

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

export const createTag = async (req, res) => {
  try {
    const { title, color } = req.body;
    const { projectId } = req.params;

    const tag = await tagService.createTag(projectId, {
      title,
      color,
    });

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

export const assignTagToTask = async (req, res) => {
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

export const updateTag = async (req, res) => {
  try {
    const { id, projectId } = req.params;
    const { title, color } = req.body;

    const tag = await tagService.updateTag(id, projectId, { title, color });

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

export const deleteTag = async (req, res) => {
  try {
    const { id, projectId } = req.params;

    await tagService.deleteTag(id, projectId);

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
