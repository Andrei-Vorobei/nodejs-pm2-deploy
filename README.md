# Mesto: production-ready deployment guide

Это monorepo-проект для развёртывания приложения Mesto на удалённый сервер с использованием `pm2`, `Nginx` и production-окружений. Репозиторий содержит две самостоятельные части:

- Frontend: React + Vite
- Backend: Node.js + Express + TypeScript + MongoDB

Цель проекта — обеспечить безопасный, воспроизводимый и автоматизированный деплой фронтенда и API без ручного копирования файлов и ручного перезапуска процессов.

## 1. Архитектура проекта

```text
.
├── README.md
├── backend/
│   ├── ecosystem.config.js
│   ├── package.json
│   ├── scripts/
│   │   └── deployEnv.sh
│   ├── src/
│   └── tsconfig.json
├── frontend/
│   ├── ecosystem.config.cjs
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   ├── public/
│   └── vite.config.js
└── tsconfig.json
```

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT
- Celebrate/Joi
- Winston
- CORS, cookie-parser, dotenv

### Frontend

- React 19
- Vite
- React Router DOM
- Vitest + Testing Library
- production bundle для статической отдачи через Nginx

---

## 2. Production-ready требования

Для продакшн-деплоя нужны:

- Linux-сервер (Ubuntu/Debian)
- Node.js 20+
- npm
- MongoDB
- PM2
- Nginx
- SSH-доступ
- домены или публичный IP
- HTTPS через Let's Encrypt

---

## 3. Переменные окружения

### Backend

Файл `backend/.env`:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mestodb
JWT_KEY=replace-with-a-long-random-secret
CORS_ORIGIN=https://site.ru,https://www.site.ru,https://api.site.ru
```

### Frontend

Файл `frontend/.env`:

```env
VITE_API_URL=https://api.site.ru
```

Для локальной разработки:

```env
VITE_API_URL=http://localhost:3000
```

### Deploy-параметры

Файл `.env.deploy`:

```env
DEPLOY_USER=deploy
DEPLOY_HOST=your-server-host
DEPLOY_PATH=/var/www/mesto
DEPLOY_REF=origin/main
DEPLOY_REPO=git@github.com:your-user/your-repo.git
```

> Важно: секреты и production-параметры не должны храниться в Git.

---

## 4. Методика деплоя

### Этап 1. Подготовка сервера

```bash
sudo apt update
sudo apt install -y git nginx curl certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Создайте пользователя для деплоя:

```bash
sudo useradd -m -s /bin/bash deploy
sudo mkdir -p /var/www/mesto
sudo chown deploy:deploy /var/www/mesto
```

### Этап 2. Настройка MongoDB

Убедитесь, что MongoDB запущена и доступна по адресу:

```bash
mongodb://127.0.0.1:27017/mestodb
```

Проверка подключения:

```bash
mongosh "mongodb://127.0.0.1:27017/mestodb"
```

### Этап 3. Настройка SSH и доступа к репозиторию

На сервере создайте SSH-ключ:

```bash
ssh-keygen -t ed25519 -C "deploy@server"
```

Добавьте публичный ключ в GitHub/GitLab и убедитесь, что `git clone` работает без пароля.

### Этап 4. Подготовка env-файлов на сервере

Для backend создайте файл:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mestodb
JWT_KEY=very-strong-secret
CORS_ORIGIN=https://site.ru,https://api.site.ru
```

Для frontend создайте файл:

```env
VITE_API_URL=https://api.site.ru
```

### Этап 5. Запуск backend через PM2

На сервере:

```bash
cd /var/www/mesto/current/backend
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Проверка статуса:

```bash
pm2 list
curl http://127.0.0.1:3000/health
```

### Этап 6. Сборка frontend

```bash
cd /var/www/mesto/current/frontend
npm ci
npm run build
```

После сборки статические файлы находятся в папке `frontend/dist`.

### Этап 7. Настройка Nginx

Frontend:

```nginx
server {
    listen 80;
    server_name site.ru www.site.ru;

    root /var/www/mesto/current/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

API:

```nginx
server {
    listen 80;
    server_name api.site.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Проверка:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Этап 8. HTTPS

```bash
sudo certbot --nginx -d site.ru -d www.site.ru
sudo certbot --nginx -d api.site.ru
```

### Этап 9. Deploy с помощью PM2

Локально:

```bash
cd backend
pm2 deploy production setup
pm2 deploy production
```

Для frontend также работает отдельная конфигурация `frontend/ecosystem.config.cjs`.

---

## 5. Production checklist

Перед запуском в продакшн обязательно проверьте:

- [ ] backend запускается через PM2
- [ ] frontend собирается без ошибок `npm run build`
- [ ] MongoDB доступна с сервера
- [ ] `JWT_KEY` длинный и уникальный
- [ ] `CORS_ORIGIN` настроен корректно
- [ ] `VITE_API_URL` указывает на production API
- [ ] Nginx отдаёт frontend и проксирует API
- [ ] HTTPS активен
- [ ] есть `/health` endpoint у backend
- [ ] есть graceful shutdown для MongoDB
- [ ] секреты не хранятся в Git

---

## 6. Production-ready рекомендации

Даже после базового деплоя стоит добавить:

- health-check endpoint
- graceful shutdown для MongoDB
- логирование запросов и ошибок
- резервное копирование базы данных
- CI/CD для сборки и деплоя
- rate limiting и ограничения payload
- отдельные окружения `staging` и `production`
- SSL/TLS и безопасные заголовки через Nginx

---

## 7. Итог

Проект уже имеет базовую структуру для автоматизированного деплоя, но до полного production-ready состояния нужно:

1. вынести все секреты и адреса в env
2. настроить Nginx + HTTPS
3. запускать backend через PM2 и проверять health-check
4. собирать frontend в production bundle и отдавать его через статический сервер

Это даёт воспроизводимый и безопасный сценарий развёртывания Mesto на VPS или облачном сервере.

---

## 8. Полезные команды

```bash
# локально
npm install
npm run build

# на сервере
pm2 list
pm2 logs mesto-api
pm2 restart mesto-api

# nginx
sudo nginx -t
sudo systemctl reload nginx
```
