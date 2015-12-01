var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');

//var card       = require('angular-credit-cards');

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
    var result = { "Data":"", "Success":false}
        connection.query("(SELECT Cust_username AS Username,PASSWORD FROM CUSTOMER WHERE Cust_username=? AND PASSWORD=? LIMIT 1)UNION(SELECT Man_username AS Username,PASSWORD FROM MANAGEMENT WHERE Man_username=? AND PASSWORD=? LIMIT 1)",
                [req.body.Username,req.body.Password,req.body.Username,req.body.Password], function(err, rows, fields){
                    if(err) {
                        console.error('bad query: ' + err.stack);
                    }
                    if(rows.length != 0){
                        console.log("rows returned:",rows);
                        result["Data"] = "Successfully logged in.";
                        result["Success"] = true;
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

// REVIEW FUNCTIONALITIES
app.post('/givereview',function(req,res) {
    var result = { "Data":"", "Success":false};
    //console.log("comment:",req.body.Comment);
    //console.log("rating:",req.body.Rating);
    //console.log("location:",req.body.Location);
    //console.log("customer:",req.body.Customer);

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


//@@TODO BY JENNA: SEARCH ROOM, MAKE RESERVATION, ADD CARD, DELETE CARD, RETRIEVE CARD, UPDATE RESERVATION, CANCEL RESERVATION
//------------------------------------------------------------------------------

//@TODO IMPLEMENT MORE COMPLEX QUERY THAT SEARCHES ONILY THE ROOMS THAT HAVE NOT BEEN RESERVED (DO NOT EXIST IN RESERVATION_ROOM)
app.post('/searchrooms',function(req,res) {
    var result = { "Data":"", "Success": "false"}; //if not returning rows use this

    var startdate = req.body.Startdate;
    var enddate = req.body.Enddate;

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

//@TODO: THIS ONE IS FOR INSERTING INTO RESERVATION_ROOM
app.post('/makereservationroom',function(req,res) {
    var result = { "Data":"", "Success":false,",reservationId":""}; //if not returning rows use this
    var user = req.body.User
    var rooms = req.body.Rooms
    var stardate = new Date(req.body.Startdate).toISOString().substr(0,9);
    var enddate = new Date(req.body.Enddate).toISOString().substr(0,9);
    var totalcost = req.body.Totalcost
    var card = req.body.Card
    console.log(stardate);
    console.log(enddate);
    console.log(totalcost);
    console.log(user);
    console.log(card);
    console.log(rooms);

    var reservationId;

    //some sql query. question marks are replaced [somevar1,somevar2] respectively
    connection.query("INSERT INTO RESERVATION (Reservation_id,Start_date,End_date,Total_cost,Is_cancelled,Customer,Payment) VALUES ('NULL',?,?,?,?,?,?)",
            [stardate,enddate,totalcost,'FALSE',user,card], function(err, result){
                if(err) {
                    //Data set and returned on sql error
                    console.error('bad query: ' + err.stack);
                    result["Data"] = "Reservation not added CORRECTLY";
                    res.json(result);
                    return;
                } else {
                    console.log(result);
                    console.log(result["insertId"]);
                    reservationId = result["insertId"];
                    console.log(rooms);
                    console.log("RESERVATION TABLE UPDATED IT WORKED");
                    rooms.forEach(function(room){
                        console.log("a rooms : ",room);
                        var number = room["number"];
                        var location = room["location"]
                        var extrabed = room["extraBedSelected"]
                        connection.query("INSERT INTO RESERVATION_ROOM (Reservation_id,Room_no,Location,Has_extra_bed) VALUES (?,?,?,?)",
                                [reservationId,number,location,extrabed], function(err){
                                    if(err) {
                                        //Data set and returned on sql error
                                        console.error('bad query: ' + err.stack);
                                        result["Data"] = "FAILURE";
                                        res.json(result);
                                        return;
                                    } else {
                                        console.log("RESERVATION_ROOM UPDATED");
                                        //return "rows" if getting database data
                                        //if no data is to be returned, return result with "Data"set as "success!" or something
                                        //

                                    }
                                });
                    })
                    if (result["Data"] != "FAILURE") {
                        result["Data"] = "Reservation added";
                        result["Success"] = true;
                        result["reservationId"] = reservationId;
                        res.json(result);
                    }

                }
            });
});

app.post('/savecard',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this

    var Name = req.body.Name;
    var CardNum = req.body.CardNum;
    var Expmonth = req.body.Expmonth;
    var Expyear = req.body.Expyear;
    var curUser = req.body.Customer;
    var cvv = req.body.cvv;

    // @TODO UPDATE SQL TABLE
    connection.query("INSERT INTO PAYMENT_INFORMATION (Name, CVV, Exp_date, Customer, Card_no) VALUES (?,?,?,?,?,?)",
            [Name, CardNum, Expmonth, Expyear, curUser, cvv], function(err, rows, fields){
                if(err) {
                    //Data set and returned on sql error
                    console.error('Card not saved: ' + err.stack);
                    result["Data"] = "FAILURE";
                    res.json(result);
                } else {
                    result["Success"] = true;
                    console.log("RECEIVED!", rows);
                    res.json(result);
                }
            });
});

app.post('/deletecard',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this

    var CardNum = req.body.CardNum;

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("DELETE FROM PAYMENT_INFORMATION WHERE Card_no=?",
            [somevar1,somevar2], function(err, rows, fields){
                if(err) {
                    console.error('CARD DELETION FAIL!: ' + err.stack);
                    res.json(result);
                } else {
                    result["Success"] = true;
                    console.log("CARD SUCCESSFULLY DELETED!", rows);
                    res.json(result);
                }
            });
});

//  this may get called on multiple pages to populate card info dropdowns
app.post('/getcardinfo',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this
    var user = req.body.User;
    console.log(user);

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT Card_no FROM PAYMENT_INFORMATION WHERE Customer=?",
            [user], function(err, rows, fields){
                if(err) {
                    console.error('bad query: ' + err.stack);
                    res.json(result);
                } else {
                    result["Success"] = true;
                    console.log("CARD INFORMATION!", rows);
                    res.json(rows);
                }
            });
});

//@TODO update reservation: SELECT from RSERVATION_ROOM, then UPDATE?
app.post('/retrieveReservationRoom',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this

    var reservationId = req.body.reservationId;
    console.log(user);

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT Card_no FROM PAYMENT_INFORMATION WHERE Customer=?",
        [reservationId], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            } else {
                console.log("CARD INFORMATION!", rows);
                res.json(rows);
            }
        });
});

