import * as projectService from '../services/project.service.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';

const taskRolesMiddleware = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { id: userId } = req.user;

    const role = await projectService.getRoleFromProject(projectId, userId);

    if (role === 'reader') {
      return res
        .status(403)
        .json(
          new ErrorResponseBuilder()
            .setStatus(403)
            .setMessage('Forbidden')
            .setError('You do not have permission to modify this task')
            .build()
        );
    }
  } catch (e) {
    return res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(e.message)
          .build()
      );
  }

  next();
};

export default taskRolesMiddleware;
