/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import numeral from 'numeral';
import NavHomeBar from '../DashBoard/NavHomeBar';
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
    axios.get('http://54.215.128.119:3001/navbar')
      .then((response) => {
      // update the state with the response data
        this.setState({
          username: response.data[0],
          userCurrency: response.data[1],

        });
      });
    const data = { groupName: this.props.match.params.Name };
    axios.post('http://54.215.128.119:3001/getacceptedmembers', data)
      .then((response) => {
        if (response.data[0].numberOfMemebers > 1) {
          this.setState({ acceptedMembers: true });
        }
      }).catch(() => {
        console.log('response is not recieved from expense API');
      });
    this.getExpenses();
  }

  getExpenses = () => {
    const data = { groupName: this.props.match.params.Name };
    this.setState({
      allExpenses: [],
    });
    axios.post('http://54.215.128.119:3001/expense', data)
      .then((response) => {
        for (let i = 0; i < response.data.length; i += 1) {
          this.setState({
            allExpenses: [...this.state.allExpenses, response.data[i]],
          });
        }
        this.getBalance();
      }).catch(() => {
        console.log('response is not recieved from expense API');
      });
  }

  getBalance= () => {
    const data = { groupName: this.props.match.params.Name };
    this.setState({
      groupBalance: [],
    });
    axios.post('http://54.215.128.119:3001/groupbalance', data)
      .then((response) => {
        console.log('response of getexpenses', response);
        for (let i = 0; i < response.data.length; i += 1) {
          if (response.data[i].balance < 0) {
            response.data[i].balance = `owes ${this.state.userCurrency}${numeral(Math.abs(response.data[i].balance)).format('0.00')}`;
            this.setState({
              groupBalance: [...this.state.groupBalance, response.data[i]],
            });
          } else {
            response.data[i].balance = `gets back ${this.state.userCurrency}${numeral(response.data[i].balance).format('0.00')}`;
            this.setState({
              groupBalance: [...this.state.groupBalance, response.data[i]],
            });
          }
        }
        console.log('group balances', this.state.groupBalance);
        if (this.state.groupBalance.length > 0) {
          this.setState({ showButton: false });
        }
        console.log(this.state.allExpenses.length);
      }, []);
  }

   leaveGroup = () => {
     const data = { groupName: this.props.match.params.Name };
     axios.post('http://54.215.128.119:3001/leavegroup', data)
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
     if (!cookie.load('cookie')) {
       redirectVar = <Redirect to="/" />;
     }
     if (this.state.redirect) {
       redirectVar = <Redirect to={this.state.redirect} />;
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
                     {this.state.groupBalance.map((data) => (
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

export default (groupPage);
