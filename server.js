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
    var result = { "Data":[], "Success":false, "Message":"" };

        connection.query("(SELECT Cust_username AS Username,PASSWORD FROM CUSTOMER WHERE Cust_username=? AND PASSWORD=? " +
            "LIMIT 1)UNION(SELECT Man_username AS Username,PASSWORD FROM MANAGEMENT WHERE Man_username=? AND PASSWORD=? LIMIT 1)",
                [req.body.Username,req.body.Password,req.body.Username,req.body.Password], function(err, rows, fields){
                    if(err) {
                        console.error('bad query: ' + err.stack);
                    }
                    if(rows.length != 0){
                        console.log("rows returned:",rows);
                        result.Message = "Successfully logged in.";
                        result.Success = true;
                        res.json(result);
                    } else {
                        console.log("Username or Password in incorrect", rows);
                        result.Message = "Username or password is incorrect.";
                        res.json(result);
                    }
                });
    console.log("result: ", result);
});

// TODO: Does not tell user when registration fails
app.post('/register',function(req,res) {
    console.log("Username:",req.body.Username);
    var Username = req.body.Username;
    var Password = req.body.Password;
    var PasswordConfirm = req.body.PasswordConfirm;
    var Email = req.body.Email;
    var result = { "Data":[], "Success": false, "Message": ""};
        connection.query("SELECT * FROM CUSTOMER WHERE Cust_username=? LIMIT 1",
                [req.body.Username], function(err, rows, fields){
                    if(err) {
                        console.error('bad query: ' + err.stack);
                    }
                    if(rows.length != 0){
                        console.log("Username Taken", rows);
                        result.Message = "Username Taken";
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
                        result.Message = "Probably Registered Successfully";
                        result.Success = true;
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
                    console.log("REVIEWS RECEIVED!", rows);
                    console.log("resule: ", result);
                    res.json(rows);
                }
            });
});


// MAKE RESERVATION QUERY PART 1: GET ROOMS THAT HAVE NOT BEEN RESERVED
app.post('/searchrooms',function(req,res) {
    var result = { "Data":[], "Success": false}; //if not returning rows use this
    //SELECT * FROM ROOM WHERE (ROOM.Room_no, ROOM.Location) IN " +"(SELECT Room_no, Location FROM RESERVATION_ROOM NATURAL JOIN RESERVATION WHERE (? > End_date OR ? < Start_date) AND Location = ?)
    connection.query("SELECT * FROM ROOM WHERE (ROOM.Room_no, ROOM.Location) NOT IN (SELECT Room_no, Location FROM RESERVATION_ROOM NATURAL JOIN RESERVATION WHERE ((? BETWEEN Start_date AND End_date) OR (? BETWEEN Start_date AND End_date) OR (Start_date BETWEEN ? AND ?) OR (End_date BETWEEN ? AND ?)) AND Is_cancelled = 0 AND Location = ?) AND Location = ?",
        [req.body.Startdate, req.body.Enddate,req.body.Startdate, req.body.Enddate, req.body.Startdate, req.body.Enddate, req.body.Location,req.body.Location], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            }
            if (rows.length == 0) {
                console.log("No rooms were returned");
                res.json(result);
            } else {
                console.log("ROOMS RECEIVED!", rows);
                result.Success = true;
                result.Data = rows;
                res.json(result);
            }
        });
});



// MAKE RESERVATION QUERY PART 2: INSERT NEW INFORMATION
app.post('/makereservationroom',function(req,res) {
    var result = { "Data":"", "Success":false,",reservationId":""}; //if not returning rows use this
    var user = req.body.User;
    var rooms = req.body.Rooms;
    var stardate = new Date(req.body.Startdate).toISOString().substr(0,10);
    var enddate = new Date(req.body.Enddate).toISOString().substr(0,10);
    var totalcost = req.body.Totalcost;
    var card = req.body.Card;
    console.log(stardate);
    console.log(enddate);
    var reservationId;
    console.log(card);
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
                    reservationId = result["insertId"];
                    console.log(rooms);
                    console.log("RESERVATION TABLE UPDATED IT WORKED");
                    rooms.forEach(function(room){
                        console.log("a rooms : ",room);
                        var number = room["number"];
                        var location = room["location"];
                        var extrabed = room["extraBedSelected"];
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
                                    }
                                });
                    });
                    if (result["Data"] != "FAILURE") {
                        result["Data"] = "Reservation added";
                        result["Success"] = true;
                        result["reservationId"] = reservationId;
                        res.json(result);
                    }

                }
            });
});

