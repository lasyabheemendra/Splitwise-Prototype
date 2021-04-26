/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import recentActivity from './RecentActivities';

const mockStore = configureStore([]);

describe('Recent Activity  Page Test', () => {
  test('Recent Activitypage', async () => {
    expect(screen.getByText('Sort By:')).toBeInTheDocument();
    fireEvent.click(screen.getByText('most recent first'));
    fireEvent.click(screen.getByText('most recent last'));
    expect(screen.getByText('Sort By:')).toBeInTheDocument();
  });

  it('should render with given state from Redux store', () => {
  });

  it('should dispatch an action on button click', () => {

  });
});
