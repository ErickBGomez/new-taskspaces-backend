import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import { ROLES } from '../middlewares/authorize-roles.middleware.js';
import * as searchService from '../services/search.service.js';

export const searchAll = async (req, res, next) => {
  try {
    const { query, model } = req.query;
    const { role, id: userId } = req.user;

    const isAdmin = ROLES[role] === ROLES.SYSADMIN;

    let results;

    switch (model) {
      case 'workspaces': {
        results = await searchService.searchWorkspaces(query, isAdmin, userId);
        break;
      }

      case 'projects': {
        results = await searchService.searchProjects(query, isAdmin, userId);
        break;
      }

      case 'tasks': {
        results = await searchService.searchTasks(query, isAdmin, userId);
        break;
      }

      case 'users': {
        results = await searchService.searchUsers(query);
        break;
      }

      default: {
        results = await searchService.searchAll(query, isAdmin, userId);
      }
    }

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Search results found')
          .setContent(results)
          .build()
      );
  } catch (error) {
    next(error);
  }
};
