/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import SignUp from './SignUp';

const mockStore = configureStore([]);

describe('User Profile Page Test', () => {
  let store;
  let component = null;

  beforeEach(() => {
    store = mockStore({
      username: 'lasya',
      useremail: 'lasya@sjsu.com',
    });
  });

  component = renderer.create(
    <Provider store={store}>
      <SignUp />
    </Provider>,
  );
  test('renders User Profile page', async () => {
    const { container, debug } = component;
    const stringInput = screen.getByPlaceholderText('Username');
    expect(stringInput).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText('useremail@example.com');
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
    const button = screen.getByText('Sign Me Up!');
    expect(button).toBeInTheDocument();
  });

  it('should render with given state from Redux store', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should dispatch an action on button click', () => {

  });
});
