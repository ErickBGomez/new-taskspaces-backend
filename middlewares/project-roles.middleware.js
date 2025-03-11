import * as workspaceService from '../services/workspace.service.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';

const projectRolesMiddleware = async (req, res, next) => {
  const { workspaceId } = req.params;
  const { id: userId } = req.user;

  const role = await workspaceService.getUserRole(workspaceId, userId);

  if (role === 'reader') {
    return res
      .status(403)
      .json(
        new ErrorResponseBuilder()
          .setStatus(403)
          .setMessage('Forbidden')
          .setError('You do not have permission to create this project')
          .build()
      );
  }

  next();
};

export default projectRolesMiddleware;
