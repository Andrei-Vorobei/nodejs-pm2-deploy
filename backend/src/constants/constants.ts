/* eslint-disable no-useless-escape */
export const AVATAR_PATTERN = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]*)?#?$/;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export const errorMessages = {
  updateAvatarError: 'Переданы некорректные данные при обновлении аватара',
  createCardDataError: 'Переданы некорректные данные при создании карточки',
  updateCardDataError: 'Переданы некорректные данные при обновлении карточки',
  deleteCardDataError: 'Переданы некорректные данные при удалении карточки',
  updateProfileDataError: 'Переданы некорректные данные при обновлении профиля',
  getUserDataError: 'Переданы некорректные данные при получении пользователя',
  createUserDataError: 'Переданы некорректные данные при создании пользователя',
  authorizationRequired: 'Необходима авторизация',
  authorizationError: 'Ошибка авторизации',
  invalidEmailOrPassword: 'Неправильные почта или пароль',
  forbiddenDeleteCard: 'Нет прав для удаления карточки',
  cardNotFound: 'Карточка не найдена',
  userNotFound: 'Пользователь не найден',
  userAlreadyExists: 'Такой пользователь уже существует',
};