// Functionality : Save card information
app.post('/savecard',function(req,res) {
    var result = { "Data":[], "Success":false}; //if not returning rows use this

    var Name = req.body.Name;
    var CardNum = req.body.CardNum;
    var Expmonth = req.body.Expmonth;
    var Expyear = req.body.Expyear;
    var curUser = req.body.Customer;
    var cvv = req.body.CVV;

    connection.query("INSERT INTO PAYMENT_INFORMATION (Name, CVV, Exp_month, Exp_year, Customer, Card_no) VALUES (?,?,?,?,?,?)",
            [Name, cvv, Expmonth, Expyear, curUser, CardNum], function(err, rows, fields){
                if(err) {
                    //Data set and returned on sql error
                    console.error('Card not saved: ' + err.stack);
                    res.json(result);
                } else {
                    result.Success = true;
                    console.log("RECEIVED!", rows);
                    res.json(result);
                }
            });
});

// Functionality: DELETE from PAYMENT_INFORMATION Table
app.post('/deletecard',function(req,res) {
    var result = { "Data":"", "Success":false}; //if not returning rows use this

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("DELETE FROM PAYMENT_INFORMATION WHERE Card_no=?",
            [req.body.CardNum], function(err, rows, fields){
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

// Functionality: SELECT from PAYMENT_INFORMATION Table
app.post('/getcardinfo',function(req,res) {
    var result = { "Data":"", "Success":false};
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

// UPDATE RESERVATION PART 1
// Functionality: Simply retrieve from RESERVATION given ID
// USED IN UPDATE RESERVATION
// USE TO DETERMINE IF RESERVATION EXISTS
app.post('/retrieveReservation',function(req,res) {
    var result = { "Data":[], "Success":false}; //if not returning rows use this

    connection.query("SELECT * FROM RESERVATION WHERE Reservation_id=?",
        [req.body.reservationId], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            }
            if (rows.length == 0) {
                console.log("Server: NO ROWS FROM RESERVATION", result);
                res.json(result);
            } else {
                result.Success = true;
                result.Data = rows;
                console.log("Server: ROWS FROM RESERVATION SENDING", result);
                res.json(result);
            }
        });
});


// UPDATE RESERVATION PART 2
// Input: Given new dates and reservation ID, check if the rooms in the reservation ID are still available in the new dates
// Functionality:
app.post('/retrieveUpdatedReservation',function(req,res) {
    var result = { "Data":[], "Success":false}; //if not returning rows use this

    // old query SELECT DISTINCT * FROM ROOM NATURAL JOIN RESERVATION_ROOM NATURAL JOIN RESERVATION WHERE (ROOM.Room_no) IN " + "(SELECT Room_no FROM ROOM NATURAL JOIN RESERVATION_ROOM WHERE Reservation_id = ?) AND (Start_date < ? OR End_date > ?) GROUP BY Room_no
    connection.query("SELECT ro.* "
+"FROM ROOM AS ro NATURAL JOIN RESERVATION_ROOM AS rr NATURAL JOIN RESERVATION AS r "
+"WHERE r.Reservation_id = "
    +"(SELECT IF( "
        +"(SELECT COUNT(*) "
        +"FROM RESERVATION_ROOM AS rr NATURAL JOIN RESERVATION AS r  "
        +"WHERE r.Reservation_id = ? AND (rr.Room_no, rr.Location)  "
        +"NOT IN "
        +"(SELECT rr.Room_no, rr.Location  "
        +"FROM RESERVATION_ROOM AS rr   "
        +"NATURAL JOIN RESERVATION AS r  "
        +"WHERE (r.Reservation_id != ?  "
            +"AND ? BETWEEN r.Start_date AND r.End_date "
                +"OR ? BETWEEN r.Start_date AND r.End_date "
                +"OR r.Start_date BETWEEN ? AND ? "
                +"OR r.End_date BETWEEN ? AND ?) "
            +"AND Is_cancelled = 0)) "
        +"= "
        +"(SELECT COUNT(*) "
        +"FROM RESERVATION_ROOM AS rr NATURAL JOIN RESERVATION AS r  "
        +"WHERE r.Reservation_id = ?), "
        +"?, "
        +"NULL "
    +")) ",
        [req.body.reservationId, req.body.reservationId,  req.body.newstartdate, req.body.newenddate, req.body.newstartdate, req.body.newenddate, req.body.newstartdate, req.body.newenddate,req.body.reservationId,req.body.reservationId], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            }
            if (rows.length == 0) {
                console.log("Server: NO ROWS FROM RESERVATION_ROOM", result);
                res.json(result);
            } else {
                result.Success = true;
                result.Data = rows;
                console.log("Server: ROWS FROM RESERVATION_ROOM SENDING", result);
                res.json(result);
            }
        });
});


// UPDATE RESERVATION PART 3
// INSERT UPDATED INFORMATION IN RESERVATION
//
app.post('/updateReservation',function(req,res) {
    var result = { "Data":"", "Success": false}; //if not returning rows use this
    connection.query("UPDATE RESERVATION SET Start_date=?, End_date=? Total_cost=? WHERE Reservation_id=?",
        [req.body.Startdate, req.body.Enddate, req.body.Totalcost,req.body.Reservationid], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
            } else {
                console.log("RESERVATION  UPDATED!", rows);
                result.Success = true;
                res.json(result);
            }
        });
});


