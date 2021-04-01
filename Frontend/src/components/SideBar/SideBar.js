import React, { PureComponent } from 'react';

class SideBar extends PureComponent {
  render() {
    return (
      <div className="d-flex" id="wrapper">

        <div className="bg-light border-right" id="sidebar-wrapper">

          <div className="list-group list-group-flush">
            <a href="/dashboard" className="list-group-item list-group-item-action bg-light">Dashboard</a>
            <a href="/recentactivity" className="list-group-item list-group-item-action bg-light">Recent Activity</a>
            <a href="/mygroups" className="list-group-item list-group-item-action bg-light">My Groups</a>
            <a href="/newgroup" className="list-group-item list-group-item-action bg-light">Add new group</a>
            <a href="/userprofile" className="list-group-item list-group-item-action bg-light">Profile</a>

          </div>
        </div>

      </div>
    );
  }
}

export default SideBar;
