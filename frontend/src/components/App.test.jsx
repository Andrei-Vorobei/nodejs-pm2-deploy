import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('redirects to /signin when the user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  describe('with a token stored from a previous session (page refresh)', () => {
    const mockUser = {
      _id: '507f191e810c19729de860ea',
      name: 'Тестовый пользователь',
      about: 'Наблюдатель',
      avatar: 'https://example.com/avatar.png',
      email: 'user@example.com',
    };

    beforeEach(() => {
      localStorage.setItem('jwt', 'valid-token');
      vi.stubGlobal('fetch', vi.fn((url) => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(
          url.endsWith('/cards') ? { data: [] } : { data: mockUser },
        ),
      })));
    });

    afterEach(() => {
      localStorage.clear();
      vi.unstubAllGlobals();
    });

    it('restores the session instead of redirecting to /signin', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText(mockUser.email)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /войти/i })).not.toBeInTheDocument();
      });
    });
  });
});
