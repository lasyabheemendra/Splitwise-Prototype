/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import cookie from 'react-cookies';
import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead';
import NavHomeBar from '../DashBoard/NavHomeBar';
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
        groupnameError: '', memberEmail1Err: '', memberEmail2Err: '', memberEmail3Err: '', memberEmail4Err: '',
      },
    };
  }

  componentDidMount() {
    axios.get('http://localhost:3001/newgroup')
      .then((response) => {
        console.log(response);
        // update the state with the response data
        this.setState({
          defaultmember: response.data,
        });
      });

    axios.get('http://localhost:3001/allUsers')
      .then((response) => {
        console.log(response);
        for (let i = 0; i < response.data.length; i += 1) {
          this.setState({
            allUseremail: [...this.state.allUseremail, response.data[i].userEmail],
            userDetails: [...this.state.userDetails, response.data[i]],
          });
        }
        console.log('this is userDetails', this.state.userDetails);
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
      this.setState({
        memberName1: selectedValue[0].userName,
        memberEmail1: selectedValue[0].userEmail,
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
      this.setState({
        memberName2: selectedValue[0].userName,
        memberEmail2: selectedValue[0].userEmail,
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
      this.setState({
        memberName3: selectedValue[0].userName,
        memberEmail3: selectedValue[0].userEmail,
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
      this.setState({
        memberName4: selectedValue[0].userName,
        memberEmail4: selectedValue[0].userEmail,
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
    if (data.groupname === null) {
      allValid = false;
      this.setState({
        error: {
          groupnameError: 'Group Name cannot be blank',
        },

      });
    }
    if (!data.useremail1 && !data.useremail2 && !data.useremail3 && !data.useremail4) {
      allValid = false;
      this.setState({
        error: {
          memberEmail4Err: 'Please add atleast one group member',
        },

      });
    }
    if (data.useremail1 && !this.state.allUseremail.includes(data.useremail1)) {
      allValid = false;
      this.setState({
        error: { memberEmail1Err: 'email address entered in first field is not valid' },
      });
    }
    if (data.useremail2 && !this.state.allUseremail.includes(data.useremail2)) {
      allValid = false;
      this.setState({
        error: { memberEmail2Err: 'email address entered in second field is not valid' },
      });
    }
    if (data.useremail3 && !this.state.allUseremail.includes(data.useremail3)) {
      allValid = false;
      this.setState({
        error: { memberEmail3Err: 'email address entered in third field is not valid' },
      });
    }
    if (data.useremail4 && !this.state.allUseremail.includes(data.useremail4)) {
      allValid = false;
      this.setState({
        error: { memberEmail4Err: 'email address entered in fourth field is not valid' },
      });
    }
    if (allValid) {
      this.setState({
        error: {
          groupnameError: '', memberEmail1Err: '', memberEmail2Err: '', memberEmail3Err: '', memberEmail4Err: '',
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
    };
    const count = 1;
    if (this.state.memberEmail1) {
      data.useremail1 = this.state.memberEmail1;
    }
    if (this.state.memberEmail2) {
      data.useremail2 = this.state.memberEmail2;
    }
    if (this.state.memberEmail3) {
      data.useremail3 = this.state.memberEmail3;
    }
    if (this.state.memberEmail4) {
      data.useremail4 = this.state.memberEmail4;
    }
    data.count = count;
    console.log(data);
    console.log(this.state.error);
    if (this.verifyEmailID(data)) {
      console.log(this.state.error);
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data
      axios.post('http://localhost:3001/newGroup', data)
        .then((response) => {
          if (response.data === 'ok') {
            this.setState({
              // eslint-disable-next-line quotes
              redirect: "/dashboard",
            });
          } else {
            this.setState({
              error: {
                groupnameError: 'Please enter unique Group Name!',
              },
            });
          }
        }).catch(() => {
          console.log('response is not recieved');
        });
    } else {
      console.log('emails are invalid');
      console.log(this.state.error);
    }
  }

  render() {
    let redirectVar = null;
    if (this.state.redirect) {
      redirectVar = <Redirect to={this.state.redirect} />;
    }
    if (!cookie.load('cookie')) {
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
                            labelKey="userName"
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
                            labelKey="userName"
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
                            labelKey="userName"
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
                            labelKey="userName"
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

export default group;
