import server from './config/dev-server'
//import io from 'socket.io'

let mongoose = require('mongoose')
let connection = mongoose.connection;


// Establishes MongoDb Connection
mongoose.connect(process.env.CONNECTIONSTRING, {
	server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
	replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
});

connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', function () {
	server.listen(process.env.PORT, function () {
		console.log(`The server is lit on port ${process.env.PORT}`);
	})
});

