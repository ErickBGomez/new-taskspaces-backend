import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

// Find all tasks
export const findAllTasks = async () => {
  return await prisma.task.findMany({
    include: {
      assignedUsers: {
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              username: true,
              email: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      status: true,
      project: true,
    },
  });
};

// Find tasks by project ID
export const findTasksByProjectId = async (projectId) => {
  return await prisma.task.findMany({
    where: {
      projectId: parseInt(projectId),
    },
    include: {
      assignedUsers: {
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              username: true,
              email: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      status: true,
    },
  });
};

// Find task by ID
export const findTaskById = async (id) => {
  return await prisma.task.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      assignedUsers: {
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              username: true,
              email: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      status: true,
      project: true,
      comments: {
        include: {
          author: {
            select: {
              id: true,
              fullname: true,
              username: true,
            },
          },
        },
      },
    },
  });
};

// Find task by ID and project ID
export const findTaskByIdAndProjectId = async (id, projectId) => {
  return await prisma.task.findFirst({
    where: {
      id: parseInt(id),
      projectId: parseInt(projectId),
    },
    include: {
      assignedUsers: {
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              username: true,
              email: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      status: true,
    },
  });
};

// Create task
export const createTask = async (taskData) => {
  const { assignedMembers, tags, ...taskFields } = taskData;

  return await prisma.task.create({
    data: {
      ...taskFields,
      projectId: parseInt(taskFields.projectId),
      statusId: taskFields.statusId || 1, // Default to PENDING
      // Handle assigned members
      ...(assignedMembers &&
        assignedMembers.length > 0 && {
          assignedUsers: {
            create: assignedMembers.map((userId) => ({
              userId: parseInt(userId),
            })),
          },
        }),
      // Handle tags
      ...(tags &&
        tags.length > 0 && {
          tags: {
            create: tags.map((tagId) => ({
              tagId: parseInt(tagId),
            })),
          },
        }),
    },
    include: {
      assignedUsers: {
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              username: true,
              email: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      status: true,
    },
  });
};

// Update task
export const updateTask = async (id, taskData) => {
  const { assignedMembers, tags, ...taskFields } = taskData;

  return await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...taskFields,
      ...(taskFields.projectId && {
        projectId: parseInt(taskFields.projectId),
      }),
      ...(taskFields.statusId && { statusId: parseInt(taskFields.statusId) }),
    },
    include: {
      assignedUsers: {
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              username: true,
              email: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      status: true,
    },
  });
};

// Delete task
export const deleteTask = async (id) => {
  return await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
  });
};

// Assign member to task
export const assignMemberToTask = async (taskId, memberId) => {
  return await prisma.taskAssigned.create({
    data: {
      taskId: parseInt(taskId),
      userId: parseInt(memberId),
    },
  });
};

// Unassign member from task
export const unassignMemberToTask = async (taskId, memberId) => {
  return await prisma.taskAssigned.delete({
    where: {
      userId_taskId: {
        userId: parseInt(memberId),
        taskId: parseInt(taskId),
      },
    },
  });
};

// Add tag to task
export const addTagToTask = async (taskId, tagId) => {
  return await prisma.taskTag.create({
    data: {
      taskId: parseInt(taskId),
      tagId: parseInt(tagId),
    },
  });
};

// Remove tag from task
export const removeTagFromTask = async (taskId, tagId) => {
  return await prisma.taskTag.delete({
    where: {
      taskId_tagId: {
        taskId: parseInt(taskId),
        tagId: parseInt(tagId),
      },
    },
  });
};

// Close Prisma connection (call this when your app shuts down)
export const closePrismaConnection = async () => {
  await prisma.$disconnect();
};
