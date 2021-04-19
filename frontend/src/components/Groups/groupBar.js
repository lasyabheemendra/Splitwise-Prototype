/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { useParams } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navbar, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { addExpense } from '../../actions/expenseAction';

class GroupBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      description: '',
      amount: '',
      message: '',
      redirect: '',
      addexpense: false,
      leave: false,
    };
  }

  componentDidMount() {
    this.showAddexpense();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.groupinfo.numberOfMembers !== this.props.groupinfo.numberOfMembers) {
      this.showAddexpense();
    }
  }

  showAddexpense = () => {
    if (this.props.groupinfo.numberOfMembers > 1) {
      this.setState({ addexpense: true });
    }
  }

  showModal = () => {
    this.setState({ isOpen: true });
  };

  hideModal = () => {
    this.setState({ isOpen: false });
  };

 changeValue = (e) => {
   this.setState({ description: e.target.value });
 };

 setAmount = (e) => {
   this.setState({ amount: e });
 };

  addExpense = (e) => {
    e.preventDefault();
    if (!this.state.description) {
      this.setState({ message: 'Description is required!' });
    }
    if (!this.state.amount) {
      this.setState({ message: 'Amount is required!' });
    }
    if (this.state.description && this.state.amount) {
      const data = {
        groupname: this.props.groupinfo.groupName,
        NOM: this.props.groupinfo.numberOfMembers,
        description: this.state.description,
        amount: this.state.amount,
        paidby: this.props.details.username,
        paidbyemail: this.props.details.useremail,
      };
      this.props.addExpense(data);
      this.hideModal();
      this.setState({ description: '', amount: '' });
    }
  };

  render() {
    return (
      <div>
        <Navbar bg="light" variant="light">
          <Navbar.Collapse className="justify-content-start">
            <img alt="group" src="https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-ruby8-house-50px.png" />
            <h1 className="font-weight-bold">{this.props.groupinfo.groupName}</h1>

          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Button variant="warning" className="btn btn-success mr-4" onClick={this.showModal} disabled={!this.state.addexpense}>Add an expense</Button>
            <Button variant="warning" className="btn btn-success mr-4" onClick={this.leaveGroup}>Leave Group</Button>

            <Button variant="info">Edit group details</Button>

          </Navbar.Collapse>
        </Navbar>
        <Modal show={this.state.isOpen} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <div>
              <Modal.Title className="alert alert-info">
                Add an expense

              </Modal.Title>
            </div>

          </Modal.Header>
          <Modal.Body>
            <div>
              {this.state.message && (
              <p className="alert alert-success">
                {' '}
                {this.state.message }
                {' '}
              </p>
              )}
            </div>
            <div className="input-group-prepend">
              <span className="input-group-text">Description</span>
              <input type="text" value={this.state.description} className="form-control" aria-label="Amount (to the nearest dollar)" onChange={this.changeValue} />
            </div>
            <br />
            <div className="input-group-prepend">
              <span className="input-group-text">$</span>
              <input type="number" value={this.state.amount} className="form-control" placeholder="Amount" aria-label="amount" aria-describedby="basic-addon1" onChange={(e) => this.setAmount(e.target.value)} />
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.addExpense}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

GroupBar.propTypes = {
  groupinfo: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  addExpense: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
  details: state.information,
  groupinfo: state.groupinformation,
});

export default connect(mapStateToProps, { addExpense })(GroupBar);
