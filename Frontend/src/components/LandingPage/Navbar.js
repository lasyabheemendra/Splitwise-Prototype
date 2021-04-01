/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

// create the Navbar Component
class Navbar extends PureComponent {
  // handle logout to destroy the cookie
  // eslint-disable-next-line class-methods-use-this
  handleLogout() {
    cookie.remove('cookie', { path: '/' });
  }

  render() {
    // if Cookie is set render Logout Button
    let navLogin = null;
    if (cookie.load('cookie')) {
      console.log('Able to read cookie');
      navLogin = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/" onClick={this.handleLogout}>
              <span className="glyphicon glyphicon-user" />
              Logout
            </Link>
          </li>
        </ul>
      );
    }
    return (
      <div>
        {navLogin}
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
            <button
              type="button"
              id="login"
              className="btn btn-success mr-2"
              Style="width: 100px;"
            >
              Login
            </button>

            <button
              type="button"
              id="signup"
              className="btn btn-success"
              Style="width: 100px;"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
