var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const 	express = require('express'),
		app = express(),
	 	mongoose = require("mongoose"),
		passport = require("passport"),
		bodyParser = require("body-parser"),
      	LocalStrategy = require("passport-local"),
      	passportLocalMongoose = require("passport-local-mongoose"),
      	User       =  require("./models/user");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/mydb");

//create a server object:
http.createServer(function (req, res) {
    
    if(req.url === "/apple"){
		res.write('Hello World!'); //write a response to the client
        res.end(); //end the response
	}
	else if(req.url === "/"){
		sendFileContent(res, "index.html", "text/html");
	}
	
	//else if(req.url === "/login"){
	//	console.log("login testing")
	//	sendFileContent(res, "sign-in/login.html", "text/html");
	//}

	else if(req.url === "/login"){
		console.log("login testing2")
		sendFileContent(res, "sign-in/login2.html", "text/html");
	}

	else if(req.url === "/check_fav"){
		console.log("Requested URL is url" +req.url);
		
		if(req.method==="POST"){
			formData = '';
			return req.on('data', function(data) {
				
			    formData='';
				formData+=data;
				console.log(formData);
				
				return req.on('end', function() {
				
						var user;
						var data;
						
						data=qs.parse(formData);
						user=data['login'];
						pwd=data['password'];
						console.log(user);
						console.log(pwd);
						//res.end("dat="+ user + pwd);
						
						var query={"login":user,"password":pwd};
						
						MongoClient.connect(dbUrl, function(err, db) {
								if (err) throw err;
									var dbo = db.db("mydb");
									//var query={"login": login,"pass":pass};
									console.log(query);
									dbo.collection("comment").find(query).toArray(function(err, result) {
										if (err) throw err;
										console.log("comment find");
										console.log(JSON.stringify(result));
										db.close();
										return res.end(JSON.stringify(result));
									});
						});
						
				});
			
			});
			
		}
	}
	
	
	else if(req.url === "/register"){
		console.log("testing")
		sendFileContent(res, "reg.html", "text/html");
		
		
		
		
	}
	
	else if(req.url === "/reg"){
		sendFileContent(res, "register.html", "text/html");
	}
	
	else if(req.url === "/check_reg"){
		console.log("Requested URL is url" +req.url);
		if(req.method==="POST"){
			formData = '';
			return req.on('data', function(data) {
				
			    formData='';
				formData+=data;
				console.log(formData);
				
				return req.on('end', function() {
				
			    var user;
				var data;
				
				data=qs.parse(formData);
				user=data['login'];
				pwd=data['password'];
				console.log(user);
				console.log(pwd);
				res.end("dat="+ user + pwd);
				
				var query={"login":user,"password":pwd};
				
				MongoClient.connect(dbUrl, function(err,db){
					
					//var dbo=db.db("mydb");
					if (err) throw err;
					var dbo = db.db("mydb");
							//var myobj = stringMsg;
							dbo.collection("mydb_collection").insertOne(query, function(err, res) {
								if (err) throw err;
								console.log("1 document inserted");
								//res.end("Account created!!");
								db.close();
							});
					
					
				
				
			
			       });
				
				});
			
			});
			
		}else{
				
				
			     res.end("abc");
			}		
		
	}
	

else if(/^\/[a-zA-Z0-9\/-/]*.js$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/javascript");
}else if(/^\/[a-zA-Z0-9\/-/]*.bundle.min.js$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/javascript");
}else if(/^\/[a-zA-Z0-9\/-/]*.css$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/css");
}else if(/^\/[a-zA-Z0-9\/-]*.min.css$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/css");
}else if(/^\/[a-zA-Z0-9\/-]*.jpg$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "image/jpg");
}else if(/^\/[a-zA-Z0-9-._\/]*.min.js$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/javascript");
}else if(/^\/[a-zA-Z0-9-]*.min.css.map$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/map");
}else if(/^\/[a-zA-Z0-9\/-/]*.min.js.map$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/map");
}else if(/^\/[a-zA-Z0-9\/-/]*.css.map$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/map");
}else if(/^\/[a-zA-Z0-9\/-/]*.png$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "image/png");
}else if(/^\/[a-zA-Z0-9\/-/]*.ico$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/ico");
}else if(/^\/[a-zA-Z0-9\/-/?]*.ttf$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/font");
}else if(/^\/[a-zA-Z0-9\/-/?]*.woff$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/woff");
}else if(/^\/[a-zA-Z0-9\/-/?]*.woff2$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/woff2");
}else{
console.log("Requested URL is: " + req.url);
res.end();
}
}).listen(9998); //the server object listens on port 8080


function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}