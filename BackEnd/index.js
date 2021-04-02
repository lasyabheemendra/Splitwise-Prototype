/* eslint-disable no-multi-str */
/* eslint-disable no-console */
// import the require dependencies
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const cors = require('cors');

app.set('view engine', 'ejs');

// mysql database connection
const mysql = require('mysql');
// const e = require('express');

const db = mysql.createConnection({
  host: 'rds-mysql-splitwise.cp5mten9f2xh.us-west-1.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: 'splitwise273',
  database: 'dbsplitwise',
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

const mysqll = require('promise-mysql');

const dbConfig = {
  connectionLimit: 20, // default 10
  host: 'rds-mysql-splitwise.cp5mten9f2xh.us-west-1.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: 'splitwise273',
  database: 'dbsplitwise',
};
const pool = mysqll.createPool(dbConfig);
// use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// use express session to maintain session data
app.use(session({
  secret: 'cmpe273_kafka_passport_mongo',
  resave: false,
  saveUninitialized: true,
  duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration: 60 * 60 * 1000,
}));
app.use(express.static('public'));
app.use(bodyParser.json());
const md5 = require('md5');

let sessionUserName = '';
let sessionUserEmail = '';
let sessionCurrency = '';

// Allow Access Control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Route to  handle user signup
app.post('/signup', (req, res) => {
  console.log('Inside Login Post Request');
  console.log('Req Body : ', req.body);
  const insertsql = 'INSERT INTO userCredentials (userName,userEmail,userPassword,phoneNumber,currency,timeZone,language) VALUES ?;';
  const values = [[req.body.username, req.body.useremail, md5(req.body.password), '', '$', '-08:00', 'English']];
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(insertsql, [values]);
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('new user is not added.');
      }
      console.log('1 record inserted');
      res.cookie('cookie', results[0], { maxAge: 900000, httpOnly: false, path: '/' });

      sessionUserName = req.body.username;
      sessionUserEmail = req.body.useremail;
      sessionCurrency = req.body.currency;
      connection.commit();
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      connection.release();
      return res.end('Successful signup');
    })
    .catch((err) => {
      res.send('singnup failed');
      console.log(err);
      connection.rollback();
      connection.release();
    });
});

// Route to handle Login Request Call
app.post('/login', (req, res) => {
  const sql = 'SELECT * from userCredentials where userEmail=? and userPassword=?';
  let connection; let
    data;
  pool
    .then((conn) => {
      connection = conn.getConnection();
      return connection;
    })
    .then((conn) => {
      data = conn.query(sql, [req.body.useremail, md5(req.body.password)]);
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        res.writeHead(406, {
          'Content-Type': 'text/plain',
        });
        return res.end('Invalid credentials');
      }
      res.cookie('cookie', results[0], { maxAge: 900000, httpOnly: false, path: '/' });

      sessionUserName = results[0].userName;
      sessionUserEmail = results[0].userEmail;
      sessionCurrency = results[0].currency;
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      // connection.release();
      return res.end('Successful Login');
    })
    .catch(() => {
      res.send('error');
      // connection.release();
    });
});

// Route to handle Logout Request Call
app.post('/logout', (req, res) => {
  req.session.destroy();
  req.logout();
  res.status(200);
});

// Route to get user profile information
app.get('/userprofile', (req, res) => {
  const sql = 'SELECT u.userName,u.userEmail, u.phoneNumber, \
   u.currency, u.timeZone, u.language from userCredentials u  \
   WHERE u.userEmail = ?;';
  let connection; let
    data;
  pool
    .then((conn) => {
      connection = conn.getConnection();
      return connection;
    })
    .then((conn) => {
      data = conn.query(sql, [sessionUserEmail]);
      return data;
    })
    .then((results) => {
      console.log(JSON.stringify(results[0]));
      return res.end(JSON.stringify(results[0]));
    })
    .catch(() => {
      res.writeHead(406, {
        'Content-Type': 'application/json',
      });
      connection.release();
    });
});

