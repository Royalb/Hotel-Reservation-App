var app = angular.module('FancyHotel',['ngRoute'])
.controller('AppCtrl',['$scope', '$http', '$location', AppCtrl])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'login.html',
        })
        .when('/functionality', {
            templateUrl: 'functionality.html',
        })
        .when('/Mfunctionality', {
            templateUrl: 'Mfunctionality.html',
        })
        .when('/registration', {
            templateUrl: 'registration.html',
        })
        .when('/searchrooms', {
            templateUrl: 'searchrooms.html',
        })
        .when('/makereservation', {
            templateUrl: 'makereservation.html',
        })
        .when('/paymentinfo', {
            templateUrl: 'paymentinfo.html',
        })
        .when('/viewreview', {
            templateUrl: 'viewreview.html',
        })
        .when('/givereview', {
            templateUrl: 'givereview.html',
        })
        .when('/cancelreservation', {
            templateUrl: 'cancelreservation.html',
        })
        .when('/Mpopularroom', {
            templateUrl: 'Mpopularroom.html',
        })
        .when('/Mreserationreport', {
            templateUrl: 'Mreserationreport.html',
        })
        .when('/Mrevenuereport', {
            templateUrl: 'Mrevenuereport.html',
        })
        .when('/reservationconfirmation', {
            templateUrl: 'reservationconfirmation.html',
        })
        .when('/updatereservation', {
            templateUrl: 'updatereservation.html',
        })
        .otherwise({ redirectTo: '/' }
        );
    $locationProvider.html5Mode(true);
});



//controller definitions -------------------------------------------------------
app.controller('LoginCtrl',['$scope','$http', LoginCtrl]);
app.controller('FunctionalityCtrl',['$scope','$http','mainPageMessageService', FunctionalityCtrl]);
app.controller('RegistrationCtrl',['$scope','$http', RegistrationCtrl]);
app.controller('SearchroomsCtrl',['$scope','$http','availableroomsService', SearchroomsCtrl]);
app.controller('MakereservationCtrl',['$scope','$http','availableroomsService','reservedRoomsService', 'reservationIdService', MakereservationCtrl]);
app.controller('PaymentinfoCtrl',['$scope','$http','availableroomsService', PaymentinfoCtrl]);
app.controller('ViewreviewCtrl',['$scope','$http', ViewreviewCtrl]);
app.controller('GivereviewCtrl',['$scope','$http', GivereviewCtrl]);
app.controller('CancelreservationCtrl',['$scope','$http', CancelreservationCtrl]);
app.controller('MpopularroomCtrl',['$scope','$http', MpopularroomCtrl]);
app.controller('MreserationreportCtrl',['$scope','$http', MreserationreportCtrl]);
app.controller('MrevenuereportCtrl',['$scope','$http', MrevenuereportCtrl]);
app.controller('ReservationconfirmationCtrl',['$scope','$http', 'reservationIdService', ReservationconfirmationCtrl]);
app.controller('UpdatereservationCtrl',['$scope','$http', 'mainPageMessageService', UpdatereservationCtrl]);

// factories -------------------------------------------------------------------
app.factory('availableroomsService', function () {
        var roomResponse = {};
        var startdate;
        var enddate;

        return {
            savestartdate:function(data) {
                startdate = data;
            },
            saveenddate: function(data) {
                enddate = data;
            },
            saveroomResponse: function (data) {
                roomResponse = data;
            },

            getroomResponse: function () {
                return roomResponse;
            },
            getstartdate: function() {
                return startdate;
            },
            getenddate: function() {
                return enddate;
            }

        };
    });

app.factory('reservedRoomsService', function () {
    var roomResponse = {};

    return {
        saveReservedRooms: function (data) {
            roomResponse = data;
        },
        getReservedRooms: function () {
            return roomResponse;
        }
    };
});

app.factory('reservationIdService', function () {
    var reservationId = "";

    return {
        saveReservationId: function (data) {
            reservationId = data;
        },
        getReservationId: function () {
            return reservationId;
        }
    };
});

app.factory('mainPageMessageService', function () {
    var message = "Welcome!";

    return {
        saveMessage: function (data) {
            message = data;
        },
        getMessage: function () {
            return message;
        }
    };
});



