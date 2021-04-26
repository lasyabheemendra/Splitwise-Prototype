#273-Spliwise-Lab2 with Redux,MongoDB,Mongoose and Kafka.

#####THIS APPLICATION IS DEVELOPED BY Lasya Bheemendra Nalini AS PART OF CMPE-273 Course for MSSE SJSU.
Application URL: http://13.57.215.120:3000/

Installation Guide:
Make sure to follow steps as mentioned under the installation steps after the required dependencies are resolved as described under the Dependencies section below.


Dependencies:
This piece of software comprises of multiple modules which have varying set of requirements and dependencies

Level 1 Dependencies:
Java
NodeJs

Level 2 Dependencies
•	Apache kafka
•	Mongo DB
•	Amazon EC2: Make sure to Open port 3000, 3001, 2181, 9092.

Installation steps:
1.	Kafka installation steps: Follow the steps as mentioned in https://kafka.apache.org/quickstart.
Make sure that kafka zookeeper and broker are running in the Amazon EC2 instance.

2.	In an Amazon EC2 instance with at-least 512MB memory:
Download the software using standard Git clone command.
git clone github.com/lasyabheemendra/273-Splitwise-Lab2

3.	Follow steps here to install Nodejs on EC2:
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html

4.	Backend Module installation.
In the directory 273-Splitwise-Lab2/backend
#npm install


5.	Kafka-backend Module installation.
In the directory 273-Splitwise-Lab2/kafka-backend

#npm install

6.	Frontend module installation.
In the directory 273-Splitwise-Lab2/frontend

#npm install


7.	Create kafka topics before starting backend and kafka-backend modules
Execute below commands in the kafka installation directory as below.

bin/kafka-topics.sh --create --topic creategroup_topic --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic addexpense_topic --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic managegroup_topic --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic memberinfo_topic --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic dashboard_topic --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic allusers_topic --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic activity_topic --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic response_topic --bootstrap-server localhost:9092


8.	Start kafka-backend module: In a separate EC2 login terminal. From directory 273-Splitwise-Lab2/kafka-backend execute:

#node server.js

9.	Start Backend module: In a separate EC2 login terminal. From directory 273-Splitwise-Lab2/backend execute:

#node index.js

10.	Start Frontend module: In a separate EC2 login terminal. From directory 273-Splitwise-Lab2/frontend execute:

#npm start

