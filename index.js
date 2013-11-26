#!/usr/bin/env node
/* jshint node:true */
/*global setImmediate*/
var express = require("express"),
    path = require('path'),
    http = require('http');
    
var app = express(),
    server = http.createServer(app);

app.configure(function() {
	app.use('/files', express.static(path.join(__dirname, 'files')));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());

	app.get('/', index);
	
	app.post('/forms/sum', formSum);

	// last route is the error handler
	app.use(function errorHandler(err, req, res, next){
		console.error(err.stack);
		res.status(500).send(err.toString());
	});
});

server.listen(9999, null /*INADDR_ANY*/, null /*TCP backlog*/, function () {
	var tcpAddr = server.address(),
	    url = "http://127.0.0.1:" + tcpAddr.port;
	console.log("Now running at <" + url + ">");
});

function index(req, res, next) {
	res.status(200).sendfile(path.join(__dirname, 'index.html'));
}

function formSum(req, res, next) {
	var num1 = parseInt(req.param('num1'), 10);
	var num2 = parseInt(req.param('num2'), 10);
	var sum = num1 + num2;
	console.log("num1:", num1, "num2:", num2, "=> sum:", sum);
	var html = 
		    "<!DOCTYPE html>" +
		    "<html><head>" + 
		    "<title>Next Generation Calculator Form</title>" +
		    "</head><body>" + 
		    "sum=" + sum +
		    "</body></html>";
	res.status(200).send(html);
}