// Route to handle user profile updation Request Call
app.post('/userprofile', (req, res) => {
  console.log('user profile req', req.body);
  // eslint-disable-next-line no-multi-str
  const sql = ' UPDATE userCredentials \
  SET userName= if(? is null, userName, ?), \
  userEmail= if(? is null, userEmail, ?), \
  phoneNumber=if(? is null, phoneNumber, ?), \
  currency=if(? is null, currency, ?), \
  timeZone=if(? is null, timeZone, ?), language=if(? is null,language,?) \
  where userEmail = ?;';
  const values = [req.body.username, req.body.username,
    req.body.useremail, req.body.useremail, req.body.phonenumber, req.body.phonenumber,
    req.body.currency, req.body.currency,
    req.body.timezone, req.body.timezone, req.body.language, req.body.language,
    sessionUserEmail];
  let connection; let
    data;
  pool
    .then((conn) => {
      connection = conn.getConnection();
      return connection;
    })
    .then((conn) => {
      data = conn.query(sql, values);
      return data;
    })
    // eslint-disable-next-line no-unused-vars
    .then((results) => {
      if (req.body.useremail) {
        sessionUserEmail = req.body.useremail;
      }
      if (req.body.username) {
        sessionUserName = req.body.username;
      }
      if (req.body.currency) {
        sessionCurrency = req.body.currency;
      }
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      connection.commit();
      res.end('Successful Update');
      connection.release();
    })
    .catch(() => {
      res.end();
      connection.rollback();
      connection.release();
    });
});

// Route to get all users expect logged in user
app.get('/allUsers', (req, res) => {
  const sql = 'SELECT userEmail,userName from userCredentials  WHERE userEmail NOT IN (?);';

  let connection; let
    data;
  pool
    .then((conn) => {
      connection = conn.getConnection();
      return connection;
    })
    .then((conn) => {
      data = conn.query(sql, [sessionUserEmail]);
      return data;
    })
    .then((results) => {
      console.log('Sending all users');
      return res.end(JSON.stringify(results));
    })
    .catch(() => {
      console.log('No user data found');
      connection.release();
      return res.writeHead(406, {
        'Content-Type': 'application/json',
      });
    });
});

// Route to handle new group request call
app.get('/newgroup', (req, res) => {
  res.end(`${sessionUserName}${'  ('}${sessionUserEmail})`);
});

app.post('/newgroup', (req, res) => {
  console.log('inside new group API');
  const members = [];
  if (req.body.useremail1) {
    members.push(req.body.useremail1);
  }
  if (req.body.useremail2) {
    members.push(req.body.useremail2);
  }
  if (req.body.useremail3) {
    members.push(req.body.useremail3);
  }
  if (req.body.useremail4) {
    members.push(req.body.useremail4);
  }
  const createGroupSQL = 'INSERT INTO groupDeatils (group_name,createdBy,numberOfMemebers) VALUES ?; ';
  const values = [[req.body.groupname, sessionUserEmail, req.body.count]];
  const createMembersSQL = 'INSERT INTO groupMembersDetails (group_name,memberEmail,accepted,balance,status)  VALUES ?;';
  const valuesCraeted = [[req.body.groupname, sessionUserEmail, 1, 0.0, 'NA']];
  const activitySQL = 'INSERT INTO recentActivities (action_name,action_by,action_on,group_name) VALUES (?,?,current_timestamp(),?);';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(createGroupSQL, [values]);
      return data;
    })
    .then((rows) => {
      if (rows.affectedRows === 0) {
        throw new Error('New group is not created.');
      }
      data = connection.query(createMembersSQL, [valuesCraeted]);
      return data;
    })
    .then((rows) => {
      if (rows.affectedRows === 0) {
        throw new Error('Default group member is not added.');
      }
      for (let i = 0; i < members.length; i += 1) {
        data = connection.query(createMembersSQL, [[[req.body.groupname, members[i], 0, 0.0, 'NA']]]);
      }
      return data;
    })
    .then((rows) => {
      if (rows.affectedRows === 0) {
        throw new Error('Group members are not added.');
      }
      data = connection.query(activitySQL, [`Created the group "${req.body.groupname}"`, sessionUserName, req.body.groupname]);
      return data;
    })
    .then((rows) => {
      if (rows.affectedRows === 0) {
        throw new Error('activities are not added.');
      }
      connection.commit();
      connection.release();
      return res.send('ok');
    })
    .catch((err) => {
      res.send('duplicate');
      console.log(err);
      connection.rollback();
      connection.release();
    });
});

