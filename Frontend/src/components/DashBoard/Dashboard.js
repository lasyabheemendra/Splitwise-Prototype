/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
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

};

const mapStateToProps = (state) => ({
  details: state.information,
});

export default connect(mapStateToProps, null)(DashBoard);
