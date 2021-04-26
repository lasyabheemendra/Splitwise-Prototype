import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import NavigationBar from './NavigationBar';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

class LandingPage extends PureComponent {
  render() {
    let redirectVar = null;
    if (localStorage.getItem('token')) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    return (
      <div>
        {redirectVar}
        <NavigationBar showLogin showSignup />
        <div className="App-header">
          <h1 className="font-weight-bolder" size="100">
            Less stress when sharing expenses with anyone.
          </h1>
          <a href="/signup">
            <button
              id="signup"
              type="button"
              className="btn btn-success"
            >
              Sign Up
            </button>
          </a>
        </div>
      </div>
    );
  }
}
// Export The  Component
export default LandingPage;