// controllers -----------------------------------------------------------------
function AppCtrl($scope, $http, $location) {
    //curUser is how we track who is logged in ie change this to be someone else
    $scope.curUser='';
    console.log("Hello world from controller");
    $scope.setcurUser = function(newVal) {
        $scope.curUser=newVal;
    };
    $scope.loginSucess = function() {
        console.log("called to funt");
        if ($scope.curUser.charAt(0) == 'M') {
            console.log("it was true: ",$scope.curUser.charAt(0));
            $location.path("/Mfunctionality");
        } else {
            $location.path("/functionality");

        }
    };
    $scope.addUser = function() {
        $location.path("/registration");
    };
    $scope.showReviews = function() {
        $location.path("/viewreview");
    };
    $scope.addReviews = function() {
        $location.path("/givereview");
    };
    $scope.makeReservation = function() {
        $location.path("/makereservation");
    };
    $scope.editPaymentInfo = function() {
        $location.path("/paymentinfo");
    };
    $scope.ReservationConfirmation = function() {
        $location.path("/reservationconfirmation");
    };
    $scope.goToMainMenu = function() {
        $location.path("/functionality");
    }
}

function LoginCtrl($scope, $http) {
    $scope.loginUser = function() {
        console.log($scope.user);
        $http.post('/login', $scope.user).success(function(res){
            if (res) {
                console.log("curUser: ", $scope.$parent.curUser);
                $scope.setcurUser($scope.user.Username);
                console.log("curUser: ", $scope.$parent.curUser);
                $scope.loginResponse = res.Message;
                if(res.Success == true){
                    $scope.loginSucess();
                }
            }
        });
    };
}

function FunctionalityCtrl($scope, $http, mainPageMessageService) {
    console.log('You made it. Hello!');

    $scope.message = mainPageMessageService.getMessage();
}


function RegistrationCtrl($scope, $http) {
    $scope.user = {
        Username: "",
        Password: "",
        PasswordConfirm: "",
        Email:""
    };
    // TODO: check for last 4 chars in username are numbers somewhere
    $scope.registerUser = function() {
        console.log("Before Checks:",$scope.user);
        if ($scope.user.Username.charAt(0) != 'C' || $scope.user.Username.charAt(1) == ''
            || $scope.user.Username.length != 5) {
            $scope.registerResponse = "Username must start with a 'C' and be followed by 4 numbers";
            return;
        }
        if ($scope.user.Password != $scope.user.PasswordConfirm) {
            $scope.registerResponse = "Passwords are Different.";
            return;
        }
        if (($scope.user.Email == "" )|| ($scope.user.Email === undefined ) || ($scope.user.Password == "")) {
            $scope.registerResponse = "All Fields are Required!";
            return;
        }
        console.log($scope.user);
        $http.post('/register', $scope.user).success(function(res){
            if (res) {
                console.log(res);
                console.log("curUser: ", $scope.$parent.curUser);

                $scope.setcurUser($scope.user.Username);

                console.log("curUser: ", $scope.$parent.curUser);
                $scope.registerResponse = res.Message;
                if(res.Success){
                    $scope.loginSucess();
                }
            }
        });
    };
}

function ViewreviewCtrl($scope, $http) {
    $scope.locations = [{name:'Atlanta'},{name:'Charlotte'},{name:'Savannah'},{name:'Orlando'},{name:'Miami'}];
    $scope.curSelectedLoc = $scope.locations[0];
    $scope.retrive = function (argument) {
        var body = {
            "Location":$scope.curSelectedLoc.name
        };
        $http.post('/viewreview',body).success(function(res) {
            if (res) {
                console.log("Received something");
                console.log("res:", res);
                $scope.response = 'Review left successfully';
                $scope.reviewlist = res;
            }
        });
    }
}

