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
    axios.get('http://54.215.128.119:3001/recentactivities')
      .then((response) => {
        console.log(response.data);
        this.setState({ recentDetails: response.data });
      }).catch(() => {
        console.log('response.data');
      });
  }

  sortFunction = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    let sort = this.state.recentDetails;
    sort = _.orderBy(sort, ['actionon'], ['asc']);
    this.setState({ recentDetails: sort });
  }

  reversesortFunction = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    let sort = this.state.recentDetails;
    sort = _.orderBy(sort, ['actionon'], ['desc']);
    this.setState({ recentDetails: sort });
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
              <div>
                <BootstrapTable
                  data={this.state.recentDetails}
                  striped
                  hover
                >
                  <TableHeaderColumn isKey dataField="actionon">
                    Date
                    <button type="button" onClick={this.sortFunction}>^</button>
                    <button type="button" onClick={this.reversesortFunction}>v</button>
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="action_by"> Activity By</TableHeaderColumn>
                  <TableHeaderColumn dataField="action_name">Activity Name</TableHeaderColumn>
                </BootstrapTable>
              </div>

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