app.post('/updateReservationRoom',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this

    var user = req.body.User;
    console.log(user);

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT Card_no FROM PAYMENT_INFORMATION WHERE Customer=?",
        [user], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            } else {
                console.log("CARD INFORMATION!", rows);
                res.json(rows);
            }
        });
});

app.post('/cancelReservationRoom',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this

    var user = req.body.User;
    console.log(user);

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT Card_no FROM PAYMENT_INFORMATION WHERE Customer=?",
        [user], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            } else {
                console.log("CARD INFORMATION!", rows);
                res.json(rows);
            }
        });
});

app.post('/reservationreport',function(req,res) {
    var result = { "August":[], "September":[], "Success":false}; //if not returning rows use this


    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT t2.Location,COUNT(DISTINCT t1.Reservation_id) as Count FROM (SELECT * FROM RESERVATION Where MONTH(RESERVATION.Start_date) = 11) as t1, (SELECT * FROM RESERVATION_ROOM) as t2 WHERE t1.Reservation_id = t2.Reservation_id GROUP BY t2.Location",
        [], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            } else {
                console.log("Got AUGUST", rows);
                result["Success"] = true;
                result["August"] = rows;
            }
        });
    connection.query("SELECT t2.Location,COUNT(DISTINCT t1.Reservation_id) AS Count FROM (SELECT * FROM RESERVATION Where MONTH(RESERVATION.Start_date) = 9) as t1, (SELECT * FROM RESERVATION_ROOM) as t2 WHERE t1.Reservation_id = t2.Reservation_id GROUP BY t2.Location",
        [], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            } else {
                console.log("GOT SEPTEMBER!", rows);
                result["Success"] = true
                result["September"] = rows
                res.json(result);
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