function GivereviewCtrl($scope, $http) {
    $scope.comment = '';
    $scope.locations = [{name:'Atlanta'},{name:'Charlotte'},{name:'Savannah'},{name:'Orlando'},{name:'Miami'}];
    $scope.curSelectedLoc = $scope.locations[0];
    $scope.ratings = [{name:'Excellent'},{name:'Good'},{name:'Bad'},{name:'Very Bad'},{name:'Neutral'}];
    $scope.curSelectedRat = $scope.ratings[0];
    console.log('You made it to givereview. Hello!');

    $scope.submit = function (argument) {
        // this if statment might not be working.
        if ($scope.comment.length > 5000) {
            $scope.response = "Comment must be less that 5000 characters currently:" + $scope.comment.length
        }
        var body = {
            "Location":$scope.curSelectedLoc.name,
            "Rating":$scope.curSelectedRat.name,
            "Comment":$scope.comment,
            "Customer":$scope.curUser};

        $http.post('/givereview',body).success(function(res) {
            if (res) {
                console.log("Recieved something");
                if (res["Success"]) {
                    $scope.response = 'Review left successfully';
                    $scope.showReviews();
                } else {
                    $scope.response = 'Something went wrong.';

                }
            }
        });
    }
}

// @TODO JENNA'S TASKS: SEARCH ROOM, MAKE RESERVATION, UPDATE PAYMENT INFORMATION, UPDATE RESERVATION, CANCEL RESERVATION

function SearchroomsCtrl($scope, $http, availableroomsService) {
    console.log('You made it to SearchroomsCtrl. Hello!');

    $scope.curdate = new Date();
    $scope.locations = [{name:'Atlanta'},{name:'Charlotte'},{name:'Savannah'},{name:'Orlando'},{name:'Miami'}];
    $scope.curSelectedLoc = $scope.locations[0];
    $scope.startdate = $scope.curdate;
    $scope.enddate = new Date(new Date().setHours(24,0,0,0));

    $scope.message = "";

    $scope.search = function () {
        if ($scope.startdate.valueOf() >= $scope.enddate.valueOf()) {
            $scope.message = " Please choose end date after start date.";
            return;
        }
        if ($scope.startdate < $scope.curdate) {
            $scope.message = "Can not choose dates in the past";
            return;
        }
        var body = {
            "Startdate":$scope.startdate.toISOString().substr(0,9),
            "Enddate":$scope.enddate.toISOString().substr(0,9),
            "Location":$scope.curSelectedLoc.name};

        $http.post('/searchrooms', body).success(function(res) {
            if (res.Success) {
                console.log("Search worked");
                availableroomsService.saveroomResponse(res.Data);
                availableroomsService.savestartdate($scope.startdate);
                availableroomsService.saveenddate($scope.enddate);
                $scope.makeReservation();
            } else {
                $scope.message = "No rooms were found. Please choose different dates";
            }
        });
    }
}


