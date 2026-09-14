const getResponse = (res) => (res.ok ? res.json() : Promise.reject(new Error(`Ошибка: ${res.status}`)));
// Бэкенд оборачивает большинство ответов в { data: ... }, кроме /signup и /signin
const getData = (body) => body.data;

class Api {
  #address;

  #token;

  constructor(address) {
    this.#address = address;
  }

  setToken(token) {
    this.#token = token;
  }

  getAppInfo() {
    return Promise.all([this.getCardList(), this.getUserInfo()]);
  }

  getCardList() {
    return fetch(`${this.#address}/cards`, {
      headers: {
        Authorization: `Bearer ${this.#token}`,
      },
    })
      .then(getResponse)
      .then(getData);
  }

  addCard({ name, link }) {
    return fetch(`${this.#address}/cards`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.#token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        link,
      }),
    })
      .then(getResponse)
      .then(getData);
  }

  removeCard(cardId) {
    return fetch(`${this.#address}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.#token}`,
        'Content-Type': 'application/json',
      },
    }).then(getResponse).then(getData);
  }

  getUserInfo() {
    return fetch(`${this.#address}/users/me`, {
      headers: {
        Authorization: `Bearer ${this.#token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(getResponse)
      .then(getData);
  }

  setUserInfo({ name, about }) {
    return fetch(`${this.#address}/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.#token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then(getResponse)
      .then(getData);
  }

  setUserAvatar({ avatar }) {
    return fetch(`${this.#address}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.#token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar,
      }),
    }).then(getResponse).then(getData);
  }

  changeLikeCardStatus(cardId, like) {
    return fetch(`${this.#address}/cards/${cardId}/likes`, {
      method: like ? 'PUT' : 'DELETE',
      headers: {
        Authorization: `Bearer ${this.#token}`,
        'Content-Type': 'application/json',
      },
    }).then(getResponse).then(getData);
  }

  register(email, password) {
    return fetch(`${this.#address}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(getResponse);
  }

  login(email, password) {
    return fetch(`${this.#address}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(getResponse)
      .then((data) => {
        this.setToken(data.token);
        localStorage.setItem('jwt', data.token);
        return data;
      });
  }

  checkToken(token) {
    return fetch(`${this.#address}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(getResponse)
      .then(getData);
  }
}
// Замените на адрес вашего бэкенда
const api = new Api('https://api.magic-friday.ru');

export default api;