// Route to get all invited group names
app.get('/mygroups', (req, res) => {
  const sql = 'select group_name from groupMembersDetails where accepted=0 AND memberEmail = ?;';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(sql, [sessionUserEmail]);
      return data;
    })
    .then((rows) => {
      console.log('Sending all groups');
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      connection.release();
      return res.end(JSON.stringify(rows));
    }).catch(() => {
      console.log('No group data found');
      res.writeHead(406, {
        'Content-Type': 'application/json',
      });
      connection.release();
    });
});

// Route to set all accepted group names
app.post('/mygroups', (req, res) => {
  console.log('My post groups API');
  console.log(req.body);
  const sql = 'UPDATE groupMembersDetails SET accepted=1 where group_name IN (?) and memberEmail = ?;';
  const sqlCount = 'UPDATE groupDeatils SET numberOfMemebers=numberOfMemebers+1 where group_name IN (?);';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(sql, [req.body, sessionUserEmail]);
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('Accepted value is not updated.');
      }
      connection.commit();
      data = connection.query(sqlCount, [req.body]);
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('Count is not updated.');
      }
      connection.commit();
      res.send('ok');
      connection.release();
    })
    .catch((err) => {
      res.send('error');
      console.log(err);
      connection.rollback();
      connection.release();
    });
});

// Route to get all user group name
app.get('/myallgroups', (req, res) => {
  const sql = 'select group_name from groupMembersDetails where accepted=1 AND memberEmail = ?;';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(sql, [sessionUserEmail]);
      return data;
    })
    .then((results) => {
      console.log('Sending all groups');
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end(JSON.stringify(results));
      connection.release();
    })
    .catch((err) => {
      res.writeHead(406, {
        'Content-Type': 'application/json',
      });
      console.log(err);
      connection.release();
    });
});

// Route to add expense in group page
app.post('/grouppage', (req, res) => {
  const sql = 'INSERT INTO expenses (group_name,expense_name,amount_paid,paid_by,paid_on)  VALUES (?,?,?,?,current_timestamp());';
  const procedure = 'call dbsplitwise.updateBalance(?,?,?);';
  const activitySQL = 'INSERT INTO recentActivities (action_name,action_by,action_on,group_name) VALUES (?,?,current_timestamp(),?);';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(sql, [req.body.GroupName, req.body.Description,
        req.body.Amount, sessionUserEmail]);
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('New expense is not created.');
      }
      data = connection.query(procedure, [req.body.GroupName,
        req.body.Amount, sessionUserEmail]);
      console.log('insert to balances');
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('Balance is not updated.');
      }
      data = connection.query(activitySQL, [`added "${req.body.Description}" in "${req.body.GroupName}"`, sessionUserName, req.body.GroupName]);
      console.log('insert to activity');
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('Activity is not updated.');
      }
      connection.commit();
      res.send('Successfully added expense and updated member Balance');
      connection.release();
    })
    .catch((err) => {
      res.send('Duplicate expense Name');
      console.log(err);
      connection.rollback();
      connection.release();
    });
});

// Route to get all group expenses
app.post('/expense', (req, res) => {
  const sql = 'select date_format(e.paid_on,"%d-%b-%Y") as paid_on,e.expense_name,u.userName as paid_by,CONCAT(u.currency,e.amount_paid) as amount_paid from expenses e join userCredentials u on e.paid_by=u.userEmail where e.group_name = ? ORDER BY e.paid_on desc;';
  const isGroupActive = 'select * from groupMembersDetails where group_name = ? and balance != 0.0;';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(isGroupActive, [req.body.groupName]);
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        throw new Error('No active expenses');
      } else {
        data = connection.query(sql, [req.body.groupName]);
      }
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        throw new Error('No expenses found');
      }
      res.send(JSON.stringify(results));
      connection.release();
    })
    .catch((err) => {
      console.log(err);
      connection.rollback();
      connection.release();
    });
});

