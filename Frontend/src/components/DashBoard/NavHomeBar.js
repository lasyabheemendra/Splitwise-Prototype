/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logout } from '../../actions/action';

// create the Navbar Component
class NavHomeBar extends PureComponent {
  render() {
    let navLogin = null;
    if (this.props.loggedIn) {
      navLogin = (

        <Link to="/" onClick={this.props.logout}>
          <span className="glyphicon glyphicon-user" />
          Logout
        </Link>

      );
    }
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/dashboard">
            <img
              alt=""
              src="./download.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            Welcome to SplitWise
          </Navbar.Brand>
          <Link to="/dashboard">
            <span className="glyphicon glyphicon-user" />
            Dashboard
          </Link>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as:
            </Navbar.Text>
            <NavDropdown title={this.props.details.username} id="collasible-nav-dropdown">
              <NavDropdown.Item href="/userprofile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="/">{navLogin}</NavDropdown.Item>
            </NavDropdown>

          </Navbar.Collapse>
        </Navbar>

      </div>
    );
  }
}

NavHomeBar.propTypes = {
  logout: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  details: PropTypes.string.isRequired,

};

const mapStateToProps = (state) => ({
  loggedIn: state.validation.loggedIn,
  details: state.information,
});

export default connect(mapStateToProps, { logout })(NavHomeBar);
