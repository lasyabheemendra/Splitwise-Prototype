/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
function GroupBar({ getExpenses, leaveGroup, showButton }) {
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [addexpense, setaddexpense] = useState(false);
  const [redirect, setRedirect] = useState('');
  const [leave, setLeave] = useState(false);

  useEffect(() => {
    console.log(params);
    const data = { groupName: params.Name };
    axios.post('http://localhost:3001/getacceptedmembers', data)
      .then((response) => {
        console.log(response);
        if (response.data[0].numberOfMemebers > 1) {
          console.log('is it coming here');
          setaddexpense(true);
        }
      }).catch(() => {
        console.log('response is not recieved from expense API');
      });
  }, []);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const changeValue = (e) => {
    setDescription(e.target.value);
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!description) {
      setMessage('Description is required!');
    }
    if (!amount) {
      setMessage('Amount is required!');
    }
    if (description && amount) {
      const data = { GroupName: params.Name, Description: description, Amount: amount };
      axios.post('http://localhost:3001/grouppage', data)
        .then((response) => {
          if (response.data === 'Successfully added expense and updated member Balance') {
            hideModal();
            setDescription('');
            setAmount('');
            setMessage('');
            getExpenses();
          } else {
            setMessage(response.data);
          }
        })
        .catch(() => {
          console.log('response is not recieved');
        });
    }
  };

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Navbar.Collapse className="justify-content-start">
          <img alt="group" src="https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-ruby8-house-50px.png" />
          <h1 className="font-weight-bold">{params.Name}</h1>

        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Button variant="warning" className="btn btn-success mr-4" onClick={showModal} disabled={!addexpense}>Add an expense</Button>
          <Button variant="warning" className="btn btn-success mr-4" onClick={leaveGroup}>Leave Group</Button>

          <Button variant="info">Edit group details</Button>

        </Navbar.Collapse>
      </Navbar>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header closeButton>
          <div>
            <Modal.Title className="alert alert-info">
              Add an expense

            </Modal.Title>
          </div>

        </Modal.Header>
        <Modal.Body>
          <div>
            {message && (
            <p className="alert alert-success">
              {' '}
              {message }
              {' '}
            </p>
            )}
          </div>
          <div className="input-group-prepend">
            <span className="input-group-text">Description</span>
            <input type="text" value={description} className="form-control" aria-label="Amount (to the nearest dollar)" onChange={changeValue} />
          </div>
          <br />
          <div className="input-group-prepend">
            <span className="input-group-text">$</span>
            <input type="number" value={amount} className="form-control" placeholder="Amount" aria-label="amount" aria-describedby="basic-addon1" onChange={(e) => setAmount(e.target.value)} />
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={addExpense}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default (GroupBar);
