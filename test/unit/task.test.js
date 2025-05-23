import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// Use jest.mock with a factory function instead of path strings
jest.mock('../../repositories/task.repository.js', () => {
  return {
    findAllTasks: jest.fn(),
    findTasksByProjectId: jest.fn(),
    findTaskById: jest.fn(),
    findTaskByIdAndProjectId: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    assignMemberToTask: jest.fn(),
    unassignMemberToTask: jest.fn(),
  };
});

jest.mock('../../repositories/project.repository.js', () => {
  return {
    findProjectById: jest.fn(),
  };
});

jest.mock('../../helpers/project.helper.js', () => {
  return {
    findWorkspaceIdByProjectId: jest.fn(),
  };
});

jest.mock('../../repositories/workspace.repository.js', () => {
  return {
    findMember: jest.fn(),
  };
});

// Import your mocks after you've defined them
import * as taskRepository from '../../repositories/task.repository.js';
import * as projectRepository from '../../repositories/project.repository.js';
import * as projectHelper from '../../helpers/project.helper.js';
import * as workspaceRepository from '../../repositories/workspace.repository.js';

describe('Task Service Tests', () => {
  // Sample data for tests
  const mockProjectId = new mongoose.Types.ObjectId();
  const mockTaskId = new mongoose.Types.ObjectId();
  const mockMemberId = new mongoose.Types.ObjectId();
  const mockWorkspaceId = new mongoose.Types.ObjectId();

  const mockTask = {
    _id: mockTaskId,
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    date: '2025-05-22',
    timer: 0,
    assignedMembers: [],
    project: mockProjectId,
  };

  const mockProject = {
    _id: mockProjectId,
    name: 'Test Project',
  };

  const mockMember = {
    user: { _id: mockMemberId },
    memberRole: 'COLLABORATOR',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllTasks', () => {
    it('should return all tasks', async () => {
      // Arrange
      const mockTasks = [
        mockTask,
        { ...mockTask, _id: new mongoose.Types.ObjectId() },
      ];
      taskRepository.findAllTasks.mockResolvedValue(mockTasks);

      // Act
      const result = await taskService.findAllTasks();

      // Assert
      expect(taskRepository.findAllTasks).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTasks);
      expect(result.length).toBe(2);
    });
  });

  describe('findTasksByProjectId', () => {
    it('should return tasks by project ID when project exists', async () => {
      // Arrange
      projectRepository.findProjectById.mockResolvedValue(mockProject);
      const mockProjectTasks = [mockTask];
      taskRepository.findTasksByProjectId.mockResolvedValue(mockProjectTasks);

      // Act
      const result = await taskService.findTasksByProjectId(mockProjectId);

      // Assert
      expect(projectRepository.findProjectById).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(taskRepository.findTasksByProjectId).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(result).toEqual(mockProjectTasks);
    });

    it('should throw ProjectNotFoundError when project does not exist', async () => {
      // Arrange
      projectRepository.findProjectById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        taskService.findTasksByProjectId(mockProjectId)
      ).rejects.toThrow(ProjectNotFoundError);
      expect(projectRepository.findProjectById).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(taskRepository.findTasksByProjectId).not.toHaveBeenCalled();
    });
  });

  describe('findTaskById', () => {
    it('should return task by ID when task exists', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.findTaskById(mockTaskId);

      // Assert
      expect(taskRepository.findTaskById).toHaveBeenCalledWith(mockTaskId);
      expect(result).toEqual(mockTask);
    });

    it('should throw TaskNotFoundError when task does not exist', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(null);

      // Act & Assert
      await expect(taskService.findTaskById(mockTaskId)).rejects.toThrow(
        TaskNotFoundError
      );
      expect(taskRepository.findTaskById).toHaveBeenCalledWith(mockTaskId);
    });
  });

  describe('createTask', () => {
    const taskData = {
      title: 'New Task',
      description: 'New Description',
      status: 'pending',
      date: '2025-05-22',
      timer: 0,
      assignedMembers: [],
    };

    it('should create task when project exists', async () => {
      // Arrange
      projectRepository.findProjectById.mockResolvedValue(mockProject);
      const newTask = {
        ...mockTask,
        ...taskData,
        _id: new mongoose.Types.ObjectId(),
      };
      taskRepository.createTask.mockResolvedValue(newTask);

      // Act
      const result = await taskService.createTask(mockProjectId, taskData);

      // Assert
      expect(projectRepository.findProjectById).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(taskRepository.createTask).toHaveBeenCalledWith({
        ...taskData,
        project: mockProjectId,
      });
      expect(result).toEqual(newTask);
    });

    it('should throw ProjectNotFoundError when project does not exist', async () => {
      // Arrange
      projectRepository.findProjectById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        taskService.createTask(mockProjectId, taskData)
      ).rejects.toThrow(ProjectNotFoundError);
      expect(projectRepository.findProjectById).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(taskRepository.createTask).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    const updateData = {
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'in-progress',
      date: '2025-05-23',
      timer: 3600,
    };

    it('should update task when task exists', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(mockTask);
      const updatedTask = { ...mockTask, ...updateData };
      taskRepository.updateTask.mockResolvedValue(updatedTask);

      // Act
      const result = await taskService.updateTask(mockTaskId, updateData);

      // Assert
      expect(taskRepository.findTaskById).toHaveBeenCalledWith(mockTaskId);
      expect(taskRepository.updateTask).toHaveBeenCalledWith(
        mockTaskId,
        updateData
      );
      expect(result).toEqual(updatedTask);
    });

    it('should throw TaskNotFoundError when task does not exist', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        taskService.updateTask(mockTaskId, updateData)
      ).rejects.toThrow(TaskNotFoundError);
      expect(taskRepository.findTaskById).toHaveBeenCalledWith(mockTaskId);
      expect(taskRepository.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete task when task exists', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(mockTask);
      taskRepository.deleteTask.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.deleteTask(mockTaskId);

      // Assert
      expect(taskRepository.findTaskById).toHaveBeenCalledWith(mockTaskId);
      expect(taskRepository.deleteTask).toHaveBeenCalledWith(mockTaskId);
      expect(result).toEqual(mockTask);
    });

    it('should throw TaskNotFoundError when task does not exist', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(null);

      // Act & Assert
      await expect(taskService.deleteTask(mockTaskId)).rejects.toThrow(
        TaskNotFoundError
      );
      expect(taskRepository.findTaskById).toHaveBeenCalledWith(mockTaskId);
      expect(taskRepository.deleteTask).not.toHaveBeenCalled();
    });
  });

  describe('assignMemberToTask', () => {
    it('should assign member to task when all conditions are met', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(mockTask);
      projectRepository.findProjectById.mockResolvedValue(mockProject);
      projectHelper.findWorkspaceIdByProjectId.mockResolvedValue(
        mockWorkspaceId
      );
      workspaceRepository.findMember.mockResolvedValue(mockMember);

      const updatedTask = { ...mockTask, assignedMembers: [mockMemberId] };
      taskRepository.assignMemberToTask.mockResolvedValue(updatedTask);

      // Act
      const result = await taskService.assignMemberToTask(
        mockTaskId,
        mockProjectId,
        mockMemberId
      );

      // Assert
      expect(taskRepository.findTaskById).toHaveBeenCalledWith(mockTaskId);
      expect(projectRepository.findProjectById).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(projectHelper.findWorkspaceIdByProjectId).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(workspaceRepository.findMember).toHaveBeenCalledWith(
        mockWorkspaceId.toString(),
        mockMemberId
      );
      expect(taskRepository.assignMemberToTask).toHaveBeenCalledWith(
        mockTaskId,
        mockMemberId
      );
      expect(result).toEqual(updatedTask);
    });

    it('should throw TaskNotFoundError when task does not exist', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        taskService.assignMemberToTask(mockTaskId, mockProjectId, mockMemberId)
      ).rejects.toThrow(TaskNotFoundError);
      expect(taskRepository.assignMemberToTask).not.toHaveBeenCalled();
    });

    it('should throw ProjectNotFoundError when project does not exist', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(mockTask);
      projectRepository.findProjectById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        taskService.assignMemberToTask(mockTaskId, mockProjectId, mockMemberId)
      ).rejects.toThrow(ProjectNotFoundError);
      expect(taskRepository.assignMemberToTask).not.toHaveBeenCalled();
    });

    it('should throw WorkspaceNotFoundError when workspace does not exist', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(mockTask);
      projectRepository.findProjectById.mockResolvedValue(mockProject);
      projectHelper.findWorkspaceIdByProjectId.mockResolvedValue(null);

      // Act & Assert
      await expect(
        taskService.assignMemberToTask(mockTaskId, mockProjectId, mockMemberId)
      ).rejects.toThrow(WorkspaceNotFoundError);
      expect(taskRepository.assignMemberToTask).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundError when member does not exist', async () => {
      // Arrange
      taskRepository.findTaskById.mockResolvedValue(mockTask);
      projectRepository.findProjectById.mockResolvedValue(mockProject);
      projectHelper.findWorkspaceIdByProjectId.mockResolvedValue(
        mockWorkspaceId
      );
      workspaceRepository.findMember.mockResolvedValue(null);

      // Act & Assert
      await expect(
        taskService.assignMemberToTask(mockTaskId, mockProjectId, mockMemberId)
      ).rejects.toThrow(UserNotFoundError);
      expect(taskRepository.assignMemberToTask).not.toHaveBeenCalled();
    });
  });

  describe('unassignMemberToTask', () => {
    it('should unassign member from task when all conditions are met', async () => {
      // Arrange
      const taskWithMember = { ...mockTask, assignedMembers: [mockMemberId] };
      taskRepository.findTaskById.mockResolvedValue(taskWithMember);
      projectRepository.findProjectById.mockResolvedValue(mockProject);
      projectHelper.findWorkspaceIdByProjectId.mockResolvedValue(
        mockWorkspaceId
      );
      workspaceRepository.findMember.mockResolvedValue(mockMember);

      taskRepository.unassignMemberToTask.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.unassignMemberToTask(
        mockTaskId,
        mockProjectId,
        mockMemberId
      );

      // Assert
      expect(taskRepository.findTaskById).toHaveBeenCalledWith(mockTaskId);
      expect(projectRepository.findProjectById).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(projectHelper.findWorkspaceIdByProjectId).toHaveBeenCalledWith(
        mockProjectId
      );
      expect(workspaceRepository.findMember).toHaveBeenCalledWith(
        mockWorkspaceId.toString(),
        mockMemberId
      );
      expect(taskRepository.unassignMemberToTask).toHaveBeenCalledWith(
        mockTaskId,
        mockMemberId
      );
      expect(result).toEqual(mockTask);
    });

    // Similar error tests as in assignMemberToTask
    // ...additional tests omitted for brevity
  });
});

