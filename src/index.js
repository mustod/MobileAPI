const express = require('express');
const mongoose=require('mongoose');
const app = express();
const joi = require('joi');
const fs = require('fs');
const bodyparser = require('body-parser');
const User = require('./User');

app.use(bodyparser.json());

mongoose.connect('mongodb://localhost/mobileAppDB',{ useNewUrlParser: true });

app.get('/abcd', (req, res) => {
	res.json({result: true, message: 'success'});
});

app.get('/getAllUsers', (req, res) => {
	User.find({},function(err,dataObjs){
	  if(err){
	  	console.log(err);
	  	res.send("Error");
	  } else{
	  	res.status(200);
	  	res.send(JSON.stringify(dataObjs));
	  }
	});
});

app.post('/register', (req, res) => {
	console.log("q");
	console.log(req.query);
	console.log("p");
	console.log(req.params);
	console.log("data");
	let data = req.body;
	console.log(data);
	const validationResult = User.validate(data);
	if(validationResult){
		let userObj = new User();
		userObj.firstname = data.firstname;
		userObj.lastname = data.lastname;
		userObj.email = data.email;
		userObj.password = data.password;
		userObj.birthday = data.birthday;
		userObj.gender = data.gender;

		console.log(req.files.image.path);
		console.log(req.files.image.originalFilename);

		if(req.files.image.path){
			//Image Upload
			fs.readFile(req.files.image.path,(err,data)=> {
				const dirName = '/home/TestExercises/mobileAPIs/Images';
				const newFilePath = dirName + req.files.image.originalFilename;
				fs.writeFile(newFilePath, data, (err)=> {
					if(err){ 
						console.log(err);
						res.json({result: false, message:'Oops! Image uplaod failed!'});
					}
					else
					{
						userObj.image = newFilePath;
						userObj.save(function(err,reObj){
							if(err){
								console.log(err);
								res.json({result:true, message: 'Opps! Couldn\'t register'});
							}else{
								res.json({result:true, message: 'Registered successfully'});
							}
						});
						// console.log('Image uploaded...');
						// res.json({result: true, message:'Image uploaded successfully.'});
					}
				});
			});
			//Image Upload.			
		}
		// userObj.save(function(err,reObj){
		// 	if(err){
		// 		console.log(err);
		// 		res.json({result:true, message: 'Opps! Couldn\'t register'});
		// 	}else{
		// 		console.log('response');
		// 		res.json(userObj);
		// 		// res.json({result:true, message: 'Registered successfully'});
		// 	}
		// });	
	}else{
		res.json({result:true, message: 'Opps! Couldn\'t register'});
	}
});

app.post('/login', (req, res) => {
	User.findOne({email:req.body.email, password:req.body.password},function(err,dataObj){
		if(err){
     		console.log(err);
	  		res.json({result:true, message: 'Login failed!'});
     	}else{
     		if(dataObj){
	     		res.status(200);
		  		res.json({result:true, message: 'Login Success', userData: dataObj});
	  		}else{
	  			res.json({result:true, message: 'Login failed!'});
	  		}
     	}
    });
});

app.post('/upload',(req,res) => {
	console.log(req.files.image.path);
	console.log(req.files.image.originalFilename);

	fs.readFile(req.files.image.path,(err,data)=> {
		const dirName = '/home/TestExercises/mobileAPIs/Images';
		const newFilePath = dirName + req.files.image.originalFilename;
		fs.writeFile(newFilePath, data, (err)=> {
			if(err){ 
				console.log(err);
				res.json({result: false, message:'Oops! Image uplaod failed!'});
			}
			else
			{
				console.log('Image uploaded...');
				res.json({result: true, message:'Image uploaded successfully.'});
			}
		});
	});

});

app.listen(8888);