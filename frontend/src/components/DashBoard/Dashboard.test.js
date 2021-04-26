/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';
import store from '../../store/index';

const mockStore = configureStore([]);

describe('User Profile Page Test', () => {
  test('renders User Profile page', async () => {
    const stringInput = screen.getByText('total balance:');
    expect(stringInput).toBeInTheDocument();
    const stringInput1 = screen.getByText('you owe:');
    expect(stringInput1).toBeInTheDocument();
    const stringInput2 = screen.getByText('you are owed:');
    expect(stringInput2).toBeInTheDocument();
    const stringInput3 = screen.getByText('You do not owe anything');
    expect(stringInput3).toBeInTheDocument();
    const stringInput4 = screen.getByText('You are not owed anything');
    expect(stringInput4).toBeInTheDocument();
  });

  it('should render with given state from Redux store', () => {
  });

  it('should dispatch an action on button click', () => {

  });
});
