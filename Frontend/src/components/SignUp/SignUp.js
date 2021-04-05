/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import signup from '../../actions/signupAction';
import NavigationBar from '../LandingPage/NavigationBar';
import '../../App.css';

// Define a Login Component
class SignUp extends Component {
  // username change handler to update state variable with the text entered by the user
  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  }

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
    submitSignup = (e) => {
      // prevent page from refresh
      e.preventDefault();
      const data = {
        username: this.state.username,
        useremail: this.state.useremail,
        password: this.state.password,
      };
      this.props.signup(data);
    }

    render() {
      // redirect based on successful login
      let redirectVar = null;
      if (this.props.loggedIn) {
        redirectVar = <Redirect to="/dashboard" />;
      }
      return (

        <div className="container">
          {redirectVar}
          <NavigationBar showLogin />
          <div>
            <div className="login-form">
              <div className="main-div">
                <div className="panel">
                  <h2>INTRODUCE YOURSELF</h2>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Username"
                    onChange={this.usernameChangeHandler}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
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
                <button type="button" className="btn btn-primary" onClick={this.submitSignup}>
                  Sign Me Up!
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
      );
    }
}

SignUp.propTypes = {
  signup: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,

};

function mapStateToProps(state) {
  const { loggedIn, error, token } = state.validation;
  return {
    loggedIn,
    error,
    token,
  };
}
// export Login Component
export default connect(mapStateToProps, { signup })(SignUp);
