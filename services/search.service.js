import * as searchRepository from '../repositories/search.repository.js';

export const searchAll = async (query, isAdmin, userId) => {
  if (!query)
    return {
      workspaces: [],
      projects: [],
      tasks: [],
      users: [],
    };

  return await searchRepository.searchAll(query, isAdmin, userId);
};

export const searchWorkspaces = async (query, isAdmin, userId) => {
  if (!query) return [];

  return await searchRepository.searchWorkspaces(query, isAdmin, userId);
};

export const searchProjects = async (query, isAdmin, userId) => {
  if (!query) return [];

  return await searchRepository.searchProjects(query, isAdmin, userId);
};

export const searchTasks = async (query, isAdmin, userId) => {
  if (!query) return [];

  return await searchRepository.searchTasks(query, isAdmin, userId);
};

export const searchUsers = async (query) => {
  if (!query) return [];

  return await searchRepository.searchUsers(query);
};
