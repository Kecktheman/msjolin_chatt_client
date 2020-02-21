#!/usr/bin/env node
'use strict';

/**
 * Use `server.js` to run your application without `$ strapi start`.
 * To start the server, run: `$ npm start`.
 *
 * This is handy in situations where the Strapi CLI is not relevant or useful.
 */

// APP SETUP
const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch');

// Routes path
const homeRoute = require('./api/routes/home/index');
const usersRoute = require('./api/routes/users');
const chatRoute = require('./api/routes/chat');
const downloadRoute = require('./api/routes/download/download');
/* const spcfgRoute = require('./api/routes/spotify_config');
 */

process.env.MY_PASSWORD = 'tuffpassword';

// Mongoose setup
const mongoose_setup = {
	user: 'msjolin',
	pass: process.env.MY_PASSWORD
};
const { user, pass } = mongoose_setup;
mongoose.connect(
	`mongodb+srv://${user}:${pass}@msjolin-test-9e6of.azure.mongodb.net/test?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);
// Add mongoose promise to global node scope
mongoose.Promise = global.Promise;

// Middleware
app.use(morgan('dev'));
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Serve public files
app.use('/public', express.static(__dirname + '/public'));

console.log(' -- SERVER WARMED UP! -- ');

// CORS / CHECK OPTIONS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

// Routes
app.use('/', homeRoute);
app.use('/users', usersRoute);
app.use('/chat', chatRoute);
app.use('/download', downloadRoute);
/* app.use('/spcfg', spcfgRoute);
 */

// Fallback
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

/* ------------------------------------- SOCKET IO ------------------------------------- */

var server = require('http').createServer(app);
var io = require('socket.io')(server);

/* SOCKET.IO CHAT */
const data = {
	users: []
};

io.on('connection', socket => {
	// EVENT FIRED WHEN USER FIRST CONNECT
	// 1. first-connect emits from client
	// 2. first-connect is captured by server 'on'
	socket.on('first-connect', name => {
		data.users.push({ 'id': socket.id, 'name': name });

		console.log(`Server log: User joined: ${(name, socket.id)}`);

		// PASS DATA BACK TO CONNECTED USER
		socket.emit('first-connect-response', JSON.stringify(data));

		// PASS INFORMATION TO OTHER USERS IN CHAT
		socket.broadcast.emit('user-connected', {
			name: name,
			data: JSON.stringify(data)
		});

		console.log(`Users in object: --------------------------`);
		data.users.forEach(function(user, i, object) {
			console.log(`#${i} "${user.name}" - ${user.id}`);
		});
		if (data.users.length === 0) {
			console.log('-------------- No users left --------------');
		}
	});

	// SERVER CAPTURES CHAT EVENT EMITED FORM CLIENT
	socket.on('send-chat-message', data => {
		socket.broadcast.emit('chat-message', {
			message: data.message,
			name: data.name
		});

		console.log('incomming message', data);

		const payload = {
			user: data.name,
			message: data.message
		};

		try {
			// Save message to db
			console.log('Starting..');
			/* http://localhost:82/chat/ */
			fetch(`https://msjolin.azurewebsites.net/chat/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			})
				.then(res => res.json())
				.then(json => console.log(json));
		} catch (error) {
			console.warn(error);
		}
	});

	// SERVER CAPTURES DISCONNECT EVENT FROM CLIENT
	socket.on('disconnect', name => {
		console.log(`Server log: User left: ${(name, socket.id)}`);

		data.users.forEach(function(user, i, object) {
			if (user.id === socket.id) {
				let leaveName = user.name;

				object.splice(i, 1);

				socket.broadcast.emit('user-disconnected', {
					name: leaveName,
					data: JSON.stringify(data)
				});
			}
		});

		console.log(`Users in object: --------------------------`);
		data.users.forEach(function(user, i, object) {
			console.log(`#${i} "${user.name}" - ${user.id}`);
		});
		if (data.users.length === 0) {
			console.log('-------------- No users left --------------');
		}
	});
});

/* -- / CHAT --  */

server.listen(process.env.port || 81);
