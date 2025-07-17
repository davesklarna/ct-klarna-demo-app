import { render } from '@testing-library/react';
import App from './App';

test('renders root element with App', () => {
  render(<App />);
  const linkElement = document.getElementById('root');
  expect(linkElement).toBeInTheDocument();
});
