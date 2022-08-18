import { render, screen } from '@testing-library/react';
import App from './App';
import { CatProvider, SearchProvider } from './contexts';
import {Sidebar} from './components/Sidebar/Sidebar';
import {CatWindow} from './components/CatWindow/CatWindow';

test('renders Welcome message', () => {
  render(<App />);
  const welcome = screen.getAllByRole("heading");
  expect(welcome[0]).toBeInTheDocument();
});
