# Фронтенд Mesto: production-ready deployment guide

Это клиентская часть проекта Mesto. Приложение построено на React и Vite и отвечает за интерфейс авторизации, управление карточками, редактирование профиля и работу с API бэкенда.

## 1. Стек

- React 19
- Vite
- React Router DOM
- Vitest + Testing Library
- CSS-стили для UI-компонентов

## 2. Основные возможности

- регистрация и вход
- просмотр карточек
- добавление, лайки и удаление карточек
- редактирование профиля и аватара
- защищённые маршруты через `ProtectedRoute`

## 3. Локальный запуск

### Требования

- Node.js 20+
- npm

### Установка

```bash
npm install
```

### Команды

```bash
npm run dev
npm run build
npm run preview
npm run test
```

Что делают команды:

- `npm run dev` — запуск dev-сервера Vite
- `npm run build` — production сборка
- `npm run preview` — локальный просмотр собранного приложения
- `npm run test` — запуск тестов

## 4. Настройка окружения

В проекте адрес API должен передаваться через переменную окружения Vite:

```env
VITE_API_URL=https://api.site.ru
```

Для локальной разработки:

```env
VITE_API_URL=http://localhost:3000
```

В коде это используется следующим образом:

```js
const api = new Api(import.meta.env.VITE_API_URL || 'http://localhost:3000');
```

## 5. Production deployment methodology

### Шаг 1. Установка зависимостей

```bash
npm ci
```

### Шаг 2. Сборка production bundle

```bash
npm run build
```

После этого в папке `dist` появляется готовый набор статических файлов для публикации.

### Шаг 3. Отдача через Nginx

Подключите фронтенд к Nginx:

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

### Шаг 4. Настройка HTTPS

```bash
sudo certbot --nginx -d site.ru -d www.site.ru
```

### Шаг 5. Деплой через PM2

Для фронтенда используется отдельная конфигурация `frontend/ecosystem.config.cjs`.

После загрузки кода на сервер выполняется:

```bash
cd frontend && npm ci && npm run build
```

Промежуточный deploy-штрих — подготовить `.env.deploy`, чтобы `pm2 deploy` знал данные сервера и репозитория.

## 6. Архитектура клиента

Основные директории:

- `src/components` — UI-компоненты
- `src/contexts` — контекст пользователя
- `src/utils` — клиентский API слой
- `src/images` — изображения
- `src/vendor` — шрифты и стили библиотек

## 7. Важные продакшен замечания

- адрес API нельзя жёстко кодировать в исходниках
- JWT хранится в `localStorage`, что подходит для учебного проекта, но для production лучше оценивать иные стратегии хранения токенов
- требуется проверка доменов CORS на сервере
- production-сборка должна быть протестирована до публикации

## 8. Production checklist

- [ ] `VITE_API_URL` настроен правильно
- [ ] frontend собирается без ошибок
- [ ] Nginx отдаёт статические файлы
- [ ] HTTPS активен
- [ ] API-домен доступен и корректно настроен
- [ ] сборка деплоится автоматически

## 9. Рекомендации

Для более стабильного продакшна стоит:

- вынести адрес API в секретный env-файл
- добавить проверку окружения при старте
- настроить CI/CD
- включить smoke-тест после сборки
- настроить отдельные окружения для staging и production