//maybe TODO since there are queries that rely on a user being logged in if not loggedin redirect to login.
//maybe TODO also maybe check for startdate enddate and rooms are present.
//TODO redirect to payment info if no card exists
function MakereservationCtrl($scope, $http, availableroomsService, reservedRoomsService, reservationIdService) {
    console.log('You made it to Makereservation. Hello!');

    $scope.startdate = availableroomsService.getstartdate();
    $scope.enddate = availableroomsService.getenddate();
    var rooms = availableroomsService.getroomResponse();
    $scope.totalcost = 0;


    $scope.roomlist = [];

    // Populate available room table
    for (var i = 0; i < rooms.length; i++) {
        $scope.roomlist.push({
                number: rooms[i].Room_no,
                category: rooms[i].Room_category,
                pallowed: rooms[i].No_people,
                costperday: rooms[i].Cost_per_day,
                costextrabed: rooms[i].Cost_extra_bed_per_day,
                location: rooms[i].Location,
                extraBedSelected: false}
        )
    }

    $scope.selectedRooms = [];

    // Populate selected room table
    $scope.checkDetails = function(argument) {
        angular.forEach($scope.roomlist, function(room, key){
            // push selected rooms that aren't alreayd in the list to prevent angularjs error
            if (room['selected'] && $scope.selectedRooms.indexOf(room) == -1) {
                $scope.selectedRooms.push(room)
            }
            //remove from selected rooms if unselected.
            if (!room['selected'] && $scope.selectedRooms.indexOf(room) != -1)  {
                $scope.selectedRooms.pop(room)
            }
        });
    };

    // Dynamically calculate total cost
    $scope.calculateTotalCost = function() {
        var daysofStay = $scope.startdate - $scope.enddate;
        var totalcost = 0;
        angular.forEach($scope.selectedRooms, function(selroom, key) {
            totalcost += selroom.costperday;
            if (selroom['extraBedSelected']) {
                totalcost += selroom.costextrabed;}
        });
        $scope.totalcost = totalcost;
        return totalcost;
    };

    // Populate card list dropdown
    $scope.cardlist = [];
    var body = {
        "User":$scope.curUser};

    $http.post('/getcardinfo',body).success(function(res) {
        if(res){
            if (res.length < 1) {
                console.log("need payemnet info");
                //$scope.editPaymentInfo();
            }
            $scope.cardlist = res;
            console.log("card information?");
            console.log(res)
        }
    });

    //@TODO CHECK IF THE DROPDOWN CORRECTLY ASSIGNS SELECTED CARD
    // Wait for card to be selected
    $scope.selectedCard = "";

    //$scope.dropdownSelectedCard = function (item) {
    //    $scope.selectedCard = item;
    //};

    // Submit reservation
    $scope.submitReservation = function () {
        if ($scope.startdate.valueOf() >= $scope.enddate.valueOf()) {
            $scope.message = " Please choose end date after start date.";
            return;
        }
        if ($scope.startdate < $scope.curdate) {
            $scope.message = "Can not choose dates in the past";
            return;
        }

        if ($scope.selectedCard == "") {
            $scope.message = "Must select at least one card";
            return;
        }
        if ($scope.selectedRooms.length > 0) {
            $scope.message = "Must select at least one room";
            return;
        }
        if ($scope.curUser.lenght < 1) {
            $scope.message = "Must be logged in";
            return;
        }

        //@TODO implement logic to save page state when users are finished with editing payment information state if they need to
        //@TODO maybe modal model, or if statements with app factory?
        //reservedRoomsService.saveReservedRooms($scope.selectedRooms);

        //@TODO INSERT RESERVATION_ROOM ROW INTO THE SQL TABLE, RETRIEVE RESERVATION_ID, and SAVE IT FOR RESEVATION_CONFIRMATION

        var body = {
            "User":$scope.curUser,
            "Rooms":$scope.selectedRooms,
            "Startdate":$scope.startdate,
            "Enddate":$scope.enddate,
            "Totalcost":$scope.totalcost,
            "Card":$scope.selectedCard
            };

        $http.post('/makereservationroom',body).success(function(res) {
            if(res["Success"]){
                console.log("reservation has been made!?");
                reservationIdService.saveReservationId(res["reservationId"])
                $scope.ReservationConfirmation();
            } else {
                console.log("something went Wrong")
            }
        });

        //reservationIdService.saveReservationId(reservationId);

    };
}


// incomplete-------------------------------------------------------------------

// TODO: implement deletecard
function PaymentinfoCtrl($scope, $http) {
    console.log('You made it to Paymentinfo. Hello!');
    var curdate = new Date();

    $scope.alerts="";

    $scope.card = {
        'cardholdername' : "",
        'cardnum' : "",
        'expmonth' : "",
        'expyear' : "",
        'cvc' : ""
    };

    $scope.cardnumDelete = "";

    $scope.addCard = function () {
        console.log("adding card");
        if (!(/^[A-z ]+$/.test($scope.cardholdername))
            || $scope.card.cardholdername.length > 50
            || $scope.card.cardnum.length != 16
            || /^\d+$/.test($scope.card.cardnum)
            || $scope.card.cvv.length >= 4
            || /^\d+$/.test($scope.card.cvv)) {

            $scope.alerts="One or more fields are invalid";
            return;
        }

        // check if cardnum and cardnumDelete is 16 digits number

        var body = {
            //@TODO change expiration date to expiration month/year in SQL
            "Name": $scope.card.cardholdername,
            "CardNum": $scope.card.cardnum,
            "Expmonth": $scope.card.expmonth,
            "Expyear": $scope.card.expyear,
            "Customer": $scope.curUser,
            "cvv": $scope.card.cvv};

        // post that sends data(what's in body) to sqlserver
        $http.post('/savecard', body).success(function(res) {
            if (res) {
                console.log("Received something");
                if (res["Success"]) {
                    $scope.response = 'Card Saved successfully';

                } else {
                    $scope.response = 'Something went wrong.';
                }
            }
        });
    };

    $scope.deleteCard = function () {
        var body = {
            "CardNum": $scope.cardnumDelete,
            "Customer": $scope.curUser
        };

        $http.post('/deletecard',body).success(function(res) {
            if (res) {
                console.log("Receive something");
                if (res["Success"]) {
                    $scope.response = 'Card deleted successfully';
                } else {
                    $scope.response = 'Something went wrong.';
                }
            }
        });
    }
}