// CANCEL RESERVATION PART 1
// GET ROOM INFORMATION CORRESPONDING TO THE GIVEN ID, THAT HAS ROOM FOR WHETHER ROOM HAS EXTRA BED OR NOT
app.post('/cancelReservationRoomRetrieval',function(req,res) {
    var result = { "Data":[], "Success":false}; //if not returning rows use this

    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT * FROM RESERVATION_ROOM NATURAL JOIN RESERVATION NATURAL JOIN ROOM WHERE Reservation_id =  ?",
        [req.body.reservationId], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            }
            if (rows.length == 0) {
                res.json(result);
            } else {
                console.log(rows);
                result.Data = rows;
                result.Success = true;
                res.json(result);
            }
        });
});


// MARK ROOM RESERVATION QUERY
app.post('/cancelReservationRoomMarkCancelled',function(req,res) {
    var result = { "Data":[], "Success":false}; //if not returning rows use this
    console.log(req.body.ReservationId);
    console.log(req.body.NewCost);
    connection.query("UPDATE RESERVATION SET Is_cancelled = true, Total_cost=? WHERE Reservation_id=?",
        [req.body.NewCost,req.body.ReservationId], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            } else {
                result.Success = true;
                res.json(result);
            }
        });
});

app.post('/reservationreport',function(req,res) {
    var result = { "August":[], "September":[], "Success":false}; //if not returning rows use this


    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT t2.Location,COUNT(DISTINCT t1.Reservation_id) as Count FROM (SELECT * FROM RESERVATION Where MONTH(RESERVATION.Start_date) = 8 AND RESERVATION.Is_cancelled = 0) as t1, (SELECT * FROM RESERVATION_ROOM) as t2 WHERE t1.Reservation_id = t2.Reservation_id GROUP BY t2.Location",
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
    connection.query("SELECT t2.Location,COUNT(DISTINCT t1.Reservation_id) AS Count FROM (SELECT * FROM RESERVATION Where MONTH(RESERVATION.Start_date) = 9 AND RESERVATION.Is_cancelled = 0) as t1, (SELECT * FROM RESERVATION_ROOM) as t2 WHERE t1.Reservation_id = t2.Reservation_id GROUP BY t2.Location",
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


app.post('/revenuereport',function(req,res) {
    var result = { "August":[], "September":[], "Success":false}; //if not returning rows use this


    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT t3.Location as Location,SUM(t3.Cost) as Cost FROM (SELECT t2.Location,t1.Reservation_id,t1.Total_cost as Cost FROM (SELECT * FROM RESERVATION Where MONTH(RESERVATION.Start_date) = 8) as t1, (SELECT * FROM RESERVATION_ROOM) as t2 WHERE t1.Reservation_id = t2.Reservation_id GROUP BY t1.Reservation_id) as t3 GROUP BY t3.Location",
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
        connection.query("SELECT t3.Location as Location,SUM(t3.Cost) as Cost FROM (SELECT t2.Location,t1.Reservation_id,t1.Total_cost as Cost FROM (SELECT * FROM RESERVATION Where MONTH(RESERVATION.Start_date) = 9) as t1, (SELECT * FROM RESERVATION_ROOM) as t2 WHERE t1.Reservation_id = t2.Reservation_id GROUP BY t1.Reservation_id) as t3 GROUP BY t3.Location",
            [], function(err, rows, fields){
                if(err) {
                    console.error('bad query: ' + err.stack);
                    res.json(result);
                } else {
                    console.log("Got September", rows);
                    result["Success"] = true;
                    result["September"] = rows;
                    res.json(result);
                }
            });
});


app.post('/popularreport',function(req,res) {
    var result = { "August":[], "Success":false}; //if not returning rows use this


    //some sql query question marks are replaced [somevar1,somevar2] respectively
    connection.query("SELECT t5.*,MAX(t5.Count) AS Max FROM (SELECT t3.*,t4.Room_category,COUNT(t4.Room_category) AS Count FROM (SELECT t1.Reservation_id,t2.Location,t2.Room_no FROM (SELECT * FROM RESERVATION Where MONTH(RESERVATION.Start_date) = 8 AND RESERVATION.Is_cancelled = 0) as t1, (SELECT * FROM RESERVATION_ROOM) as t2 WHERE t1.Reservation_id = t2.Reservation_id) as t3 ,(SELECT * FROM ROOM) as t4 WHERE t3.Location = t4.Location AND t3.Room_no = t4.Room_no GROUP BY Room_category,Location ORDER BY Count DESC) as t5 GROUP BY t5.Location",
        [], function(err, rows, fields){
            if(err) {
                console.error('bad query: ' + err.stack);
                res.json(result);
            } else {
                console.log("Got AUGUST", rows);
                result["Success"] = true;
                result["August"] = rows;
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
