import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders headline', () => {
    render(<App />);
    expect(screen.getByText('Hello Vite + React 19!')).toBeTruthy();
  });
});
