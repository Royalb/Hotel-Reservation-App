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
        .when('/reservationconformation', {
            templateUrl: 'reservationconformation.html',
        })
        .when('/updatereservation', {
            templateUrl: 'updatereservation.html',
        })
        .otherwise({ redirectTo: '/' }
        );
    $locationProvider.html5Mode(true);
});


var testdata;

//controller definitions -------------------------------------------------------
app.controller('LoginCtrl',['$scope','$http', LoginCtrl]);
app.controller('FunctionalityCtrl',['$scope','$http', FunctionalityCtrl]);
app.controller('RegistrationCtrl',['$scope','$http', RegistrationCtrl]);
app.controller('SearchroomsCtrl',['$scope','$http','availableroomsService', SearchroomsCtrl]);
app.controller('MakereservationCtrl',['$scope','$http','availableroomsService', MakereservationCtrl]);
app.controller('PaymentinfoCtrl',['$scope','$http','availableroomsService', PaymentinfoCtrl]);
app.controller('ViewreviewCtrl',['$scope','$http', ViewreviewCtrl]);
app.controller('GivereviewCtrl',['$scope','$http', GivereviewCtrl]);
app.controller('CancelreservationCtrl',['$scope','$http', CancelreservationCtrl]);
app.controller('MpopularroomCtrl',['$scope','$http', MpopularroomCtrl]);
app.controller('MreserationreportCtrl',['$scope','$http', MreserationreportCtrl]);
app.controller('MrevenuereportCtrl',['$scope','$http', MrevenuereportCtrl]);
app.controller('ReservationconformationCtrl',['$scope','$http', ReservationconformationCtrl]);
app.controller('UpdatereservationCtrl',['$scope','$http', UpdatereservationCtrl]);

