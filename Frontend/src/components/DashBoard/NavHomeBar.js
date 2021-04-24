/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logout } from '../../actions/action';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

// create the Navbar Component
class NavHomeBar extends PureComponent {
  render() {
    const name = localStorage.getItem('username');
    let navLogin = null;
    if (localStorage.getItem('token')) {
      navLogin = (

        <Link to="/" onClick={this.props.logout}>
          <span className="glyphicon glyphicon-user" />
          Logout
        </Link>

      );
    }
    return (
      <div>
        <Navbar className="navbar-inner" variant="dark">
          <Navbar.Brand href="/dashboard">
            <img
              alt=""
              src="./download.png"
              width="30"
              height="30"
            />
            Welcome to SplitWise
          </Navbar.Brand>
          <Link to="/dashboard" style={{ color: 'blue' }}>
            <span className="glyphicon glyphicon-user" />
            Dashboard
          </Link>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as:
            </Navbar.Text>
            <NavDropdown title={name} id="collasible-nav-dropdown">
              <NavDropdown.Item href="/userprofile">Profile</NavDropdown.Item>
              <NavDropdown.Item>{navLogin}</NavDropdown.Item>
            </NavDropdown>

          </Navbar.Collapse>
        </Navbar>

      </div>
    );
  }
}

NavHomeBar.propTypes = {
  logout: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
  loggedIn: state.validation.loggedIn,
  details: state.information.username,
});

export default connect(mapStateToProps, { logout })(NavHomeBar);
