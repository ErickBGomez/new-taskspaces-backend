import * as userService from '../services/user.service.js';
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  IncorrectCredentialsError,
  PasswordDoNotMatchError,
} from '../errors/user.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { ROLES } from '../middlewares/authorize-roles.middleware.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers();

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Users retrieved')
          .setContent(users)
          .build()
      );
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resultUser = await userService.findUserById(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('User retrieved')
          .setContent(resultUser)
          .build()
      );
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(new UserNotFoundError().message)
            .build()
        );

    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { fullname, username, avatar, email, password, confirmPassword } =
      req.body;

    const registeredUser = await userService.registerUser({
      fullname,
      username,
      avatar,
      email,
      password,
      confirmPassword,
    });
    res
      .status(201)
      .json(
        new SuccessResponseBuilder()
          .setStatus(201)
          .setMessage('User created')
          .setContent(registeredUser)
          .build()
      );
  } catch (error) {
    if (error instanceof PasswordDoNotMatchError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Passwords do not match')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserAlreadyExistsError)
      return res.status(409).json(
        new ErrorResponseBuilder()
          .setStatus(409)
          .setMessage('User already exists')
          .setError(error.error) // Bring validation errors as array to use them in the frontend
          .build()
      );

    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    // TODO: Login with email OR username
    const { email, password } = req.body;

    const { user, token } = await userService.loginUser({ email, password });

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Login successfully')
          .setContent({ user, token })
          .build()
      );
  } catch (error) {
    if (error instanceof IncorrectCredentialsError)
      return res
        .status(401)
        .json(
          new ErrorResponseBuilder()
            .setStatus(401)
            .setMessage('Incorrect credentials')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await userService.requestUpdatePassword(email);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Password reset requested')
          .build()
      );
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(new UserNotFoundError().message)
            .build()
        );

    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const { id } = req.params;
    const { fullname, username, avatar, email } = req.body;

    // User role can update only their own data. Sysadmin can update any user
    if (role !== ROLES.SYSADMIN && userId !== id) throw new UserNotFoundError();

    const updatedUser = await userService.updateUser(id, {
      fullname,
      username,
      avatar,
      email,
    });

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('User updated')
          .setContent(updatedUser)
          .build()
      );
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(new UserNotFoundError().message)
            .build()
        );

    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const { id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // User role can update only their own password. Sysadmin can update any user's password
    if (role !== ROLES.SYSADMIN && userId !== id) throw new UserNotFoundError();

    await userService.updatePassword(id, newPassword, confirmPassword);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Password updated')
          .build()
      );
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(new UserNotFoundError().message)
            .build()
        );

    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const { id } = req.params;

    // User role can delete only their own data. Sysadmin can delete any user
    if (role !== ROLES.SYSADMIN && userId !== id) throw new UserNotFoundError();

    await userService.deleteUser(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('User deleted')
          .build()
      );
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(new UserNotFoundError().message)
            .build()
        );

    next(error);
  }
};
