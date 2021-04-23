/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Pagination = ({ activitiesPerPage, allActivity, paginate }) => {
  const pageNumbers = [];

  console.log('allActivity', allActivity);
  console.log('activitiesPerPage', activitiesPerPage);
  for (let i = 1; i <= Math.ceil(allActivity / activitiesPerPage); i += 1) {
    pageNumbers.push(i);
  }

  console.log('pageNumbers', pageNumbers);

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <Link onClick={() => paginate(number)} href="/recentactivity" className="page-link">
              {number}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  activitiesPerPage: PropTypes.string.isRequired,
  allActivity: PropTypes.string.isRequired,
  paginate: PropTypes.func.isRequired,
};

export default Pagination;