// Route to get Group balances
app.post('/groupbalance', (req, res) => {
  const sql = 'select u.userName,u.currency,g.balance from groupMembersDetails g join userCredentials u on g.memberEmail = u.userEmail   where group_name = ? and accepted = 1 and balance != 0;';

  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(sql, [req.body.groupName]);
      return data;
    })
    .then((results) => {
      console.log('Sending group balances');
      res.end(JSON.stringify(results));
      connection.release();
    })
    .catch((err) => {
      console.log('No data found');
      res.writeHead(406, {
        'Content-Type': 'application/json',
      });
      console.log(err);
      connection.release();
    });
});

// Route to handle dashboard
app.get('/navbar', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  const data = [sessionUserName, sessionCurrency];
  return res.end(JSON.stringify(data));
});

// Rule to get all user balances
app.get('/dashboard', (req, res) => {
  const groupNames = [];
  // eslint-disable-next-line no-multi-str
  const sql = 'select u.userName, g3.balance, g3.status, g3.group_name \
  from groupMembersDetails g3 join userCredentials u \
  on g3.memberEmail = u.userEmail \
 where memberEmail IN (select distinct g1.memberEmail from groupMembersDetails g1 \
 where g1.group_name IN ? and accepted = 1) \
 and g3.group_name IN ? \
 group by u.username, g3.group_name;';
  const nameSQL = 'select group_name from groupMembersDetails where memberEmail = ? and accepted = 1';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(nameSQL, [sessionUserEmail]);
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        console.log('No active groups found for this user');
        data = 'No active groups found for this user';
      } else {
        for (let i = 0; i < results.length; i += 1) {
          groupNames.push(results[i].group_name);
        }
        console.log('group names', groupNames);
        data = connection.query(sql, [[groupNames], [groupNames]]);
      }
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        throw new Error('No record found in user balance');
      }
      res.send(JSON.stringify(results));
      connection.release();
    })
    .catch((err) => {
      res.send('Duplicate expense Name');
      console.log(err);
      connection.release();
    });
});

// Route to get all invited group names
app.get('/getrelatedusers', (req, res) => {
  // eslint-disable-next-line no-multi-str
  const sql = 'select distinct u.userName from groupMembersDetails g1 \
  join userCredentials u on g1.memberEmail = u.userEmail \
  where g1.group_name IN (select g2.group_name from groupMembersDetails g2 \
  where g2.memberEmail = ?) and accepted = 1 and memberEmail != ? and balance != 0;';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      data = connection.query(sql, [sessionUserEmail, sessionUserEmail]);
      console.log('it must be here');
      return data;
    })
    .then((results) => {
      console.log('is it here');
      if (results.length === 0) {
        throw new Error('No user found in user table');
      }
      res.send(JSON.stringify(results));
      connection.release();
    })
    .catch((err) => {
      console.log('or is it here');
      res.send('No user found in user table');
      console.log(err);
      connection.release();
    });
});

