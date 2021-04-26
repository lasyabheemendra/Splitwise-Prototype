/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';
import NavHomeBar from '../DashBoard/NavHomeBar';
import SideBar from '../SideBar/SideBar';
import Pagination from './Pagination';

class recentActivity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recentDetails: [],
      printDetails: [],
      recentDetailsAvailable: false,
      allGroups: [],
      message: '',
      currentPage: 1,
      currentActivities: [],
      activityPerPage: 2,
    };
  }

  componentDidMount() {
    this.setState({
      allGroups: this.props.mygroups.acceptedGroups,

    });
    this.getActivityInfo();
  }

  getActivityInfo = async () => {
    const temp = [];
    let count = 0;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    await axios.get('http://localhost:3001/activities/getrecentactivities').then((response) => {
      for (let i = 0; i < response.data.info.length; i += 1) {
        if (this.state.allGroups.includes(response.data.info[i].activityGroup.groupName)) {
          temp.push({ id: count, act: response.data.info[i] });
          count += 1;
        }
      }
      this.setState({ recentDetails: _.orderBy(temp, ['id'], ['desc']) });
      this.setState({
        printDetails: this.state.recentDetails,
        currentActivities: this.state.recentDetails,
      });
    }, []);
    console.log('printDetails post fetch', this.state.printDetails);
    console.log('printDetails post fetc length', this.state.printDetails.length);
    if (this.state.printDetails.length !== 0) {
      this.setState({
        recentDetailsAvailable: true,
      });
    }
    await this.setCurrentSize();
  };

  sortFunction = (e) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    let sort = this.state.currentActivities;
    if (e.target.value === 'desc') {
      sort = _.orderBy(sort, ['id'], ['desc']);
    } else if (e.target.value === 'asc') {
      sort = _.orderBy(sort, ['id'], ['asc']);
    }
    this.setState({ currentActivities: sort });
  }

  filterGroup = (e) => {
    const selectedGroup = e.target.value;
    this.setState({ message: '' });
    if (selectedGroup !== 'Open this select menu') {
      const filterdActivity = this.state.currentActivities
        .filter((item) => item.act.activityGroup.groupName === selectedGroup);
      console.log('filterdActivity', filterdActivity);
      if (filterdActivity.length === 0) {
        this.setState({ message: 'No Recent Activity found in this Group' });
        this.setCurrentSize();
      } else {
        this.setState({ message: '' });
        this.setState({ currentActivities: filterdActivity });
      }
    } else {
      this.setCurrentSize();
    }
  }

handlePageSize = async (e) => {
  await this.setState({ activityPerPage: e.target.value });
  await this.setCurrentSize();
}

setCurrentSize = () => {
  const indexOfLastActivity = this.state.currentPage * this.state.activityPerPage;
  const indexOfFirstActivity = indexOfLastActivity - this.state.activityPerPage;
  const currentActivity = this.state.printDetails.slice(indexOfFirstActivity, indexOfLastActivity);
  this.setState({ currentActivities: currentActivity });
}

paginate = async (pageNumber) => {
  await this.setState({ currentPage: pageNumber });
  await this.setCurrentSize();
}

render() {
  let redirectVar = null;
  if (!localStorage.getItem('token')) {
    redirectVar = <Redirect to="/" />;
  }
  console.log('recentDetailsAvailable', this.state.recentDetailsAvailable);
  return (
    <div>
      {redirectVar}
      <NavHomeBar />
      <Container>
        <br />
        <Row>

          <Col xs={{ order: 'last' }} md={2} className="d-flex" />
          <Col xs md={8} ms={4}>
            <Row>
              <h3 style={{ color: 'blue' }}> Recent activity</h3>
              <Col xs md={4} ms={4}>
                <Form>
                  <Form.Group controlId="formCategory1">
                    <Form.Label className="label other">Sort By:</Form.Label>
                    <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={this.sortFunction}>
                      <option value="desc">most recent first</option>
                      <option value="asc">most recent last</option>
                    </select>
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={{ order: 'last' }} md={2} className="d-flex">
                <Form>
                  <Form.Group controlId="formCategory1">
                    <Form.Label className="label other">Filter By Groups:</Form.Label>
                    <select className="form-select form-select-sm" aria-label=".form-select-sm example" data-width="fit" onChange={this.filterGroup}>
                      <option selected>Open this select menu</option>
                      {this.state.allGroups && this.state.allGroups.map((acc) => (
                        <option>{acc}</option>))}
                    </select>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={2} className="d-flex">
                <Form>
                  <Form.Group controlId="formCategory1">
                    <Form.Label className="label other">page size:</Form.Label>
                    <select className="form-select form-select-sm" aria-label=".form-select-sm example" data-width="fit" onChange={this.handlePageSize}>
                      <option selected>2</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </Form.Group>
                </Form>
              </Col>

            </Row>
            <br />
            {this.state.message
              && (
              <p>
                <b>
                  <span style={{ color: 'green' }}>
                    {' '}
                    {this.state.message}
                  </span>
                </b>
              </p>
              )}
            {!this.state.message
             && this.state.currentActivities
             && this.state.currentActivities.map((acts) => (
               <div key={acts.id}>
                 <div className="row pb-1 border-bottom">
                   <div className="col">
                     <p style={{ size: '10px' }}>
                       <b>
                         {acts.act.activityBy.username}
                       </b>
                       {' '}
                       {acts.act.activityName}
                       {'  '}
                       <b>
                         {acts.act.activityGroup.groupName}
                       </b>
                     </p>
                     <p style={{ size: '3px' }}>
                       {' '}
                       <i>
                         {acts.act.activityOn}
                         {' '}
                       </i>
                     </p>
                   </div>
                 </div>

               </div>
             ))}
            <Pagination
              activitiesPerPage={this.state.activityPerPage}
              allActivity={this.state.printDetails.length}
              paginate={this.paginate}
            />
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

recentActivity.propTypes = {
  mygroups: PropTypes.string.isRequired,

};

const mapStateToProps = (state) => ({
  details: state.information,
  mygroups: state.mygroups,
});

export default connect(mapStateToProps, null)(recentActivity);