// factories -------------------------------------------------------------------
app.factory('availableroomsService', function () {
        var roomResponse = {};

        return {
            saveroomResponse:function (data) {
                roomResponse = data;
                console.log(roomResponse);
            },
            getroomResponse:function () {
                return roomResponse;
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
    }
    $scope.addUser = function() {
        $location.path("/registration");
    }
    $scope.showRooms = function() {
        $location.path("/makereservation");
    }
    $scope.showReviews = function() {
        $location.path("/viewreview");
    }
    $scope.addReviews = function() {
        $location.path("/givereview");
    }


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
            $scope.registerResponse = "All Feilds are Required!";
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



/* the response from the sql database with the available rooms will be saved
    in the variable "roomResponse" in the "availableroomsService" service using
    the factories getter and setter methods. This can then be retrieved from the
    MakereservationCtrl method.*/

function ViewreviewCtrl($scope, $http) {
    $scope.locations = [{name:'Atlanta'},{name:'Charlotte'},{name:'Savannah'},{name:'Orlando'},{name:'Miami'}];
    $scope.curSelectedLoc = $scope.locations[0];
    // $scope.reviewlist = [{rating:"good",comment:"hello to the world ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ"},{rating:"zaBestEvaar",comment:"¯\\_(ツ)_/¯¯\\_(ツ)_/¯¯\\_(ツ)_/¯¯\\_(ツ)_/¯¯\\_(ツ)_/¯¯\\_(ツ)_/¯"}]
    $scope.retrive = function (argument) {
        var body = {"Location":$scope.curSelectedLoc.name};
        $http.post('/viewreview',body).success(function(res) {
            if (res) {
                console.log("Recieved something");
                console.log("res:", res);
                $scope.response = 'Review left successfully';
                $scope.reviewlist = res;
            }
        });
    }
}

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
        var body = {"Startdate":$scope.startdate.toISOString().substr(0,9)
                    ,"Enddate":$scope.enddate.toISOString().substr(0,9)
                    ,"Location":$scope.curSelectedLoc.name};

        $http.post('/searchrooms', body).success(function(res) {
            if (res) {
                console.log("Search worked");
                console.log("PROBLEM SPOT UGH:", res);
                testdata = res;
                availableroomsService.saveroomResponse(res);
                $scope.showRooms();
            }           
            // if (res) {
            //     console.log("Search worked");
            //     availableroomsService.saveroomResponse(res);
            //     console.log("service response:",availableroomsService.getroomResponse());
            //     $scope.showRooms();
            // }
        });
    }
}




function MakereservationCtrl($scope, $http, availableroomsService) {
    console.log('You made it to Makereservation. Hello!');
    console.log(availableroomsService.getroomResponse());

    // TODO: set room list from getroomResponse
    // TODO: set location from getroomResponse to send with push
    var rooms = availableroomsService.getroomResponse();

     //$scope.roomlist = [
     //    {number: rooms[], category: 'Standard', pallowed: 5, costperday : 200, costextrabed : 20, selected : true },
     //    {number: 3, category: 'Family', pallowed: 4, costperday : 100, costextrabed : 10, selected : false}
     //];

    $scope.roomlist= [];

    for (var i = 0; i < rooms.length; i++) {
        $scope.roomlist.push(
            {number: rooms[i].Room_no, category: rooms[i].Room_category, pallowed:  rooms[i].No_people,
                costperday: rooms[i].Cost_per_day, costextrabed: rooms[i].Cost_extra_bed_per_day}
        )
    }


//            <td>{{room.number}}</td>
//        <td>{{room.category}}</td>
//<td>{{room.pallowed}}</td>
//<td>{{room.costperday}}</td>
//<td>{{room.costextrabed}}</td>

    $scope.checkDetails = function(argument) {
        var selroomnums = {
            nums: []
        };
        angular.forEach($scope.roomlist, function(room, key){
            var a = room;
            console.log(room['selected']);
            if (room['selected']) {
                selroomnums.nums.push(room['number'])
            }
        });
        console.log(selroomnums.nums);
    }
}




function ViewreviewCtrl($scope, $http) {
    $scope.locations = [{name:'Atlanta'},{name:'Charlotte'},{name:'Savannah'},{name:'Orlando'},{name:'Miami'}];
    $scope.curSelectedLoc = $scope.locations[0];
    // $scope.reviewlist = [{rating:"good",comment:"hello to the world ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ"},{rating:"zaBestEvaar",comment:"¯\\_(ツ)_/¯¯\\_(ツ)_/¯¯\\_(ツ)_/¯¯\\_(ツ)_/¯¯\\_(ツ)_/¯¯\\_(ツ)_/¯"}]
    $scope.retrive = function (argument) {
        var body = {"Location":$scope.curSelectedLoc.name};
        $http.post('/viewreview',body).success(function(res) {
            if (res) {
                console.log("Recieved something");
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
        var body = {"Location":$scope.curSelectedLoc.name, "Rating":$scope.curSelectedRat.name, "Comment":$scope.comment, "Customer":$scope.curUser};
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

// incomplete-------------------------------------------------------------------

// TODO: implement savecard
// TODO: implement deletecard
// TODO: retrive payment info
function PaymentinfoCtrl($scope, $http) {
    console.log('You made it to Paymentinfo. Hello!');
    var body = {};
    // post that sends data(what's in body) to sqlserver
    $http.post('/savecard',body).success(function(res) {
        if (res) {
            console.log("Recieved something");
            if (res["Success"]) {
                $scope.response = 'Card Saved successfully';

            } else {
                $scope.response = 'Something went wrong.';
            }
        }
    });
    $http.post('/deletecard',body).success(function(res) {
        if (res) {
            console.log("Recieved something");
            if (res["Success"]) {
                $scope.response = 'Card deleted successfully';
            } else {
                $scope.response = 'Something went wrong.';

            }
        }
    });
    //a post that gets info
    $http.post('/getcardinfo',body).success(function(res) {
        if (res) {
            console.log("Recieved something");
            console.log("res:", res);

                $scope.cardlist = res;
        }
    });

}

function CancelreservationCtrl($scope, $http) {
    console.log('You made it to Cancelreservation. Hello!');
}


function MpopularroomCtrl($scope, $http) {
    console.log('You made it to Mpopularroom. Hello!');
}


function MreserationreportCtrl($scope, $http) {
    console.log('You made it to Mreserationreport. Hello!');
}


function MrevenuereportCtrl($scope, $http) {
    console.log('You made it to Mrevenuereport. Hello!');
}


function ReservationconformationCtrl($scope, $http) {
    console.log('You made it to Mrevenuereport. Hello!');
}


function UpdatereservationCtrl($scope, $http) {
    console.log('You made it to updatereservation. Hello!');
}
