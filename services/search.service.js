import * as searchRepository from '../repositories/search.repository.js';

export const searchAll = async (query, isAdmin, userId) => {
  return await searchRepository.searchAll(query, isAdmin, userId);
};

export const searchWorkspaces = async (query, isAdmin, userId) => {
  return await searchRepository.searchWorkspaces(query, isAdmin, userId);
};

export const searchProjects = async (query, isAdmin, userId) => {
  return await searchRepository.searchProjects(query, isAdmin, userId);
};

export const searchTasks = async (query, isAdmin, userId) => {
  return await searchRepository.searchTasks(query, isAdmin, userId);
};

export const searchUsers = async (query) => {
  return await searchRepository.searchUsers(query);
};
