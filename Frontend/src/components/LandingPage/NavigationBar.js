/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';

// create the Navbar Component
class NavigationBar extends PureComponent {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

    // handle logout to destroy the cookie
    handleLogout = () => {
      cookie.remove('cookie', { path: '/' });
    }

    render() {
      // if Cookie is set render Logout Button
      let navLogin = null;
      const redirectVar = null;
      if (cookie.load('cookie')) {
        console.log('Able to read cookie');
        navLogin = (

          <Link to="/" onClick={this.handleLogout}>
            <span className="glyphicon glyphicon-user" />
            Logout
          </Link>

        );
      }
      return (
        <div>
          {redirectVar}
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
              {navLogin}
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

            </div>
          </nav>

        </div>
      );
    }
}

export default NavigationBar;
