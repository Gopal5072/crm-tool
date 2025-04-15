// __tests__/LoginPage.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../app/login/page';

test('renders login form correctly', () => {
  render(<LoginPage />);

  // Check if the form inputs and buttons are rendered
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('displays error message on failed login', async () => {
  render(<LoginPage />);

  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
  fireEvent.click(screen.getByText('Login'));

  // Wait for the error message
  const errorMessage = await screen.findByText('Invalid credentials');
  expect(errorMessage).toBeInTheDocument();
});
