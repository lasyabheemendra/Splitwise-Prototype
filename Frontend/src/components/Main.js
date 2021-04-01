import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import DashBoard from './DashBoard/Dashboard';
import UserProfile from './UserProfile/UserProfile';
import newgroup from './Groups/newGroup';
import mygroups from './Groups/myGroups';
import groupPage from './Groups/groupPage';
import recentActivity from './RecentActivities/RecentActivities';

class Main extends PureComponent {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/dashboard" component={DashBoard} />
        <Route exact path="/userprofile" component={UserProfile} />
        <Route exact path="/newgroup" component={newgroup} />
        <Route exact path="/mygroups" component={mygroups} />
        <Route exact path="/grouppage/:Name" component={groupPage} />
        <Route exact path="/recentactivity" component={recentActivity} />
      </div>
    );
  }
}
// Export The Main Component
export default Main;
