/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { userProfileUpdate } from '../../actions/profileAction';
import NavHomeBar from '../DashBoard/NavHomeBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import DefaultProfilePic from './profile.png';

class UserProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      useremail: null,
      phonenumber: null,
      redirect: null,
      currency: null,
      timezone: null,
      language: null,
      selectedfile: '',
    };
  }

  componentDidMount = () => {
    this.setState({
      userID: this.props.details.userID,
      username: this.props.details.username,
      useremail: this.props.details.useremail,
      phonenumber: this.props.details.phonenumber,
      currency: this.props.details.currency,
      timezone: this.props.details.timezone,
      language: this.props.details.language,
      selectedfile: '',
    });
  }

  // username change handler to update state variable with the text entered by the user
  usernameChangehandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  // username change handler to update state variable with the text entered by the user
  useremailChangehandler = (e) => {
    this.setState({
      useremail: e.target.value,
    });
  };

  // username change handler to update state variable with the text entered by the user
  phonenumberChangeHandler = (e) => {
    this.setState({
      phonenumber: e.target.value,
    });
  };

  currencyChangehandler = (e) => {
    this.setState({
      currency: e.target.value,
    });
  };

  timezoneChangeHandler = (e) => {
    this.setState({
      timezone: e.target.value,
    });
  };

  languageChangeHandler = (e) => {
    this.setState({
      language: e.target.value,
    });
  };

  storeImage = (e) => {
    console.log(e.target.files[0]);
    this.setState({ selectedfile: e.target.files[0] });
  }

  validation = (data) => {
    let flag = true;
    const emailpattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    const namepattern = new RegExp(/^[ A-Za-z]+$/);
    const phonepattern = new RegExp(/^[0-9+-]+$/);
    if (!emailpattern.test(data.useremail) && data.useremail !== '') {
      this.setState({
        message: 'Enter valid email Address',
      });
      flag = false;
    }
    if (!namepattern.test(data.username) && data.username !== null) {
      this.setState({
        message: 'Name can contain only letters and spaces',
      });
      flag = false;
    }
    if (!phonepattern.test(data.phonenumber) && data.phonenumber !== ''
     && data.phonenumber !== null) {
      this.setState({
        message: 'Phone number can contain only digits ,"+","-"',
      });
      flag = false;
    }
    return flag;
  }

  saveChanges = (e) => {
    // prevent page from refresh
    e.preventDefault();
    const data = {
      _id: this.state.userID,
      username: this.state.username,
      useremail: this.state.useremail,
      phonenumber: this.state.phonenumber,
      currency: this.state.currency,
      timezone: this.state.timezone,
      language: this.state.language,
    };
    // data = this.removeEmptyFields(data);
    console.log(data);
    if (!this.validation(data)) {
      this.setState({
        redirect: '/userprofile',
      });
    } else {
      this.props.userProfileUpdate(data);
      this.setState({
        redirect: '/dashboard',
      });
    }
    // make a post request with the user data
  }

  render() {
    let redirectVar = null;
    console.log(this.state.redirect);
    if (this.state.redirect) {
      redirectVar = <Redirect to={this.state.redirect} />;
    }
    if (!this.props.loggedIn) {
      redirectVar = <Redirect to="/" />;
    }
    const profileImage = DefaultProfilePic;

    return (
      <div id="centre_container">
        {redirectVar}
        <NavHomeBar />

        <Container>
          {this.state.message && (
          <p className="alert alert-success">
            {' '}
            {this.state.message }
            {' '}
          </p>
          )}
          <Row>

            <Col xs={{ order: 'last' }} md={4}>
              <br />
              <br />
              <div>
                <Form.Label>Your default currency</Form.Label>
                <div className="form-group">
                  <select className="selectpicker" value={this.state.currency} name="user[default_currency]" data-width="fit" onChange={this.currencyChangehandler}>
                    <option value="$">USD$</option>
                    <option value="KWD">KWD(KWD)</option>
                    <option value="BD">BHD(BD)</option>
                    <option value="£">GBP(£)</option>
                    <option value="€">EUR(€)</option>
                    <option value="$">CAD($)</option>
                  </select>
                </div>
              </div>
              <div>
                <Form.Label>Your time zone</Form.Label>
                <div className="form-group">
                  <select onChange={this.timezoneChangeHandler} value={this.state.timezone} name="timezone_offset" id="timezone-offset" className="selectpicker" data-width="fit">
                    <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                    <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                    <option value="-10:00">(GMT -10:00) Hawaii</option>
                    <option value="-09:50">(GMT -9:30) Taiohae</option>
                    <option value="-09:00">(GMT -9:00) Alaska</option>
                    <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                    <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                    <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                    <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                    <option value="-04:50">(GMT -4:30) Caracas</option>
                    <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                    <option value="-03:50">(GMT -3:30) Newfoundland</option>
                    <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                    <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                    <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                    <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                    <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                    <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                    <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                    <option value="+03:50">(GMT +3:30) Tehran</option>
                    <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                    <option value="+04:50">(GMT +4:30) Kabul</option>
                    <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                    <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                    <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                    <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                    <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                    <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                    <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                    <option value="+08:75">(GMT +8:45) Eucla</option>
                    <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                    <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                    <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                    <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                    <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                    <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                    <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                    <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                    <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                    <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
                  </select>
                </div>
              </div>
              <div>
                <Form.Label>Language</Form.Label>
                <div className="form-group">
                  <select className="selectpicker" value={this.state.language} data-width="fit" onChange={this.languageChangeHandler}>
                    <option value="English">English</option>
                    <option value="Español">Español</option>
                    <option value="French">French</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Mandarin">Mandarin</option>
                  </select>
                </div>
              </div>

            </Col>
            <Col xs md={4} ms={4}>
              <br />
              <br />
              <Form>
                <Form.Group controlId="formCategory1">
                  <Form.Label>Your name</Form.Label>
                  <Form.Control type="text" placeholder="Enter Your Name" onChange={this.usernameChangehandler} value={this.state.username} />
                </Form.Group>
                <Form.Group controlId="formGroupEmail">
                  <Form.Label>
                    Your email address

                  </Form.Label>

                  <span className="input-group-text" id="basic-addon2">
                    <Form.Control type="email" placeholder="Enter email" onChange={this.useremailChangehandler} value={this.state.useremail} />
                    @example.com
                  </span>

                </Form.Group>

                <Form.Group controlId="formGroupPassword">
                  <Form.Label>Your phone number</Form.Label>
                  <Form.Control type="Phonenumber" placeholder="Enter Phonenumber" onChange={this.phonenumberChangeHandler} value={this.state.phonenumber} />
                </Form.Group>

              </Form>

            </Col>
            <Col xs={{ order: 'first' }} md={4}>
              <h1>Your Profile</h1>
              <img src={profileImage} alt="Profile Pic" />
              <form controlId="formCategory4">
                <lable>Profile Image</lable>
                <input type="file" id="file" name="file" onChange={this.storeImage} />
              </form>
            </Col>
          </Row>
          <Row>

            <div className="col align-self-end" />
            <button type="button" className="btn btn-success" onClick={this.saveChanges}>Update Profile</button>
          </Row>
        </Container>
      </div>
    );
  }
}
UserProfile.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  details: PropTypes.object.isRequired,
  userProfileUpdate: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
  loggedIn: state.validation.loggedIn,
  details: state.information,
});

export default connect(mapStateToProps, { userProfileUpdate })(UserProfile);
