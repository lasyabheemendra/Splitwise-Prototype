var connection =  new require('./kafka/Connection');
//topics files
const mongoose = require('mongoose');
const { mongoDB } = require('./config');

const Users = require('./Models/UsersModel');
const Groups = require('./Models/GroupsModel');
const newgroups = require('./services/NewGroup');
const expenses = require('./services/Expenses');
const managegroups = require('./services/InvitedGroups');
const memberinfo = require('./services/GroupInfo');
const dashboard = require('./services/Dashboard');
const allusers = require('./services/AllUsers');
const activities = require('./services/Activity');

//connect to mongoDB

const connectMongoDB = async () => {
    const options = {
      poolSize: 900,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };
  
    try {
      await mongoose.connect(mongoDB, options);
      console.log("MongoDB connected");
    } catch (err) {
      console.log("Could not connect to MongoDB", err);
    }
  };
  connectMongoDB();

function handleTopicRequest(topic_name,fname){
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ',fname);
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("creategroup_topic",newgroups);
handleTopicRequest("addexpense_topic",expenses);
handleTopicRequest("managegroup_topic",managegroups);
handleTopicRequest("memberinfo_topic",memberinfo);
handleTopicRequest("dashboard_topic",dashboard);
handleTopicRequest("allusers_topic",allusers);
handleTopicRequest("activity_topic",activities);