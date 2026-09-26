# Бэкенд Mesto: production-ready deployment guide

Это REST API проекта Mesto. Сервер отвечает за регистрацию, логин, работу с профилем, карточками и лайками. Приложение работает на Express + TypeScript и хранит данные в MongoDB через Mongoose.

## 1. Стек

- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT
- bcryptjs
- Celebrate/Joi
- Winston
- CORS, cookie-parser, dotenv

## 2. Основные функции API

- `POST /signup` — регистрация
- `POST /signin` — логин
- `GET /users` — список пользователей
- `GET /users/me` — текущий пользователь
- `GET /users/:userId` — пользователь по ID
- `PATCH /users/me` — обновление профиля
- `GET /cards` — список карточек
- `POST /cards` — создание карточки
- `DELETE /cards/:cardId` — удаление карточки
- `PUT /cards/:cardId/likes` — лайк
- `DELETE /cards/:cardId/likes` — снятие лайка

## 3. Требования

- Node.js 20+
- MongoDB
- PM2 для production
- доступ к серверу и SSH

## 4. Локальный запуск

### Установка

```bash
npm install
```

### Скрипты

```bash
npm run dev
npm start
npm run build
npm run lint
```

Что они делают:

- `npm run dev` — запуск в development режиме через `ts-node-dev`
- `npm start` — запуск напрямую через `ts-node`
- `npm run build` — сборка TypeScript в `dist`
- `npm run lint` — проверка ESLint

## 5. Переменные окружения

Файл `.env`:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mestodb
JWT_KEY=replace-with-a-long-random-secret
CORS_ORIGIN=https://site.ru,https://www.site.ru,https://api.site.ru
```

## 6. Авторизация

API использует JWT в заголовке:

```http
Authorization: Bearer <token>
```

При логине и регистрации сервер может также выставлять cookie, но основной сценарий авторизации должен работать через заголовок `Authorization`.

## 7. Production deployment methodology

### Шаг 1. Подготовка сервера

```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### Шаг 2. Подготовка env

Сгенерируйте `.env` на сервере с реальными значениями:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mestodb
JWT_KEY=very-strong-secret
CORS_ORIGIN=https://site.ru
```

### Шаг 3. Запуск backend

На сервере:

```bash
cd /var/www/mesto/current/backend
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
```

### Шаг 4. Health check

Backend должен иметь endpoint `/health`, чтобы проверять доступность сервиса:

```ts
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

### Шаг 5. Graceful shutdown

Для production важно завершать процесс корректно:

```ts
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.disconnect();
  process.exit(0);
});
```

### Шаг 6. PM2 deploy

Конфигурация деплоя находится в `backend/ecosystem.config.js`.

После загрузки кода выполняется:

```bash
cd backend && npm ci && npm run build && pm2 startOrRestart ecosystem.config.js --env production
```

## 8. Структура исходников

```text
src/
├── app.ts
├── constants/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── types/
├── validators/
└── utils/
```

## 9. Наблюдаемость и логирование

- `requestLogger` — логи входящих запросов
- `errorLogger` — логи ошибок
- `request.log` и `error.log` должны храниться вне Git

## 10. Production checklist

- [ ] MongoDB доступна с сервера
- [ ] `JWT_KEY` установлен и достаточной длины
- [ ] CORS настроен под домены production
- [ ] backend запускается через PM2
- [ ] есть `/health` endpoint
- [ ] есть graceful shutdown
- [ ] нет секретов в git
- [ ] deploy процесс автоматизирован

## 11. Рекомендации

Для действительно production-ready окружения стоит добавить:

- отдельные `staging` и `production` окружения
- CI/CD для проверки сборки и деплоя
- резервное копирование MongoDB
- централизованный сбор логов
- ограничения на rate limit и body size
- HTTPS через Nginx/Certbot

