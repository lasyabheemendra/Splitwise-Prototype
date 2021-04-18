/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavHomeBar from '../DashBoard/NavHomeBar';
import { getMemberInfo } from '../../actions/groupInfoAction';
import SideBar from '../SideBar/SideBar';
import GroupBar from './groupBar';

class groupPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allExpenses: '',
      columns: [{
        dataField: 'paid_on',
        text: 'Paid ON',
      }, {
        dataField: 'expense_name',
        text: 'Expense Name',
      },
      {
        dataField: 'paid_by',
        text: 'Paid BY',
      }, {
        dataField: 'amount_paid',
        text: 'Amount Paid',
      }],
      groupBalance: [],
      acceptedMembers: false,
      userCurrency: '',
      redirect: '',
      showButton: true,
      message: '',
    };
  }

  componentDidMount() {
    this.setState({
      username: this.props.details.username,
      userCurrency: this.props.details.currency,

    });
    this.getmemberInfo();
    this.getExpenses();
  }

  getmemberInfo = () => {
    const data = { groupName: this.props.match.params.Name };
    this.props.getMemberInfo(data);
  }

  getExpenses = () => {
    this.setState({
      allExpenses: this.props.groupinfo.expenses,
    });
    this.getBalance();
  }

  getBalance= () => {
    this.setState({
      groupBalance: [],
    });
    for (let i = 0; i < this.props.groupinfo.members.length; i += 1) {
      if (this.props.groupinfo.members[i].balance < 0) {
        this.props.groupinfo.members[i].balance = `owes ${this.props.details.currency}${numeral(Math.abs(this.props.groupinfo.members[i].balance)).format('0.00')}`;
        this.setState({
          groupBalance: [...this.state.groupBalance, this.props.groupinfo.members[i]],
        });
      } else {
        this.props.groupinfo.members[i].balance = `gets back ${this.props.details.currency}${numeral(this.props.groupinfo.members[i].balance).format('0.00')}`;
        this.setState({
          groupBalance: [...this.state.groupBalance, this.props.groupinfo.members[i]],
        });
      }
    }
    console.log('group balances', this.state.groupBalance);
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

   render() {
     let redirectVar = null;
     if (!localStorage.getItem('token')) {
       redirectVar = <Redirect to="/" />;
     }
     console.log('group balances inside render', this.state.groupBalance);
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
                <BootstrapTable
                  striped
                  hover
                  keyField="expense_name"
                  data={this.state.allExpenses}
                  columns={this.state.columns}
                />
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

};

const mapStateToProps = (state) => ({
  details: state.information,
  groupinfo: state.groupinformation,
});

export default connect(mapStateToProps, { getMemberInfo })(groupPage);