function ReservationconfirmationCtrl($scope, $http, reservationIdService) {

    //@TODO RETRIEVE RESERVATION ID FROM SQL SERVER
    //@INSERT ROW INTO THE TABLE
    $scope.reservationId = reservationIdService.getReservationId();
}

var testdata;

function UpdatereservationCtrl($scope, $http, mainPageMessageService) {
    console.log('You made it to updatereservation. Hello!');

    $scope.reservationId = "";
    $scope.location= "";

    $scope.curdate = new Date();
    $scope.oldstartdate = new Date();
    $scope.oldenddate = new Date();
    $scope.newstartdate = new Date();
    $scope.newenddate = new Date(new Date().setHours(24,0,0,0));

    $scope.reservationLookupMessage = "";
    $scope.roomLookupMessage = "";


    // post that sends data(what's in body) to sqlserver
    $scope.retrieveReservation = function() {
        var body = {
            "reservationId": $scope.reservationId
        };

        $http.post('/retrieveReservation', body).success(function(res) {
            if (res.Success) {
                testdata = res;
                console.log(res);
                $scope.oldstartdate = res.Data[0]["Start_date"];
                $scope.oldenddate = res.Data[0]["End_date"];
                $scope.reservationLookupMessage = "Reservation is found! Please enter new dates.";
            } else {
                $scope.reservationLookupMessage = "No reservations were found. Please enter different Reservation ID.";
            }
        });
    };

    $scope.roomlist = [];
    $scope.showReservation = false;

    $scope.searchAvailability = function() {

        console.log($scope.startdate);
        console.log($scope.enddate);

        if ($scope.newstartdate.valueOf() >= $scope.newenddate.valueOf()) {
            $scope.roomLookupMessage = " Please choose end date after start date.";
            return;
        }
        if ($scope.startdate < $scope.curdate) {
            $scope.roomLookupMessage = "Can not choose dates in the past";
            return;
        }

        var body = {
            "Location": "Atlanta", //@TODO FIX AFTER IMPLEMENTING COMPLEX QUERY
            "reservationId": $scope.reservationId,
            "newstartdate": $scope.newstartdate,
            "newenddate": $scope.newenddate
        };

        $http.post('/searchrooms', body).success(function(res) {
            if (res.Success) {
                $scope.showReservation = true;
                $scope.roomLookupMessage = 'Rooms are available. Please confirm details below before submitting.';
                // populate roomlist
                for (var i = 0; i < res.Data.length; i++) {
                    $scope.roomlist.push({
                            number: res.Data[i].Room_no,
                            category: res.Data[i].Room_category,
                            pallowed: res.Data[i].No_people,
                            costperday: res.Data[i].Cost_per_day,
                            costextrabed: res.Data[i].Cost_extra_bed_per_day,
                            extraBedSelected: false}
                    )
                }
            } else {
                $scope.roomLookupMessage = 'No rooms are available. Please modify your search.';
            }
        });
    };

    $scope.calculateTotalCost = function() {
        var daysofStay = $scope.newstartdate - $scope.newenddate;
        var totalcost = 0;
        angular.forEach($scope.roomlist, function(selroom, key) {
            totalcost += selroom.costperday;
            if (selroom.extraBedSelected) {
                totalcost += selroom.costextrabed;}
        });
        return totalcost;
    };

    $scope.updateReservation = function() {

        var body = {
            "Reservationid": $scope.reservationId,
            "Startdate": $scope.newstartdate,
            "Enddate": $scope.newenddate
        };

        $http.post('/updateReservation', body).success(function(res) {
            if (res.Success) {
                mainPageMessageService.saveMessage("Your reservation has been successfully updated");
                $scope.goToMainMenu();
            }
        });
    };
}

