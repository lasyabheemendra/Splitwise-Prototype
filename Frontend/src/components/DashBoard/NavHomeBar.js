import React, { PureComponent } from 'react';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// create the Navbar Component
class NavHomeBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    axios.get('http://54.215.128.119:3001/navbar')
      .then((response) => {
        // update the state with the response data
        this.setState({
          username: response.data[0],
        });
      });
  }

    // handle logout to destroy the cookie
    handleLogout = () => {
      cookie.remove('cookie', { path: '/' });
    }

    render() {
      let navLogin = null;
      if (cookie.load('cookie')) {
        navLogin = (

          <Link to="/" onClick={this.handleLogout}>
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
              <NavDropdown title={this.state.username} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/userprofile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/">{navLogin}</NavDropdown.Item>
              </NavDropdown>

            </Navbar.Collapse>
          </Navbar>

        </div>
      );
    }
}

export default (NavHomeBar);
