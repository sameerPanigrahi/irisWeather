/*jshint esversion: 6 */
'use strict';

const express = require('express');
var server = express();
var request = require('superagent');
var intent = 'temperature';
const api_key = '3d164fc19c681184b6236b14be00cff9';

var announce = function(port){
	var url = `localhost:3000/temperature/${port}`;
	console.log(url);
	request.get(url).end((err, success)=>{
		if(err){
			console.log(`error while registering the service, details -> \n ${err}`);
		}else{
			console.log(success.body.successMessage);
		}
	});
};

var app = server.listen(()=>{
	console.log(`temperature service listening on port ${app.address().port}`);
	announce(`${app.address().port}`);
});

server.get('/:city/:units', function(req, res){
	var location = req.params.city;
	var units = req.params.units;
	console.log('city is ' + location + ' and units ' + units);
	
	request.get('http://api.openweathermap.org/data/2.5/find').query({q:location}).query({APPID:api_key}).query({units:units}).end((err, response)=>{
		var temperature = response.body.list[0].main.temp;
		var weather_desc = response.body.list[0].weather[0].description;
		var weatherString = `Temperature is ${temperature} degreees celsius and weather is ${weather_desc}`;
		console.log(weatherString);
		res.send({d:weatherString});
	});
});