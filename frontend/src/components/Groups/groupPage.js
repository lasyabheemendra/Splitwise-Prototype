/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Form, Button,
} from 'react-bootstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import numeral from 'numeral';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clone from 'lodash.clone';
import { Link } from 'react-router-dom';
import NavHomeBar from '../DashBoard/NavHomeBar';
import { getMemberInfo } from '../../actions/groupInfoAction';
import { addExpenseComment } from '../../actions/commentAction';
import SideBar from '../SideBar/SideBar';
import GroupBar from './groupBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

class groupPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allExpenses: '',
      columns: [{
        dataField: 'paidOn',
        text: 'Paid ON',
      }, {
        dataField: 'name',
        text: 'Expense Name',
      },
      {
        dataField: 'paidBy',
        text: 'Paid BY',
      }, {
        dataField: 'amount',
        text: 'Amount Paid',
      }],
      groupBalance: [],
      acceptedMembers: false,
      userCurrency: '',
      redirect: '',
      showButton: true,
      message: '',
      shownote: false,
      showid: '',
      open: false,
    };
  }

  componentDidMount() {
    this.setState({
      username: this.props.details.username,
      userCurrency: this.props.details.currency,

    });
    this.getmemberInfo();
    this.getacceptedMembers();
    this.getExpenses();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.groupinfo.numberOfMembers !== this.props.groupinfo.numberOfMembers) {
      this.getacceptedMembers();
    }
    if (prevProps.groupinfo.expenses !== this.props.groupinfo.expenses) {
      this.getExpenses();
    }
  }

  getacceptedMembers = () => {
    if (this.props.groupinfo.numberOfMembers > 1) {
      this.setState({ acceptedMembers: true });
    }
  }

  getmemberInfo = () => {
    const data = { groupName: this.props.match.params.Name };
    this.props.getMemberInfo(data);
  }

  getExpenses = async () => {
    await this.setState({
      allExpenses: _.reverse(this.props.groupinfo.expenses),
    });
    await this.getBalance();
  }

  getBalance= () => {
    this.setState({
      groupBalance: [],
    });
    const tempGroupBalanceShow = [];
    const tempGroupBalance = clone(this.props.groupinfo.members);
    for (let i = 0; i < tempGroupBalance.length; i += 1) {
      if (tempGroupBalance[i].balance < 0) {
        tempGroupBalance[i].balance = `owes ${this.props.details.currency}${numeral(Math.abs(tempGroupBalance[i].balance)).format('0.00')}`;
        tempGroupBalanceShow.push(tempGroupBalance[i]);
      } else if (tempGroupBalance[i].balance > 0) {
        tempGroupBalance[i].balance = `gets back ${this.props.details.currency}${numeral(tempGroupBalance[i].balance).format('0.00')}`;
        tempGroupBalanceShow.push(tempGroupBalance[i]);
      }
    }
    this.setState({
      groupBalance: tempGroupBalanceShow,
    });
    console.log('group balances 1', this.state.groupBalance);
    if (this.state.groupBalance.length > 0) {
      this.setState({ showButton: false });
    }
  }

   leaveGroup = () => {
     const data = { groupName: this.props.match.params.Name };
     axios.post('http://localhost:3001/leavegroup', data)
       .then((response) => {
         if (response.data !== 'Cant leave Group Now!') {
           // eslint-disable-next-line quotes
           this.setState({ redirect: "/dashboard" });
         } else {
           this.setState({ message: 'Please clear dues before leaving group!' });
         }
       }).catch(() => {
         console.log('user did not leave group');
       });
   };

  showNotes = (id) => {
    console.log('id----', id);
    this.setState({ showid: id });
  }

  notetexthandler = (e) => {
    this.setState({ notetext: e.target.value });
  }

  addNotes = async (id) => {
    const data = {
      group: this.props.match.params.Name,
      expenseID: id,
      noteBy: this.props.details.userID,
      noteText: this.state.notetext,
    };
    console.log('Add note data', data);
    this.props.addExpenseComment(data);
  }

  deleteNote = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAgree = () => {
    console.log('I agree!');
    this.handleClose();
  };

  handleDisagree = () => {
    console.log('I do not agree.');
    this.handleClose();
  };

  showExpense() {
    console.log('this.state.allExpenses', this.state.allExpenses);
    return this.state.allExpenses.map((expense) => (
      <div key={expense._id}>
        <div className="row pb-1 border-bottom">
          <div className="col" style={{ paddingTop: '0.4rem' }}>
            <p>{expense.paidOn}</p>

          </div>
          <div className="col" style={{ paddingTop: '0.2rem' }}>
            <p>{expense.name}</p>
          </div>
          <div>
            <p style={{ color: 'grey', size: '8px' }}>
              {expense.paidBy[0].username}
              --Paid
            </p>
          </div>
          <div className="col" style={{ paddingTop: '0.4rem' }}>
            <p>
              {this.props.details.currency}
              {expense.amount}
            </p>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => this.showNotes((expense._id))}
            >
              Note
            </button>
          </div>

        </div>
        { this.state.showid === expense._id
         && (
         <div>
           <div>
             <span style={{ color: 'grey' }}>NOTES AND COMMENTS</span>
             <div>
               {expense.notes.map((note) => (
                 <div className="row pb-1 border-bottom">
                   <div className="col">
                     <h6>
                       <i>
                         {note.noteby.username}
                       </i>
                     </h6>
                   </div>
                   <div className="col" style={{ paddingTop: '0.2rem' }}>
                     <p>
                       {note.noteText}
                     </p>
                   </div>
                   <div className="col" style={{ paddingTop: '0.2rem' }}>
                     <a className="delete_comment" style={{ color: 'red' }} onClick={this.deleteNote}>X</a>
                     <Dialog
                       open={this.state.open}
                       onClose={this.handleClose}
                       BackdropProps={{ invisible: true }}
                     >
                       <DialogTitle id="alert-dialog-title">
                         Deletion Alert
                       </DialogTitle>
                       <DialogContent>
                         <DialogContentText id="alert-dialog-description">
                           Are you sure you want to delete Note?
                         </DialogContentText>
                       </DialogContent>
                       <DialogActions>
                         <Button onClick={this.handleDisagree} color="primary">
                           Disagree
                         </Button>
                         <Button onClick={this.handleAgree} color="primary" autoFocus>
                           Agree
                         </Button>
                       </DialogActions>
                     </Dialog>
                   </div>

                 </div>
               ))}
             </div>
             <div>
               <Form.Group>
                 <Form.Control type="text" placeholder="Add a comment" onChange={this.notetexthandler} />
                 <br />
                 <Button onClick={() => this.addNotes((expense._id))}> Post </Button>
               </Form.Group>
             </div>
           </div>
         </div>
         )}

      </div>
    ));
  }

  render() {
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div id="centre_container">
        {redirectVar}
        <NavHomeBar />

        <Container>
          <Row>

            <Col xs={{ order: 'last' }} md={2} className="d-flex">
              <br />
              <div className="d-inline-flex p-2 bd-highlight">
                <div className="border border-dark" width="100%">
                  <div className="bg-info border-right" id="sidebar-wrapper">
                    <p>
                      {' '}
                      <b> GROUP BALANCES </b>
                    </p>
                  </div>
                  <div>
                    {this.state.groupBalance && this.state.groupBalance.map((data) => (
                      <div key={data._id}>
                        <p>
                          <strong>
                            <i>
                              {' '}
                              {data.userID.username}
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
            <Col xs md={8} ms={4}>
              <div>
                {this.state.message
                 && <b><span style={{ color: 'red' }}>{this.state.message}</span></b>}
                <GroupBar
                  getExpenses={this.getExpenses}
                  leaveGroup={this.leaveGroup}
                  showButton={this.state.showButton}
                />
                {!this.state.acceptedMembers
                && <p><b><span style={{ color: 'green' }}> there are no accepted members in this Group to share expenses!</span></b></p>}

                {this.state.allExpenses.length === 0
                && (
                <div>
                  <p><b><span style={{ color: 'green' }}> You are all settled up in this group!</span></b></p>

                </div>
                )}

                {this.state.allExpenses.length !== 0
                && (
                  this.showExpense()
                )}

              </div>

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

groupPage.propTypes = {
  details: PropTypes.string.isRequired,
  getMemberInfo: PropTypes.func.isRequired,
  groupinfo: PropTypes.object.isRequired,
  addExpenseComment: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
  details: state.information,
  groupinfo: state.groupinformation,
});

export default connect(mapStateToProps, { getMemberInfo, addExpenseComment })(groupPage);
