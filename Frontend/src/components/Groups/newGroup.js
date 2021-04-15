/* eslint-disable linebreak-style */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead';
import NavHomeBar from '../DashBoard/NavHomeBar';
import { groupCreate } from '../../actions/newGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import DefaultGroupPic from './download.png';

class group extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      groupname: '',
      groupImage: DefaultGroupPic,
      defaultmember: null,
      allUseremail: [],
      userDetails: [],
      memberName1: '',
      memberEmail1: '',
      memberName2: '',
      memberEmail2: '',
      memberName3: '',
      memberEmail3: '',
      memberName4: '',
      memberEmail4: '',
      redirect: null,
      error: {
        groupnameError: '', memberEmail1Err: '', memberEmail4Err: '',
      },
    };
  }

  componentDidMount() {
    this.setState({
      defaultmember: `${this.props.details.username}${'  ('}${this.props.details.useremail})`,
    });
    this.getusers();
  }

  getusers = () => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    // make a post request with the user data
    const data = { email: this.props.details.useremail };
    axios.post('http://localhost:3001/getusers/all', data)
      .then((response) => {
        for (let i = 0; i < response.data.length; i += 1) {
          this.setState({
            allUseremail: [...this.state.allUseremail, response.data[i].useremail],
            userDetails: [...this.state.userDetails, response.data[i]],
          });
        }
      });
  }

  groupnameChangehandler = (e) => {
    this.setState({
      groupname: e.target.value,
      error: {
        groupnameError: '',
      },
    });
  };

  member1Changehandler = (selectedValue) => {
    if (selectedValue.length !== 0) {
      const newList = this.state.userDetails
        .filter((item) => item.useremail !== selectedValue[0].useremail);
      this.setState({
        memberName1: selectedValue[0].username,
        memberEmail1: selectedValue[0].useremail,
        userDetails: newList,
      });
    } else {
      this.setState({
        memberName1: '',
        memberEmail1: '',
      });
    }
  }

  member1EmailChangehandler = (e) => {
    this.setState({
      memberEmail1: e.target.value,
    });
  }

  member2Changehandler = (selectedValue) => {
    if (selectedValue.length !== 0) {
      const newList = this.state.userDetails
        .filter((item) => item.useremail !== selectedValue[0].useremail);
      this.setState({
        memberName2: selectedValue[0].username,
        memberEmail2: selectedValue[0].useremail,
        userDetails: newList,
      });
    } else {
      this.setState({
        memberName2: '',
        memberEmail2: '',
      });
    }
  }

  member2EmailChangehandler = (e) => {
    this.setState({
      memberEmail2: e.target.value,
    });
  }

  member3Changehandler = (selectedValue) => {
    if (selectedValue.length !== 0) {
      const newList = this.state.userDetails
        .filter((item) => item.useremail !== selectedValue[0].useremail);
      this.setState({
        memberName3: selectedValue[0].username,
        memberEmail3: selectedValue[0].useremail,
        userDetails: newList,
      });
    } else {
      this.setState({
        memberName3: '',
        memberEmail3: '',
      });
    }
  }

  member3EmailChangehandler = (e) => {
    this.setState({
      memberEmail3: e.target.value,
    });
  }

  member4Changehandler = (selectedValue) => {
    if (selectedValue.length !== 0) {
      const newList = this.state.userDetails
        .filter((item) => item.useremail !== selectedValue[0].useremail);
      this.setState({
        memberName4: selectedValue[0].username,
        memberEmail4: selectedValue[0].usermail,
        userDetails: newList,
      });
    } else {
      this.setState({
        memberName4: '',
        memberEmail4: '',
      });
    }
  }

  member4EmailChangehandler = (e) => {
    this.setState({
      memberEmail4: e.target.value,
    });
  }

  verifyEmailID = (data) => {
    let allValid = true;
    if (data.groupname === '') {
      allValid = false;
      this.setState({
        error: {
          groupnameError: 'Group Name cannot be blank',
        },

      });
    }
    if (data.user.length === 0) {
      allValid = false;
      this.setState({
        error: {
          memberEmail4Err: 'Please add atleast one group member',
        },

      });
    }

    for (let i = 0; i < data.user.length; i += 1) {
      if (!this.state.allUseremail.includes(data.user[i].useremail)) {
        allValid = false;
        this.setState({
          error: { memberEmail1Err: `email address entered in field${i + 1} is not valid` },
        });
      }
    }
    if (allValid) {
      this.setState({
        error: {
          groupnameError: '', memberEmail1Err: '', memberEmail4Err: '',
        },
      });
    }
    return allValid;
  }

  onSave = (e) => {
    // prevent page from refresh
    e.preventDefault();
    const data = {
      groupname: this.state.groupname,
      user: [],
    };
    const count = 1;
    if (this.state.memberEmail1) {
      data.user.push({ username: this.state.memberName1, useremail: this.state.memberEmail1 });
    }
    if (this.state.memberEmail2) {
      data.user.push({ username: this.state.memberName2, useremail: this.state.memberEmail2 });
    }
    if (this.state.memberEmail3) {
      data.user.push({ username: this.state.memberName3, useremail: this.state.memberEmail3 });
    }
    if (this.state.memberEmail4) {
      data.user.push({ username: this.state.memberName4, useremail: this.state.memberEmail4 });
    }
    data.count = count;
    console.log('outside', data);
    if (this.verifyEmailID(data)) {
      data.user.unshift({
        username: this.props.details.username,
        useremail: this.props.details.useremail,
      });
      console.log('inside', data);
      this.props.groupCreate(data);
    } else {
      console.log('emails are invalid');
      console.log(this.state.error);
    }
  }

  render() {
    let redirectVar = null;
    if (this.props.groupcreated) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    if (!localStorage.getItem('token')) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <NavHomeBar />
        <Container>
          <Row>
            <Col xs={{ order: 'last' }} md={4} />
            <Col xs md={7}>
              <div id="center_column">
                <h3>Start a new Group</h3>
                <Form.Group controlId="formCategory1">
                  <Form.Label>My Group shall be called...</Form.Label>
                  <Form.Control type="text" placeholder="Group Name" onChange={this.groupnameChangehandler} value={this.state.groupname} />
                  {this.state.error.groupnameError && (
                  <p className="alert alert-success">
                    {' '}
                    {this.state.error.groupnameError }
                    {' '}
                  </p>
                  )}
                  {this.props.error && (
                  <p className="alert alert-success">
                    {' '}
                    {this.props.error}
                    {' '}
                  </p>
                  )}
                </Form.Group>
                <h3>Group members</h3>
                <Form.Group controlId="formCategory1">

                  <span style={{ color: 'maroon' }}>{this.state.defaultmember}</span>
                  <div className="container">
                    <div className="form-row">
                      <div className="col-5">
                        <Form.Group>
                          <Typeahead
                            id="Name"
                            name="member1"
                            value="Name"
                            labelKey="username"
                            options={this.state.userDetails}
                            onChange={this.member1Changehandler}
                            placeholder="Name"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-7">
                        <input type="text" name="memberemail1" onChange={this.member1EmailChangehandler} className="form-control" placeholder="Email Address" />

                      </div>
                      <div className="col-10">
                        {' '}
                        <span style={{ color: 'green' }}>{this.state.error.memberEmail1Err}</span>
                      </div>

                    </div>
                    <div className="form-row">
                      <div className="col-5">
                        <Form.Group>
                          <Typeahead
                            id="Name"
                            name="member2"
                            labelKey="username"
                            options={this.state.userDetails}
                            onChange={this.member2Changehandler}
                            placeholder="Name"
                          />
                        </Form.Group>
                      </div>
                      <div className="col">
                        <input type="text" name="memberemail2" onChange={this.member2EmailChangehandler} className="form-control" placeholder="Email Address" />
                      </div>
                      <div className="col-10">
                        {' '}
                        <span style={{ color: 'green' }}>{this.state.error.memberEmail2Err}</span>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="col-5">
                        <Form.Group>
                          <Typeahead
                            id="Name"
                            name="member3"
                            labelKey="username"
                            options={this.state.userDetails}
                            onChange={this.member3Changehandler}
                            placeholder="Name"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-7">
                        <input type="text" name="memberemail3" onChange={this.member3EmailChangehandler} className="form-control" placeholder="Email Address" />
                      </div>
                      <div className="col-10">
                        {' '}
                        <span style={{ color: 'green' }}>{this.state.error.memberEmail3Err}</span>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="col-5">
                        <Form.Group>
                          <Typeahead
                            id="Name"
                            name="member4"
                            labelKey="username"
                            options={this.state.userDetails}
                            onChange={this.member4Changehandler}
                            placeholder="Name"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-7">
                        <input type="text" name="memberemail4" onChange={this.member4EmailChangehandler} className="form-control" placeholder="Email Address" />
                      </div>
                      <div className="col-10">
                        {' '}
                        <span style={{ color: 'green' }}>{this.state.error.memberEmail4Err}</span>
                      </div>

                    </div>
                  </div>
                </Form.Group>
                <button type="button" onClick={this.onSave} className="btn btn-success">Create Group</button>
              </div>
            </Col>
            <Col xs={{ order: 'first' }} md={4}>
              <img src={this.state.groupImage} alt="Gropu Pic" />
              <Form.Group controlId="formCategory4">
                <Form.Label>Group Image</Form.Label>
                <Form.Control type="file" name="groupImage" onChange={this.groupImageChangeHandler} />
              </Form.Group>

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

group.propTypes = {
  details: PropTypes.object.isRequired,
  groupCreate: PropTypes.func.isRequired,
  groupcreated: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,

};

const mapStateToProps = (state) => ({
  groupcreated: state.groupvalidation.groupcreated,
  details: state.information,
  error: state.groupvalidation.error,
});

export default connect(mapStateToProps, { groupCreate })(group);
