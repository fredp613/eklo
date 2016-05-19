
require('babel-core');   

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose"
import cors from 'cors';
import glob from "glob";
import favicon from "serve-favicon";
import logger from 'morgan';
import methodOverride from 'method-override';


import * as MainWorker from "./mainworker"


const app = express();
const router = express.Router();


// export default function(app, config) {

	let connection_string = 'mongodb://localhost/eklo';

	if (process.env.MONGOLAB_URI) {
		connection_string = process.env.MONGOLAB_URI	
	}


	app.use(express.static(__dirname + '/'));

	console.log("connection string is:" + connection_string)


	mongoose.connect(connection_string, function (error) {
	    if (error) console.error(error);
	    else console.log('mongo connected');
	});

	app.use(bodyParser()); 
	app.use(bodyParser.json());  


	let routes = glob.sync('/routes/*.js');
	routes.forEach((route) => {
		require(route).default(app);
	});

	app.use((req, res, next) => {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	if(app.get('env') === 'development'){
		app.use((err, req, res, next) => {
		  res.status(err.status || 500);
		  res.render('error', {
		    message: err.message,
		    error: err,
		    title: 'error'
		  });
		});
	}

	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		  res.render('error', {
		    message: err.message,
		    error: {},
		    title: 'error'
		  });
	});


	if (process.env.PORT) {
		app.listen(process.env.PORT || 5000, function () {	  
			
		});
	} else {
		app.listen(3000);
	}

// };


MainWorker.start();



// var CleanupMessages = require('./worker.js');
// var cleanUpmessages = new CleanupMessages();
// cleanUpmessages.go();


 

















