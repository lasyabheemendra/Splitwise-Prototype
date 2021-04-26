import React from 'react';

import PropTypes from 'prop-types';

// create the Navbar Component
function NavigationBar({ showLogin, showSignup }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div>
          <img
            src="sw-wide.png"
            width="200"
            height="100"
            className="navbar-brand"
            alt="Splitwise"
          />
        </div>

        <div className=" col-sm-10 text-right" id="navbarSupportedContent">
          {showLogin && (
          <a href="/login">
            <button
              type="button"
              id="login"
              className="btn btn-success mr-2"
              Style="width: 100px;"
            >
              Login
            </button>
          </a>
          )}

          {showSignup && (
          <a href="/signup">
            <button
              type="button"
              id="signup"
              className="btn btn-success"
              Style="width: 100px;"
            >
              Sign Up
            </button>
          </a>
          )}

        </div>
      </nav>

    </div>
  );
}

NavigationBar.propTypes = {
  showLogin: PropTypes.bool.isRequired,
  showSignup: PropTypes.bool.isRequired,
};

export default NavigationBar;