app.post('/settleup', (req, res) => {
  const getNamesSQL = 'select userEmail from userCredentials where userName = ?';
  const balanceSQL = 'select balance from groupMembersDetails where memberEmail = ? and group_name = ?;';
  const creditSQL = 'update groupMembersDetails set balance = ? where memberEmail = ? and group_name = ?;';
  const statusSQL = 'update groupMembersDetails set status = "NA" where balance = 0;';
  let connection; let
    data; let x; let y;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      console.log(req.body);
      data = connection.query(balanceSQL, [sessionUserEmail, req.body.otherUser.group_name]);
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        throw new Error('No user found in user table');
      }
      x = results[0].balance;
      y = req.body.otherUser.balance;
      if (x > 0) {
        if (Math.abs(y) < x) {
          x += y;
          y = 0;
        } else if (Math.abs(y) >= x) {
          y += x;
          x = 0;
        }
      } else if (x < 0) {
        if (Math.abs(x) < y) {
          y += x;
          x = 0;
        } else if (Math.abs(x) >= y) {
          x += y;
          y = 0;
        }
      }
      data = connection.query(creditSQL,
        [x, sessionUserEmail, req.body.otherUser.group_name]);

      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('logged in user credit settled');
      }
      data = connection.query(getNamesSQL,
        [req.body.otherUser.userName]);
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        throw new Error('other user id not found');
      }
      data = connection.query(creditSQL,
        [y, results[0].userEmail, req.body.otherUser.group_name]);
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('other user balance settled');
      }
      data = connection.query(statusSQL);
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        throw new Error('No status updated');
      }
      connection.commit();
      connection.release();
      return res.send(JSON.stringify(results));
    })
    .catch((err) => {
      console.log(err);
      res.send('No user found in user table');
      connection.rollback();
      connection.release();
    });
});

app.post('/getacceptedmembers', (req, res) => {
  const sql = 'select numberOfMemebers from groupDeatils where group_name = ?;';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(sql, [req.body.groupName]);
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        throw new Error('No user found in user table');
      }
      res.send(JSON.stringify(results));
      connection.release();
    })
    .catch((err) => {
      console.log(err);
      res.send('No user found in user table');
      connection.release();
    });
});
// get recent activities
app.get('/recentactivities', (req, res) => {
  const sql = 'select  action_id, date_format(action_on,"%d-%b-%Y") as actionon,action_by , \
  action_name,group_name from recentActivities \
  where group_name IN (select group_name from groupMembersDetails \
  where memberEmail=?) \
  order by action_on desc;';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(sql, [sessionUserEmail]);
      return data;
    })
    .then((results) => {
      if (results.length === 0) {
        return res.send('No recent activities found');
      }
      connection.release();
      return res.send(JSON.stringify(results));
    })
    .catch(() => {
      res.send('No recent activities found');
      connection.release();
    });
});

// Route to get all user group name
app.post('/leavegroup', (req, res) => {
  console.log('leaving group member', req.body);
  const checkbalance = 'select balance from groupMembersDetails where memberEmail = ? and group_name = ?';
  const deletesql = 'delete from groupMembersDetails where memberEmail = ? and group_name = ? and balance = 0';
  const activity = 'INSERT INTO recentActivities (action_name,action_by,action_on,group_name) VALUES (?,?,current_timestamp(),?);';
  let connection; let
    data;
  pool
    .then((p) => p.getConnection())
    .then((p) => {
      connection = p;
      connection.beginTransaction();
      data = connection.query(checkbalance, [sessionUserEmail, req.body.groupName]);
      return data;
    }).then((results) => {
      if (results.length === 0) {
        console.log('no balance data');
        throw new Error('User couldnot leave');
      }
      if (results[0].balance !== 0) {
        return res.end('Cant leave Group Now!');
      }
      data = connection.query(deletesql, [sessionUserEmail, req.body.groupName]);
      return data;
    }).then((results) => {
      if (results.affectedRows === 0) {
        console.log('failed deleting');
        throw new Error('User couldnot leave');
      }
      console.log('deleted group');
      data = connection.query(activity, [`user "${sessionUserName}" left group "${req.body.groupName}"`, sessionUserName, req.body.groupName]);
      return data;
    })
    .then((results) => {
      if (results.affectedRows === 0) {
        console.log('failed activity');
        throw new Error('activity table is not updated');
      }
      console.log('all ok');
      connection.commit();
      connection.release();
      return res.send('all ok');
    })
    .catch((err) => {
      console.log(err);
      res.send('No recent activities found');
      connection.rollback();
      connection.release();
    });
});

// start your server on port 3001
app.listen(3001);
console.log('Server Listening on port 3001');
