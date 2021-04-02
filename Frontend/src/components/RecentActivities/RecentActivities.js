/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import _ from 'lodash';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import NavHomeBar from '../DashBoard/NavHomeBar';
import SideBar from '../SideBar/SideBar';

class recentActivity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recentDetails: [],
      printDetails: [],
      recentDetailsAvailable: false,
      allGroups: [],
      columns: [{
        dataField: 'actionon',
        text: 'Activity ON',
        sort: true,
      }, {
        dataField: 'action_by',
        text: 'Activity By',
      },
      {
        dataField: 'action_name',
        text: 'Action Name',
      }],
    };
  }

  componentDidMount() {
    axios.get('http://localhost:3001/recentactivities')
      .then((response) => {
        if (response.data !== 'No recent activities found') {
          this.setState({
            recentDetails: response.data,
            recentDetailsAvailable: true,
            printDetails: response.data,
          });
          this.getMygroups();
        }
      }).catch(() => {
        console.log('response.data');
      });
  }

  getMygroups = () => {
    this.setState({
      allGroups: [],
    });
    const tempNames = ['None'];
    axios.get('http://localhost:3001/myallgroups').then((response) => {
      for (let i = 0; i < response.data.length; i += 1) {
        tempNames.push(response.data[i].group_name);
      }
      this.setState({
        allGroups: tempNames,
      });
    }, []);
  };

  sortFunction = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    let sort = this.state.recentDetails;
    sort = _.orderBy(sort, ['action_id'], ['asc']);
    this.setState({ printDetails: sort });
  }

  reversesortFunction = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    let sort = this.state.recentDetails;
    sort = _.orderBy(sort, ['action_id'], ['desc']);
    this.setState({ printDetails: sort });
  }

  filterGroup = (e) => {
    const selectedGroup = e.target.value;
    if (selectedGroup !== 'None') {
      const filterdActivity = this.state.recentDetails
        .filter((item) => item.group_name === selectedGroup);
      this.setState({ printDetails: filterdActivity });
    } else {
      this.setState({ printDetails: this.state.recentDetails });
    }
  }

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <NavHomeBar />
        <Container>
          <Row>

            <Col xs={{ order: 'last' }} md={2} className="d-flex" />
            <Col xs md={8} ms={4}>
              {this.state.recentDetailsAvailable === true
              && (
              <div>
                <BootstrapTable
                  data={this.state.printDetails}
                  striped
                  hover
                >
                  <TableHeaderColumn isKey dataField="actionon">
                    Date
                    <button type="button" onClick={this.sortFunction}> Recent last</button>
                    <button type="button" onClick={this.reversesortFunction}>Recent First</button>
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="action_by"> Activity By</TableHeaderColumn>
                  <TableHeaderColumn dataField="action_name">
                    Activity Name
                    <select onChange={this.filterGroup}>
                      {this.state.allGroups.map((mygroup) => (
                        <option>{mygroup}</option>))}
                    </select>

                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
              )}
              {this.state.recentDetailsAvailable === false
              && (
              <div>
                <span style={{ color: 'green' }}> No Recent Activities</span>
              </div>
              )}
            </Col>
            <Col xs={{ order: 'first' }} md={2}>
              {' '}
              <div id="left _sidebar">
                <SideBar />
              </div>
            </Col>
          </Row>
          <Row />
        </Container>

      </div>

    );
  }
}
export default (recentActivity);
