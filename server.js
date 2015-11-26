var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'academic-mysql.cc.gatech.edu',
    user     : 'cs4400_Group_44',
    password : '24eMcFbq',
    database : 'cs4400_Group_44'
});

// connect to sql database
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log(' properly connected as id ' + connection.threadId);
});




//set express and bodyParser setting
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());



// login
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
                    } else {
                        console.log("Username or Password in incorrect", rows);
                        result["Data"] = "Username or password is incorrect.";
                        res.json(result);
                    }
                });
    console.log("resule: ", result);
});

// TODO: Does not tell user when registration fails
app.post('/register',function(req,res) {
    console.log("Username:",req.body.Username);
    var Username = req.body.Username;
    var Password = req.body.Password;
    var PasswordConfirm = req.body.PasswordConfirm;
    var Email = req.body.Email;
    var result = { "Data":"", "Success":"false"};
        connection.query("SELECT * FROM CUSTOMER WHERE Cust_username=? LIMIT 1",
                [req.body.Username], function(err, rows, fields){
                    if(err) {
                        console.error('bad query: ' + err.stack);
                    }
                    if(rows.length != 0){
                        console.log("Username Taken", rows);
                        result["Data"] = "Username Taken";
                        res.json(result);
                    } else {
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


app.post('/givereview',function(req,res) {
    var result = { "Data":"", "Success":false};
    console.log("comment:",req.body.Comment);
    console.log("rating:",req.body.Rating);
    console.log("location:",req.body.Location);
    console.log("customer:",req.body.Customer);

    connection.query("INSERT INTO HOTEL_REVIEW (Review_no,Location,Rating,Comment,Customer) VALUES ('NULL',?,?,?,?)",
            [req.body.Location,req.body.Rating,req.body.Comment,req.body.Customer], function(err, rows, fields){
                if(err) {
                    console.error('bad query: ' + err.stack);
                    result["Data"] = "REVIEW CREATION FAILURE";
                    res.json(result);
                } else {
                    result["Data"] = "Successfully logged in.";
                    result["Success"] = true;
                    console.log("Review Creation success!", rows);
                    console.log("resule: ", result);
                    res.json(result);
                }
            });
});

app.post('/viewreview',function(req,res) {
    var result = { "Data":"", "Success":false};
    console.log("location:",req.body.Location);

    connection.query("SELECT Rating, Comment FROM HOTEL_REVIEW WHERE Location=?",
            [req.body.Location], function(err, rows, fields){
                if(err) {
                    console.error('bad query: ' + err.stack);
                    result["Data"] = "REVIEW RETRIVAL FAILURE";
                    res.json(result);
                } else {
                    console.log("REVIEWS RECIEVED!", rows);
                    console.log("resule: ", result);
                    res.json(rows);
                }
            });
});


//----------------------------------tobedone------------------------------------
//------------------------------------------------------------------------------
//@TODO Search room, make reservation, and put up reservation confirmation screen
app.post('/searchrooms',function(req,res) {
    var result = { "Data":"", "Success": "false"}; //if not returning rows use this
    var startdate = req.body.Startdate;
    var enddate = req.body.Enddate;

    console.log("startdate:",enddate);
    console.log("enddate:",startdate);

    connection.query("SELECT * FROM ROOM WHERE Location=?",
        [req.body.Location], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                result["Data"] = "ROOM RETRIEVAL FAILURE";
                res.json(result);
            } else {
                // result["Success"] = "true";
                console.log("ROOMS RECEIVED!", rows);
                // console.log("result: ", result);
                res.json(rows);
            }
        });
});

app.post('/makereservation',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this
    //var somevar1 = req.body.somevar;
    //var somevar2 = req.body.somevar;

    //some sql query. question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT something  FROM somewhere WHERE firstvar=? AND secondvar=?",
            [somevar1,somevar2], function(err, rows, fields){
                if(err) {
                    //Data set and returned on sql error
                    console.error('bad query: ' + err.stack);
                    result["Data"] = "FAILURE";
                    res.json(result);
                } else {
                    //return "rows" if getting database data
                    //if no data is to be returned, return result with "Data"set as "success!" or something
                    //
                    console.log("RECEIVED!", rows);
                    res.json(rows);
                }
            });
});


app.post('/reservationconformation',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this
    //var somevar1 = req.body.somevar;
    //var somevar2 = req.body.somevar;

    //some sql query. question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT something  FROM somewhere WHERE firstvar=? AND secondvar=?",
            [somevar1,somevar2], function(err, rows, fields){
                if(err) {
                    //Data set and returned on sql error
                    console.error('bad query: ' + err.stack);
                    result["Data"] = "FAILURE";
                    res.json(result);
                } else {
                    //return "rows" if getting database data
                    //if no data is to be returned, return result with "Data"set as "success!" or something
                    //
                    console.log("RECIEVED!", rows);
                    res.json(rows);
                }
            });
});


//paymentinfo related-----------------------------------------------------------
app.post('/savecard',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this
    //var somevar1 = req.body.somevar;
    //var somevar2 = req.body.somevar;

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT something  FROM somewhere WHERE firstvar=? AND secondvar=?",
            [somevar1,somevar2], function(err, rows, fields){
                if(err) {
                    //Data set and returned on sql error
                    console.error('bad query: ' + err.stack);
                    result["Data"] = "FAILURE";
                    res.json(result);
                } else {
                    //return "rows" if getting database data
                    //if no data is to be returned, return result with "Data"set as "success!" or something
                    //
                    result["Success"] = true;
                    console.log("RECIEVED!", rows);
                    res.json(result);
                }
            });
});

app.post('/deletecard',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this
    //var somevar1 = req.body.somevar;
    //var somevar2 = req.body.somevar;

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT something  FROM somewhere WHERE firstvar=? AND secondvar=?",
            [somevar1,somevar2], function(err, rows, fields){
                if(err) {
                    //Data set and returned on sql error
                    console.error('bad query: ' + err.stack);
                    //result["Data"] = "FAILURE";
                    res.json(result);
                } else {
                    //return "rows" if getting database data
                    //if no data is to be returned, return result with "Data"set as "success!" or something
                    result["Success"] = true;
                    console.log("RECIEVED!", rows);
                    res.json(result);
                }
            });
});

//  this may get called on multiple pages to populate card info dropdowns
app.post('/getcardinfo',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this
    //var somevar1 = req.body.somevar;
    //var somevar2 = req.body.somevar;

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT something  FROM somewhere WHERE firstvar=? AND secondvar=?",
            [somevar1,somevar2], function(err, rows, fields){
                if(err) {
                    //Data set and returned on sql error
                    console.error('bad query: ' + err.stack);
                    //result["Data"] = "FAILURE";
                    res.json(result);
                } else {
                    //return "rows" if getting database data
                    //if no data is to be returned, return result with "Data"set as "success!" or something
                    //
                    console.log("RECIEVED!", rows);
                    res.json(rows);
                }
            });
});








// does not do anything probably remove this.
app.get('/Mfunctionality', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
});



// catch-all routing must be last method before app.listen
app.use('/*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(4400);

console.log("server running!");