describe('Task Repository Tests', () => {
  // Since we're not actually connecting to MongoDB, we mock the Task model
  const mockTaskObj = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    project: new mongoose.Types.ObjectId(),
    populate: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock static methods on the Task model
    Task.find = jest.fn();
    Task.findById = jest.fn();
    Task.findOne = jest.fn();
    Task.create = jest.fn();
    Task.findByIdAndUpdate = jest.fn();
    Task.findByIdAndDelete = jest.fn();
  });

  describe('findAllTasks', () => {
    it('should call Task.find', async () => {
      // Arrange
      const mockTasks = [mockTaskObj];
      Task.find.mockResolvedValue(mockTasks);

      // Act
      const result = await taskRepository.findAllTasks();

      // Assert
      expect(Task.find).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('findTasksByProjectId', () => {
    it('should call Task.find with project filter and populate assignedMembers', async () => {
      // Arrange
      const mockProjectId = new mongoose.Types.ObjectId();
      const mockTasks = [mockTaskObj];

      const mockFind = {
        populate: jest.fn().mockResolvedValue(mockTasks),
      };

      Task.find.mockReturnValue(mockFind);

      // Act
      const result = await taskRepository.findTasksByProjectId(mockProjectId);

      // Assert
      expect(Task.find).toHaveBeenCalledWith({ project: mockProjectId });
      expect(mockFind.populate).toHaveBeenCalledWith('assignedMembers');
      expect(result).toEqual(mockTasks);
    });
  });

  // Add more tests for other repository methods
  // ...
});
