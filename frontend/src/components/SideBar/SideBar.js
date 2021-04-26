import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

class SideBar extends PureComponent {
  render() {
    return (
      <div className="d-flex" id="wrapper">

        <div className="bg-light border-right" id="sidebar-wrapper">

          <div className="list-group list-group-flush">
            <Link to="/dashboard" className="list-group-item list-group-item-action bg-light"> Dashboard</Link>
            <Link to="/recentactivity" className="list-group-item list-group-item-action bg-light"> Recent Activity</Link>
            <Link to="/mygroups" className="list-group-item list-group-item-action bg-light"> My Groups</Link>
            <Link to="/newgroup" className="list-group-item list-group-item-action bg-light"> Add new group</Link>
            <Link to="/userprofile" className="list-group-item list-group-item-action bg-light"> Profile</Link>

          </div>
        </div>

      </div>
    );
  }
}

export default SideBar;
