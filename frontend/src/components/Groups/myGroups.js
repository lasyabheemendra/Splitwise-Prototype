/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import { Redirect } from 'react-router';
import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { acceptGroup } from '../../actions/acceptGroup';
import NavHomeBar from '../DashBoard/NavHomeBar';

class mygroups extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      invitedGroups: [],
      allGroups: [],
      searchTerm: '',
    };
    this.multiselectRef = React.createRef();
  }

  componentDidMount() {
    this.getMygroups();
    this.getInvitedgroups();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.details.acceptedGroups !== this.props.details.acceptedGroups) {
      this.getMygroups();
    }
  }

  getInvitedgroups = () => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const data = { email: this.props.details.useremail };
    axios.post('http://localhost:3001/mygroups/invitedgroups', data)
      .then((response) => {
        for (let i = 0; i < response.data.length; i += 1) {
          this.setState({
            invitedGroups: [
              ...this.state.invitedGroups,
              response.data[i].groupName,
            ],
          });
        }
      });
  };

  // eslint-disable-next-line class-methods-use-this
  getAllgroups(filteredGroup) {
    return filteredGroup.map((mygroup) => (
      <div className="text-center-left">
        <Link to={`/grouppage/${mygroup}`}>

          <li className="list-group-item" key="{mygroup}">{mygroup}</li>

        </Link>
      </div>
    ));
  }

   getMygroups = () => {
     this.setState({ allGroups: this.props.details.acceptedGroups });
   };

   editSearchTerm = (e) => {
     this.setState({ searchTerm: e.target.value });
   }
   // eslint-disable-next-line max-len
   // dynamicSearch = () => this.state.allGroups.filter((name) => name.toLowerCase().includes(this.state.searchTerm.toLowerCase()));

    onAccept = async () => {
    // By calling the belowe method will get the selected values programatically
      const data = {};
      data.useremail = this.props.details.useremail;
      data.groups = this.multiselectRef.current.getSelectedItems();

      await this.props.acceptGroup(data);
      await this.multiselectRef.current.resetSelectedValues();
      await this.setState({
        invitedGroups: this.state.invitedGroups.filter(
          (el) => !data.groups.includes(el),
        ),
      });
    };

    dynamicSearch() {
      const filteredGroup = this.state.allGroups.filter((name) => name.toLowerCase()
        .includes(this.state.searchTerm.toLowerCase()));
      return this.getAllgroups(filteredGroup);
    }

    render() {
      let redirectVar = null;
      if (!localStorage.getItem('token')) {
        redirectVar = <Redirect to="/" />;
      }
      return (
        <div>
          {redirectVar}
          <NavHomeBar />
          <h1>My Groups</h1>
          <br />
          <Container>
            <Row>
              {' '}
              <h5>List of groups you are invited to</h5>
            </Row>
            <Row>
              <Col xs={{ order: 'first' }} md={8}>
                <div>
                  <Form.Group />

                  <Multiselect
                    options={this.state.invitedGroups}
                    isObject={false}
                    ref={this.multiselectRef}
                    showCheckbox
                    placeholder="Select group names from the invited groups"
                    closeOnSelect={false}
                  />
                </div>
              </Col>
              <Col xs={{ order: 'last' }} md={4}>
                {' '}
                <div className="vertical-center">
                  <button
                    type="button"
                    onClick={this.onAccept}
                    className="btn btn-success"
                  >
                    Accept Invites
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
          <br />
          <Container>
            <Row>
              <h5>Your Groups: </h5>
            </Row>
            <Row>
              <Col xs={{ order: 'first' }} md={8}>
                <div>
                  <input type="text" value={this.state.searchTerm} onChange={this.editSearchTerm} placeholder="Search for a name!" />
                </div>
                <br />
                <div>
                  {this.state.allGroups.length < 1
                  && (
                  <p className="alert alert-success">
                    {' '}
                    You are not part of any group yet!!!
                    {' '}
                  </p>
                  )}
                  {this.dynamicSearch()}
                </div>
              </Col>

            </Row>
          </Container>
        </div>
      );
    }
}
mygroups.propTypes = {
  details: PropTypes.string.isRequired,
  acceptGroup: PropTypes.func.isRequired,
  acceptederror: PropTypes.bool.isRequired,

};

const mapStateToProps = (state) => ({
  details: state.information,
  acceptederror: state.groupdetails.acceptederror,
});
export default connect(mapStateToProps, { acceptGroup })(mygroups);
