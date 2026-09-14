// jest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// test.globals is off, so Testing Library's automatic afterEach cleanup
// never registers on its own — without this, DOM from one test leaks into the next.
afterEach(cleanup);
