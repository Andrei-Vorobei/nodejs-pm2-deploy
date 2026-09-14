import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MongoServerError } from 'mongodb';

import User from '../models/user';
import type { SessionRequest } from '../types/types';
import { errorMessages } from '../constants/constants';

const { JWT_KEY = '' } = process.env;

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    if (!users) {
      throw new Error(errorMessages.userNotFound);
    }
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.userId) {
      throw new Error(errorMessages.getUserDataError);
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new Error(errorMessages.userNotFound);
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new Error(errorMessages.userNotFound);
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, email } = req.body;
    if (!password || !email) {
      throw new Error(errorMessages.createUserDataError);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ password: passwordHash, email });
    const token = jwt.sign({ _id: newUser._id }, JWT_KEY, { expiresIn: '7d' });
    res.status(201).json({
      token,
      data: {
        email: newUser.email,
        message: 'Пользователь успешно создан',
      },
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      next(new Error(errorMessages.userAlreadyExists));
      return;
    }

    next(error);
  }
};

export const updateUserById = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    if (name === undefined && about === undefined && avatar === undefined) {
      throw new Error(errorMessages.updateProfileDataError);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about, avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new Error(errorMessages.userNotFound);
    }
    res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    if (avatar === undefined) {
      throw new Error(errorMessages.updateAvatarError);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new Error(errorMessages.userNotFound);
    }
    res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error(errorMessages.invalidEmailOrPassword);
    }
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      throw new Error(errorMessages.invalidEmailOrPassword);
    }
    const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
    res.status(200).json({
      token,
      message: 'Угадал',
    });
  } catch (error) {
    next(error);
  }
};
