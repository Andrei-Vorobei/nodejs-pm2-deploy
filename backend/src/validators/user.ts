import { celebrate, Joi } from 'celebrate';

import { AVATAR_PATTERN, PASSWORD_PATTERN } from '../constants/constants';

export const userUpdateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(AVATAR_PATTERN),
  }),
});

export const userAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(AVATAR_PATTERN).required(),
  }),
});

export const userAuthValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(30)
      .pattern(PASSWORD_PATTERN),
  }),
});
