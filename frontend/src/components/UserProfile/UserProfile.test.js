/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from './UserProfile';

const mockStore = configureStore([]);

describe('User Profile Page Test', () => {
  let store;
  let component = null;

  beforeEach(() => {
    store = mockStore({
      loggedIn: true,
      userID: '1',
      username: 'lasya',
      useremail: 'lasya@sjsu.com',
      phonenumber: '908-909-0987',
      currency: '$',
      timezone: '-08.00',
      language: 'English',
      selectedfile: '',
      description: '',
      profileImage: '',
    });
  });

  component = renderer.create(
    <Provider store={store}>
      <UserProfile />
    </Provider>,
  );

  test('renders User Profile page', async () => {
    const { container, debug } = component;
    const stringInput = screen.getByPlaceholderText('Enter Your Name');
    expect(stringInput).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText('Enter email');
    expect(emailInput).toBeInTheDocument();
    const phoneNumberInput = screen.getByPlaceholderText('Enter Phonenumber');
    expect(phoneNumberInput).toBeInTheDocument();
    const fileInput = screen.getAllByLabelText('Profile Image');
    expect(fileInput).toBeInTheDocument();
    const button = screen.getByText('Update Profile');
    expect(button).toBeInTheDocument();
  });

  it('should render with given state from Redux store', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should dispatch an action on button click', () => {

  });
});
