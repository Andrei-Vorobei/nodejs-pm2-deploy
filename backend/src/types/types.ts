import { Request } from 'express';

export interface SessionRequest extends Request {
  user?: {
    _id: string;
  };
}
