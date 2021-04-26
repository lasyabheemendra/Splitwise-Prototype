/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import group from './newGroup';
import App from '../../App';

const mockStore = configureStore([]);

describe('New Group Page Test', () => {
  test('New Group Profile page', async () => {
    const { getByPlaceholderText, getByText } = render(<group />);
    const stringInput = screen.getByid('Group_Name');
    expect(stringInput).toBeInTheDocument();
    const stringInput1 = screen.getByPlaceholderText('Name');
    expect(stringInput1).toBeInTheDocument();
    const button = screen.getByText('Create Group');
    expect(button).toBeInTheDocument();
  });

  it('should render with given state from Redux store', () => {
  });

  it('should dispatch an action on button click', () => {

  });
});
