import { Request, Response, NextFunction } from 'express';

import Card from '../models/card';
import type { SessionRequest } from '../types/types';

export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      throw new Error('Карточки не найдены');
    }
    res.json({ data: cards });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    if (name === undefined || link === undefined) {
      throw new Error('Переданы некорректные данные при создании карточки');
    }
    const newCard = await Card.create({ name, link, owner: req.user?._id });
    res.status(201).json({ data: newCard });
  } catch (error) {
    next(error);
  }
};

export const deleteCardById = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    if (!req.params.cardId) {
      throw new Error('Переданы некорректные данные при удалении карточки');
    }
    const deletedCard = await Card.deleteOne({ _id: req.params.cardId, owner: user?._id });
    if (deletedCard.deletedCount === 0) {
      throw new Error('Карточка не найдена');
    }
    res.json({ message: 'Карточка успешно удалена', data: deletedCard });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.cardId) {
      throw new Error('Переданы некорректные данные при обновлении карточки');
    }
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );

    if (!updatedCard) {
      throw new Error('Карточка не найдена');
    }
    res.json({ message: 'Карточка успешно лайкнута', data: updatedCard });
  } catch (error) {
    next(error);
  }
};

export const dislikeCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.cardId) {
      throw new Error('Переданы некорректные данные при обновлении карточки');
    }
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );

    if (!updatedCard) {
      throw new Error('Карточка не найдена');
    }

    res.json({ message: 'Лайк с карточки успешно удален', data: updatedCard });
  } catch (error) {
    next(error);
  }
};
