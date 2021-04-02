/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import { Redirect } from 'react-router';
import axios from 'axios';
import cookie from 'react-cookies';
import { Multiselect } from 'multiselect-react-dropdown';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import NavHomeBar from '../DashBoard/NavHomeBar';

class mygroups extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      invitedGroups: [],
      allGroups: [],
      loading: true,
      searchTerm: '',
    };
    this.multiselectRef = React.createRef();
  }

  componentDidMount() {
    this.getInvitedgroups();
    this.getMygroups();
  }

  getInvitedgroups = () => {
    axios.get('http://localhost:3001/mygroups').then((response) => {
      for (let i = 0; i < response.data.length; i += 1) {
        this.setState({
          invitedGroups: [
            ...this.state.invitedGroups,
            response.data[i].group_name,
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
     this.setState({
       loading: true,
       allGroups: [],
     });
     axios.get('http://localhost:3001/myallgroups').then((response) => {
       for (let i = 0; i < response.data.length; i += 1) {
         this.setState({
           loading: false,
           allGroups: [...this.state.allGroups, response.data[i].group_name],
         });
       }
     }, []);
   };

   editSearchTerm = (e) => {
     this.setState({ searchTerm: e.target.value });
   }

   // eslint-disable-next-line max-len
   // dynamicSearch = () => this.state.allGroups.filter((name) => name.toLowerCase().includes(this.state.searchTerm.toLowerCase()));

    onAccept = () => {
    // By calling the belowe method will get the selected values programatically
      const data = this.multiselectRef.current.getSelectedItems();
      axios.post('http://localhost:3001/mygroups', data).then((response) => {
        if (response.status === 200) {
          this.multiselectRef.current.resetSelectedValues();
          this.setState({
            invitedGroups: this.state.invitedGroups.filter(
              (el) => !data.includes(el),
            ),
          });
          this.getMygroups();
        }
      });
    };

    dynamicSearch() {
      const filteredGroup = this.state.allGroups.filter((name) => name.toLowerCase()
        .includes(this.state.searchTerm.toLowerCase()));
      return this.getAllgroups(filteredGroup);
    }

    render() {
      let loaded = null;
      if (this.state.loading) {
        loaded = this.state.loading;
      }
      let redirectVar = null;
      if (!cookie.load('cookie')) {
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
                  {this.dynamicSearch()}
                </div>
                {loaded && (

                  <div
                    style={{
                      width: '100%',
                      height: '100',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
                  </div>

                )}
              </Col>

            </Row>
          </Container>
        </div>
      );
    }
}
export default mygroups;
