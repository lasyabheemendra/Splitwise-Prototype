/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import '../../App.css';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { login } from '../../actions/action';
import NavigationBar from '../LandingPage/NavigationBar';

// Define a Login Component
class Login extends Component {
      // username change handler to update state variable with the text entered by the user
      useremailChangehandler = (e) => {
        this.setState({
          useremail: e.target.value,
        });
      }

      // password change handler to update state variable with the text entered by the user
      passwordChangeHandler = (e) => {
        this.setState({
          password: e.target.value,
        });
      }

  // submit Login handler to send a request to the node backend
  submitLogin = (e) => {
    // prevent page from refresh
    e.preventDefault();
    const data = {
      useremail: this.state.useremail,
      password: this.state.password,
    };
    this.props.login(data);
  }

  render() {
    // redirect based on successful login
    let redirectVar = null;
    if (this.props.token.length > 0) {
      localStorage.setItem('token', this.props.token);
      const decoded = jwt_decode(this.props.token.split(' ')[1]);
      localStorage.setItem('userID', decoded._id);
      redirectVar = <Redirect to="/dashboard" />;
    }
    return (
      <div>
        {redirectVar}
        <NavigationBar showSignup />
        <div className="container">
          <div>
            <div className="login-form">
              <div className="main-div">
                <div className="panel">
                  <h2>User Login</h2>
                  <p>Please enter your registered email and password</p>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="useremail"
                    placeholder="useremail@example.com"
                    onChange={this.useremailChangehandler}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    onChange={this.passwordChangeHandler}
                  />
                </div>
                <button type="button" className="btn btn-primary" onClick={this.submitLogin}>
                  Login
                </button>
                {this.props.error && (
                <p className="alert alert-success">
                  {' '}
                  {this.props.error }
                  {' '}
                </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  details: state.information,
  loggedIn: state.validation.loggedIn,
  error: state.validation.error,
  token: state.validation.token,
});

export default connect(mapStateToProps, { login })(Login);
