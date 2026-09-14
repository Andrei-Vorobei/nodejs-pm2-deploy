import { Router } from 'express';

import {
  getAllCards, createCard, deleteCardById, likeCard, dislikeCard,
} from '../controllers/cards';
import {
  getAllUsers, getUserById, updateUserById, updateUserAvatar, getCurrentUser,
} from '../controllers/users';
import { userUpdateValidator, userAvatarValidator } from '../validators/user';
import { cardValidator } from '../validators/card';

const router = Router();

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

router.get('/cards', getAllCards);

router.post('/cards', cardValidator, createCard);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me', userUpdateValidator, updateUserById);

router.patch('/users/me/avatar', userAvatarValidator, updateUserAvatar);

export default router;
