/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from './UserProfile';
import store from '../../store/index';

const mockStore = configureStore([]);

describe('User Profile Page Test', () => {
  test('renders User Profile page', async () => {
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
  });

  it('should dispatch an action on button click', () => {

  });
});
