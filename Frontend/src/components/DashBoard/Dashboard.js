/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import {
  Container, Row, Col, Button, Navbar, Modal, Form,
} from 'react-bootstrap';
import _ from 'lodash';
import { Redirect } from 'react-router';
import axios from 'axios';
import numeral from 'numeral';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import NavHomeBar from './NavHomeBar';
import SideBar from '../SideBar/SideBar';
import { getDashboardInfo } from '../../actions/dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

class DashBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      printOwes: [],
      printGetsback: [],
      totalBalance: 0,
      you_are_owed: 0,
      you_owe: 0,
      youAreOwed: false,
      youOweto: false,
      message: '',
      isOpen: false,
      userDetails: '',
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mygroups.acceptedGroups !== this.props.mygroups.acceptedGroups) {
      this.getUserBalance();
    }
  }

  getData = async () => {
    const data = { userID: localStorage.getItem('userID') };
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    await this.props.getDashboardInfo(data);
    await this.getUserBalance();
  }

  getUserBalance = () => {
    let tempfulldata = [];
    let tempuserOwes = [];
    let tempuserGetsback = [];
    let tempowedUsers = [];
    let tempgetsbackUsers = [];
    let tempprintOwes = [];
    let tempprintgetsback = [];
    let tempgetsback = 0;
    let tempowes = 0;
    console.log('dashboard directly 2');
    const datas = { groups: this.props.mygroups.acceptedGroups };
    console.log('getUserBalance datas 3', datas);
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.post('http://localhost:3001/dashboard/userbalance', datas)
      .then((response) => {
        console.log('dahboard response', response);
        if (response.data === 'No active groups found for this user') {
          this.setState({ message: 'You have no active groups!' });
        } else {
          this.setState({ message: '' });
          tempfulldata = response.data;
          console.log('tempfulldata', tempfulldata);
          tempuserOwes = response.data.filter((item) => item.status === 'owes' && item.userName === this.props.details.username);
          tempuserGetsback = response.data.filter((item) => item.status === 'gets back' && item.userName === this.props.details.username);

          tempowedUsers = response.data.filter((item) => item.status === 'owes' && item.userName !== this.props.details.username);
          tempgetsbackUsers = response.data.filter((item) => item.status === 'gets back' && item.userName !== this.props.details.username);

          if (tempuserGetsback.length > 0) {
            // total amout user should get back
            tempgetsback = _(tempuserGetsback)
              .groupBy('userName')
              .map((objs, key) => ({
                userName: key,
                balance: numeral((_.sumBy(objs, 'balance'))).format('00.00'),
              }))
              .value()[0].balance;
          }

          // total amout user owes to other members
          if (tempuserOwes.length > 0) {
            tempowes = _(tempuserOwes)
              .groupBy('userName')
              .map((objs, key) => ({
                userName: key,
                balance: numeral(Math.abs(_.sumBy(objs, 'balance'))).format('00.00'),
              }))
              .value()[0].balance;
          }

          if (tempuserGetsback.length > 0 && tempgetsbackUsers < 1) {
            this.setState({ youAreOwed: true });
            // members oweing to user
            tempprintOwes = _(tempowedUsers)
              .groupBy('userName')
              .map((objs, key) => ({
                userName: key,
                balance: `Owes you ${this.props.details.currency}${numeral(Math.abs(_.sumBy(objs, 'balance'))).format('00.00')}`,
              }))
              .value();
          } else if (tempuserGetsback.length > 0
             && tempgetsbackUsers.length > 0) {
            this.setState({ youAreOwed: true });
            for (let i = 0; i < tempuserGetsback.length; i += 1) {
              const name = tempuserGetsback[i].group_name;
              // eslint-disable-next-line no-unused-vars
              const gettersInGroup = tempgetsbackUsers.filter((item) => item.group_name === name);
              const giversInGroup = tempowedUsers.filter((item) => item.group_name === name);

              if (giversInGroup.length > 1) {
                for (let j = 0; j < giversInGroup.length; j += 1) {
                  tempprintOwes.push({
                    userName: giversInGroup[j].userName,
                    balance: tempuserGetsback[i].balance / giversInGroup.length,
                    group: giversInGroup[j].group_name,
                  });
                }
              } else if (giversInGroup.length === 1) {
                tempprintOwes.push({
                  userName: giversInGroup[0].userName,
                  balance: tempuserGetsback[i].balance,
                  group: giversInGroup[0].group_name,
                });
              }
            }

            // members oweing to user
            tempprintOwes = _(tempprintOwes)
              .groupBy('userName')
              .map((objs, key) => ({
                userName: key,
                balance: `Owes you ${this.props.details.currency}${numeral(Math.abs(_.sumBy(objs, 'balance'))).format('00.00')}`,
              }))
              .value();
          }
          if (tempuserOwes.length > 0) {
            console.log('tempuserOwes', tempuserOwes);
            this.setState({ youOweto: true });
            for (let i = 0; i < tempuserOwes.length; i += 1) {
              const name = tempuserOwes[i].group_name;
              console.log('for group name', name);
              const temp = tempgetsbackUsers.filter((item) => item.group_name === name);
              console.log('tempgetsbackUsers temp', temp);
              const temp1 = tempowedUsers.filter((item) => item.group_name === name);
              console.log('tempowedUsers temp1', temp1);
              for (let j = 0; j < temp.length; j += 1) {
                if (temp1.length > 0) {
                  tempprintgetsback.push({
                    userName: tempuserOwes[i].userName,
                    balance: tempuserOwes[i].balance / temp.length,
                    membername: temp[j].userName,
                    group: temp[j].group_name,
                  });
                } else {
                  tempprintgetsback.push({
                    userName: tempuserOwes[i].userName,
                    balance: -tempgetsbackUsers[j].balance,
                    membername: temp[j].userName,
                    group: temp[j].group_name,
                  });
                }
              }
            }
            console.log('tempprintgetsback before ', tempprintgetsback);
            tempprintgetsback = _(tempprintgetsback)
              .groupBy('membername')
              .map((objs, key) => ({
                userName: key,
                balance: `${key} ${this.props.details.currency}${numeral(Math.abs(_.sumBy(objs, 'balance'))).format('00.00')}`,
              }))
              .value();
            console.log('tempprintgetsback after ', tempprintgetsback);
          }
          this.setState({
            memberData: tempfulldata,
            printOwes: tempprintOwes,
            printGetsback: tempprintgetsback,
            you_are_owed: tempgetsback,
            you_owe: tempowes,
            totalBalance: tempgetsback - tempowes,
          });
        }
      }).catch(() => {
        console.log('user did not leave group');
      });
  }

  showModal = () => {
    let users = [];
    this.setState({ isOpen: true });
    const data = {
      groups: this.props.mygroups.acceptedGroups,
      useremail: this.props.details.useremail,
    };
    axios.post('http://localhost:3001/dashboard/getrelatedusers', data)
      .then((response) => {
        users = response.data;
        console.log('users', users);

        this.setState({ isOpen: true, userDetails: users });
      }).catch(() => {
        console.log('No Related users found');
      });
  }

  hideModal = () => {
    this.setState({ isOpen: false });
  };

  userNameChange = (e) => {
    this.setState({ selectedUser: e });
  }

  settleUp = () => {
    console.log('this.state.memberData', this.state.memberData);
    const tempotherUsers = this.state.memberData
      .filter((item) => item.userName === this.state.selectedUser[0]);
    console.log('tempotherUsers', tempotherUsers);
    const temploggedUser = this.state.memberData
      .filter((item) => item.userName === this.props.details.username);
    console.log('temploggedUser', temploggedUser);
    const result = temploggedUser.concat(tempotherUsers);
    console.log('result', result);
    console.log('tempotherUsers 2', tempotherUsers);
    const data = {
      loggedUser: this.props.details.userID,
      otherUser: tempotherUsers[0].userID,
      userDetails: result,
      groups: this.props.mygroups.acceptedGroups,
    };
    console.log('settle up data', data);
    // make a post request with the user data

    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.post('http://localhost:3001/dashboard/settleup ', data)
      .then((response) => {
        console.log('settle up response', response.data);
        this.hideModal();
        this.getUserBalance();
      }).catch(() => {
        console.log('response is not recieved');
      });
  }

  render() {
    // redirect based on successful login
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <NavHomeBar />

        <Container>
          { this.state.message && (
          <Row className="alert alert-success">
            {this.state.message}
          </Row>
          )}
          <Row>
            <Col xs={{ order: 'last' }} md={4} />
            <Col xs md={8} ms={4}>
              <div className="dashboard header">
                <Navbar bg="light" variant="light">
                  <Navbar.Collapse className="justify-content-start">
                    <h3 className="font-weight-bold">Dashboard </h3>
                  </Navbar.Collapse>
                  <Navbar.Collapse className="justify-content-end">
                    <Button variant="info" onClick={this.showModal}>Settle Up</Button>
                  </Navbar.Collapse>
                </Navbar>
              </div>
              <Modal show={this.state.isOpen} onHide={this.hideModal}>
                <Modal.Header>
                  <div>
                    <Modal.Title className="alert alert-info">
                      {this.props.details.username}
                      {' '}
                      with whom do you want to settle up?
                    </Modal.Title>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  {this.state.userDetails
                  && (
                  <Form.Group>
                    <Typeahead
                      id="Name"
                      name="user"
                      labelKey="userName"
                      options={this.state.userDetails}
                      onChange={this.userNameChange}
                      placeholder="Name"
                    />
                  </Form.Group>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={this.hideModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={this.settleUp}>
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
              <div className="clearfix">
                <Navbar bg="light" variant="secondary">
                  <Navbar.Collapse className="justify-content-start">
                    <p className="font-weight-bold">total balance:  </p>
                    <p>
                      {this.props.details.currency}
                      {this.state.totalBalance}
                    </p>
                  </Navbar.Collapse>
                  <Navbar.Collapse className="justify-content-center">
                    <p className="font-weight-bold">you owe:  </p>
                    <p>
                      {this.props.details.currency}
                      {this.state.you_owe}
                    </p>
                  </Navbar.Collapse>
                  <Navbar.Collapse className="justify-content-end">
                    <p className="font-weight-bold">you are owed:  </p>
                    <p>
                      {this.props.details.currency}
                      {this.state.you_are_owed}
                    </p>
                  </Navbar.Collapse>
                </Navbar>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col v-divider">
                    <h6>YOU OWE </h6>
                    {this.state.youOweto === false && (<p> You do not owe anything </p>)}
                    { this.state.youOweto === true && this.state.printGetsback.map((data) => (
                      <div key={data.userName}>
                        <p>
                          <strong>
                            <span style={{ color: 'green' }}>{data.balance}</span>

                          </strong>
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="col v-divider">
                    <h6>YOU ARE OWED </h6>
                    {this.state.youAreOwed === false && (<p> You are not owed anything </p>)}
                    { this.state.youAreOwed === true && this.state.printOwes.map((data) => (
                      <div key={data.userName}>
                        <p>
                          <strong>
                            <i>
                              {' '}
                              {data.userName}
                              {' '}
                            </i>
                            <sub>
                              <span style={{ color: 'green' }}>{data.balance}</span>
                            </sub>
                          </strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={{ order: 'first' }} md={2}>
              {' '}
              <div id="left _sidebar">
                <SideBar />
              </div>
            </Col>
          </Row>
        </Container>

        <div id="centre_container" />
      </div>

    );
  }
}
DashBoard.propTypes = {
  details: PropTypes.string.isRequired,
  mygroups: PropTypes.string.isRequired,
  getDashboardInfo: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
  details: state.information,
  mygroups: state.mygroups,
});

export default connect(mapStateToProps, { getDashboardInfo })(DashBoard);
