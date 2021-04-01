/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

class Members extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      memberName: [],
    };
  }

  componentDidMount() {
    axios.get('http://54.215.128.119:3001/allUsers')
      .then((response) => {
        for (let i = 0; i < response.data.length; i += 1) {
          this.setState({

            // eslint-disable-next-line react/no-access-state-in-setstate
            memberName: [...this.state.memberName, response.data[i].userName],

          });
        }
      });
  }

  render() {
    return (
      <div className="container">
        <div className="form-row">

          <div className="col-5">
            <Form.Group>
              <Typeahead
                id="Name"
                options={this.state.memberName}
                placeholder="Name"
              />
            </Form.Group>
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Email Address" />
          </div>
        </div>
        <br />
        <div className="form-row">
          <div className="col-5">
            <Form.Group>
              <Typeahead
                id="Name"
                options={this.state.memberName}
                placeholder="Name"
              />
            </Form.Group>
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Email Address" />
          </div>
        </div>
        <br />
        <div className="form-row">
          <div className="col-5">
            <Form.Group>
              <Typeahead
                id="Name"
                options={this.state.memberName}
                placeholder="Name"
              />
            </Form.Group>
          </div>
          <div className="col-7">
            <input type="text" className="form-control" placeholder="Email Address" />
          </div>
        </div>
        <br />
        <div className="form-row">
          <div className="col-5">
            <Form.Group>
              <Typeahead
                id="Name"
                options={this.state.memberName}
                placeholder="Name"
              />
            </Form.Group>
          </div>
          <div className="col-7">
            <input type="text" className="form-control" placeholder="Email Address" />
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default Members;