//@TODO RESERVATION ID LOOKUP
//@TODO POPULATE START DATE/ END DATE BOXES
//@TODO POPULATE ROOM INFORMATION TABLE
//@TODO CALCULATE CANCELLATION CHARGES

//function calculateDifferenceInDay(a, b) {
//    a = new Date(a.substr(0,10).replace(/-/g,'/'));
//    b = new Date(b.substr(0,10).replace(/-/g,'/'));
//    return Math.abs((a - b) / (1000 * 60 * 60 * 24));
//};


function CancelreservationCtrl($scope, $http) {
    console.log('You made it to Cancelreservation. Hello!');

    $scope.curDate = new Date();

    $scope.startdate = new Date();
    $scope.enddate = new Date();
    $scope.reservationCost = "";
    $scope.refundCost = "";
    $scope.reservationId = "";
    $scope.totalcost = "";

    $scope.reservationLookupMessage = "";
    $scope.showReservation = false;

    $scope.roomlist = []

    $scope.retrieveReservation = function() {
        var body = {
            "reservationId": $scope.reservationId
        };

        //$http.post('/retrieveReservation', body).success(function (res) {
        //    if (res.Success) {
        //        $scope.showReservation = true;
        //        $scope.reservationLookupMessage = "Reservation has been found.";
        //        $scope.startdate = res.Data[0]["Start_date"];
        //        $scope.enddate = res.Data[0]["Total_cost"];
        //        $scope.totalcost = "";
        //
        //
        //        for (var i = 0; i < res.Data.length; i++) {
        //            var body = {
        //                "reservationId": res.Data[i].Reservation_id
        //            };
        //            $http.post('/retrieveReservationRoom', body).success(function (res2) {
        //                if (res2.Success) {
        //                    $scope.roomlist.push({
        //                        number: res.Data[i].Room_no,
        //                        category: res.Data[i].Room_category,
        //                        pallowed: res.Data[i].No_people,
        //                        costperday: res.Data[i].Cost_per_day,
        //                        costextrabed: res.Data[i].Cost_extra_bed_per_day,
        //                        hasextrabed: res2.Data[i].Has_extra_bed
        //                    })
        //                }
        //            });
        //        }
        //    } else {
        //        $scope.reservationLookupMessage = "No reservation has been found. Please enter a different ID.";
        //    }
        //});

    };

    $scope.calculateRefundCost = function() {
        //var numDays = calculateDifferenceInDay($scope.startdate, $scope.enddate);

        var numDays = 5;

        if (numDays <= 1) {
            return 0;
        } else if (numDays <= 3) {
            return $scope.totalcost * 0.8;
        } else {
            return $scope.totalcost;
        }
    };

    //
    //$scope.cancelReservation = function() {
    //    var body = {
    //        "ReservationId": $scope.reservationId
    //    };
    //
    //    $http.post('/cancelReservationRoom', body).success(function(res) {
    //        if (res) {
    //            console.log("Received something");
    //            if (res["Success"]) {
    //                $scope.response = 'Reservation cancelled successfully';
    //
    //            } else {
    //                $scope.response = 'Reservation cancellation failure';
    //            }
    //        }
    //    });
    //};
}

/* the response from the sql database with the available rooms will be saved
 in the variable "roomResponse" in the "availableroomsService" service using
 the factories getter and setter methods. This can then be retrieved from the
 MakereservationCtrl method.*/


function MpopularroomCtrl($scope, $http) {
    console.log('You made it to Mpopularroom. Hello!');
}


function MreserationreportCtrl($scope, $http) {
    console.log('You made it to Mreserationreport. Hello!');
}


function MrevenuereportCtrl($scope, $http) {
    console.log('You made it to Mrevenuereport. Hello!');
}
