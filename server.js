var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'academic-mysql.cc.gatech.edu',
    user     : 'cs4400_Group_44',
    password : '24eMcFbq',
    database : 'cs4400_Group_44'
});


connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log(' properly connected as id ' + connection.threadId);
});





app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());




app.post('/login',function(req,res) {
    console.log("Username:",req.body.Username);
    var Username = req.body.Username;
    var result = { "Data":"", "Success":"false"}
        connection.query("(SELECT Cust_username AS Username,PASSWORD FROM CUSTOMER WHERE Cust_username=? AND PASSWORD=? LIMIT 1)UNION(SELECT Man_username AS Username,PASSWORD FROM MANAGEMENT WHERE Man_username=? AND PASSWORD=? LIMIT 1)",
                [req.body.Username,req.body.Password,req.body.Username,req.body.Password], function(err, rows, fields){
                    if(err) {
                        console.error('bad query: ' + err.stack);
                    }
                    if(rows.length != 0){
                        console.log("rows returned:",rows);
                        result["Data"] = "Successfully logged in.";
                        result["Success"] = "true";
                        res.json(result);
                    }else{
                        console.log("Username or Password in incorrect", rows);
                        result["Data"] = "Username or password is incorrect.";

                        res.json(result);
                    }
                });


    console.log("resule: ", result);

});
// TODO: Does not tell user when regestration fails
app.post('/register',function(req,res) {
    console.log("Username:",req.body.Username);
    var Username = req.body.Username;
    var Password = req.body.Password;
    var PasswordConfirm = req.body.PasswordConfirm;
    var Email = req.body.Email;
    var result = { "Data":"", "Success":false};
        connection.query("SELECT * FROM CUSTOMER WHERE Cust_username=? LIMIT 1",
                [req.body.Username], function(err, rows, fields){
                    if(err) {
                        console.error('bad query: ' + err.stack);
                    }
                    if(rows.length != 0){
                        console.log("Username Taken", rows);
                        result["Data"] = "Username Taken";
                        res.json(result);
                    }else{
                        console.log("rows returned:",rows);
                        connection.query("INSERT INTO CUSTOMER (Email,Cust_username,Password) VALUES(?,?,?)",
                                [Email,Username,Password], function(err, rows, fields){
                                    if(err) {
                                        console.error('bad query: ' + err.stack);
                                        //want to set err to send here back but cant
                                    } else {
                                        console.log("registered done");
                                    }
                                });

                        result["Data"] = "Probably Registered Successfully";
                        result["Success"] = true;
                        res.json(result);
                    }
                });
    console.log("resule: ", result);
});



app.post('/searchrooms',function(req,res) {
    var startdate = req.body.Startdate;
    var enddate = req.body.Enddate;
    var location = req.body.Location;

    console.log("locatoin:",location);
    console.log("startdate:",enddate);
    console.log("enddate:",startdate);

    res.json(req.body);
    // TODO: request room information from server
    // TODO: send properly formated json to res from query
    // connection.query("SELECT * FROM CUSTOMER WHERE Cust_username=? AND Password=? LIMIT 1",
    //         [req.body.Username,req.body.Password], function(err, rows, fields){
    //             if(err) {
    //                 console.error('bad query: ' + err.stack);
    //             }
    //             if(rows.length != 0){
    //                 console.log(rows);
    //                 result["Data"] = "Successfully logged in.";
    //                 res.json(result);
    //             }else{
    //                 console.log("Username or Password in incorrect", rows);
    //                 result["Data"] = "Email or password is incorrect.";
    //                 res.json(result);
    //             }
    //         });
    //
    // console.log("resule: ", result);

});


app.post('/givereview',function(req,res) {
    var comment = req.body.Comment;
    var rating = req.body.Rating;
    var location = req.body.Location;
    var customer = req.body.Customer;

    console.log("comment:",comment);
    console.log("rating:",rating);
    console.log("location:",location);
    console.log("customer:",customer);

    res.json(req.body);

    connection.query("INSERT INTO HOTEL_REVIEW (Review_no,Location,Rating,Comment,Customer) VALUES (NULL,?,?,?,?)",
            [req.body.Location,req.body.Rating,req.body.Comment,req.body.Customer], function(err, rows, fields){
                if(err) {
                    console.error('bad query: ' + err.stack);
                }
                if(rows.length != 0){
                    console.log(rows);
                    result["Data"] = "Successfully logged in.";
                    res.json(result);
                }else{
                    console.log("Username or Password in incorrect", rows);
                    result["Data"] = "Email or password is incorrect.";
                    res.json(result);
                }
            });

    console.log("resule: ", result);

});





app.get('/Mfunctionality', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
});



// catch-all routing must be last method before app.listen
app.use('/*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(4400);

console.log("server running!");
