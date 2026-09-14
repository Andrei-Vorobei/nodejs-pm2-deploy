import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoPath from '../images/logo.svg';

function Header({ onSignOut, email }) {
  const location = useLocation();

  function handleSignOut() {
    onSignOut();
  }

  return (
    <header className="header page__section">
      <img src={logoPath} alt="Логотип проекта Mesto" className="logo header__logo" />
      {location.pathname === '/' && (
        <div className="header__wrapper">
          <p className="header__user">{email}</p>
          <button type="button" className="header__logout" onClick={handleSignOut}>Выйти</button>
        </div>
      )}
      {location.pathname === '/signup' && (
        <Link className="header__auth-link" to="/signin">Войти</Link>
      )}
      {location.pathname === '/signin' && (
        <Link className="header__auth-link" to="/signup">Регистрация</Link>
      )}
    </header>
  );
}

export default Header;
