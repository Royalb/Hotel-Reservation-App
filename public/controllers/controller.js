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
app.controller('FunctionalityCtrl',['$scope','$http', FunctionalityCtrl]);
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
app.controller('UpdatereservationCtrl',['$scope','$http', UpdatereservationCtrl]);

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
}

function LoginCtrl($scope, $http) {
    $scope.loginUser = function() {
        console.log($scope.user);
        $http.post('/login', $scope.user).success(function(res){
            if (res) {
                console.log(res);
                console.log("curUser: ", $scope.$parent.curUser);

                $scope.setcurUser($scope.user.Username);

                console.log("curUser: ", $scope.$parent.curUser);
                $scope.loginResponse = res["Data"];
                if(res["Success"] == "true"){
                    $scope.loginSucess();
                }
            }
        });
    };
}

function FunctionalityCtrl($scope, $http) {
    console.log('You made it. Hello!');
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
                $scope.registerResponse = res["Data"];
                if(res["Success"]){
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
            if (res) {
                console.log("Search worked");
                availableroomsService.saveroomResponse(res);
                availableroomsService.savestartdate($scope.startdate);
                availableroomsService.saveenddate($scope.enddate);
                $scope.makeReservation();
            }
        });
    }
}


function MakereservationCtrl($scope, $http, availableroomsService, reservedRoomsService, reservationIdService) {
    console.log('You made it to Makereservation. Hello!');

    $scope.startdate = availableroomsService.getstartdate();
    $scope.enddate = availableroomsService.getenddate();
    var rooms = availableroomsService.getroomResponse();

    $scope.roomlist = [];

    // Populate available room table
    for (var i = 0; i < rooms.length; i++) {
        $scope.roomlist.push({
                number: rooms[i].Room_no,
                category: rooms[i].Room_category,
                pallowed: rooms[i].No_people,
                costperday: rooms[i].Cost_per_day,
                costextrabed: rooms[i].Cost_extra_bed_per_day}
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
        return totalcost;
    };

    // Populate card list dropdown
    $scope.cardlist = [];
    var body = {
        "User":$scope.curUser};

    $http.post('/getcardinfo',body).success(function(res) {
        if(res){
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
        }

        //@TODO implement logic to save page state when users are finished with editing payment information state if they need to
        //@TODO maybe modal model, or if statements with app factory?
        //reservedRoomsService.saveReservedRooms($scope.selectedRooms);

        //@TODO INSERT RESERVATION_ROOM ROW INTO THE SQL TABLE, RETRIEVE RESERVATION_ID, and SAVE IT FOR RESEVATION_CONFIRMATION

        var body = {
            "User":$scope.curUser};

        $http.post('/makereservationroom',body).success(function(res) {
            if(res["Success"]){
                console.log("reservation has been made!?");
            }
        });

        //reservationIdService.saveReservationId(reservationId);


        $scope.ReservationConfirmation();
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


function UpdatereservationCtrl($scope, $http) {
    console.log('You made it to updatereservation. Hello!');

    $scope.reservationId = "";
    $scope.location= "";

    $scope.startdate = new Date();
    $scope.enddate = new Date();

    $scope.newstartdate = new Date();
    $scope.newenddate = new Date();


    //var body = {
    //    //@TODO change expiration date to expiration month/year in SQL
    //    "Name": $scope.card.cardholdername,
    //    "CardNum": $scope.card.cardnum,
    //    "Expmonth": $scope.card.expmonth,
    //    "Expyear": $scope.card.expyear,
    //    "Customer": $scope.curUser,
    //    "cvv": $scope.card.cvv};


    // post that sends data(what's in body) to sqlserver
    $scope.retrieveReservation = function() {
        var body = {
            "ReservationId": $scope.reservationId
        };

        $http.post('/retrieveReservationRoom', body).success(function(res) {
            if (res) {
                console.log("Received something");
                if (res["Success"]) {
                    $scope.response = 'Card Saved successfully';
                    //@TODO SET STARTDATE AND ENDDATE
                } else {
                    $scope.response = 'Something went wrong.';
                }
            }
        });
    };

    //@TODO IMPLEMENT MORE COMPLEX QUERY; SEARCH ALL ROOMS THAT MATCH CRITERION(LOCATION, DATES)
    //@TODO REUSE SEARCH ROOM?

    $scope.searchAvailability = function() {
        var body = {
            "ReservationId": $scope.reservationId
        };

        $http.post('/searchrooms', body).success(function(res) {
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

    // post that sends data(what's in body) to sqlserver
    $http.post('/updateReservationRoom', body).success(function(res) {
        if (res) {
            console.log("Received something");
            if (res["Success"]) {
                $scope.response = 'Card Saved successfully';

            } else {
                $scope.response = 'Something went wrong.';
            }
        }
    });
}

//@TODO RESERVATION ID LOOKUP
//@TODO POPULATE START DATE/ END DATE BOXES
//@TODO POPULATE ROOM INFORMATION TABLE
//@TODO CALCULATE CANCELLATION CHARGES
function CancelreservationCtrl($scope, $http) {
    console.log('You made it to Cancelreservation. Hello!');

    $scope.curDate = new Date();
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.reservationCost = "";
    $scope.refundCost = "";
    $scope.reservationId = "";

    $scope.retrieveReservation = function() {
        var body = {
            "ReservationId": $scope.reservationId
        };

        $http.post('/retrieveReservationRoom', body).success(function(res) {
            if (res) {
                console.log("Received something");
                if (res["Success"]) {
                    $scope.response = 'Reservation retrieved  successfully';
                    //@TODO SET RESERVATION COST, START DATE, END DATE
                    // $scope.reservationCost = ?
                } else {
                    $scope.response = 'Reservation retrieval failure.';
                    //@TODO ALERT USER OF NONEXISTANT RESERVATION ID
                }
            }
        });
    };

    $scope.calculateRefundCost = function() {
        var numDays = $scope.curDate - $scope.startDate;

        if (numDays <= 1) {
            $scope.refundCost = "0";
        } else if (numDays <= 3) {
            //$scope.refundCost
        } else {
            $scope.refundCost = $scope.reservationCost;
        }
    };

    $scope.cancelReservation = function() {
        var body = {
            "ReservationId": $scope.reservationId
        };

        $http.post('/cancelReservationRoom', body).success(function(res) {
            if (res) {
                console.log("Received something");
                if (res["Success"]) {
                    $scope.response = 'Reservation cancelled successfully';

                } else {
                    $scope.response = 'Reservation cancellation failure';
                }
            }
        });
    };
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

