import { Request, Response, NextFunction } from 'express';

import { errorMessages } from '../constants/constants';

export class ServerError extends Error {
  statusCode: number = 500;

  constructor(message: string) {
    super(message);

    switch (message) {
      case errorMessages.updateAvatarError:
      case errorMessages.createCardDataError:
      case errorMessages.updateCardDataError:
      case errorMessages.deleteCardDataError:
      case errorMessages.updateProfileDataError:
      case errorMessages.getUserDataError:
      case errorMessages.createUserDataError:
        this.statusCode = 400;
        break;
      case errorMessages.authorizationRequired:
      case errorMessages.authorizationError:
      case errorMessages.invalidEmailOrPassword:
        this.statusCode = 401;
        break;
      case errorMessages.forbiddenDeleteCard:
        this.statusCode = 403;
        break;
      case errorMessages.cardNotFound:
      case errorMessages.userNotFound:
        this.statusCode = 404;
        break;
      case errorMessages.userAlreadyExists:
        this.statusCode = 409;
        break;
      default:
        this.statusCode = 500;
    }
  }
}

export const errorMiddleware = (
  err: ServerError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new ServerError(err.message);
  res.status(error.statusCode).json({ message: err.message });
  next();
};
