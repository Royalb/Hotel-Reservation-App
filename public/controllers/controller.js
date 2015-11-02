
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
        .otherwise({ redirectTo: '/' }
        );
    $locationProvider.html5Mode(true);
});

app.controller('LoginCtrl',['$scope','$http', LoginCtrl]);
app.controller('FunctionalityCtrl',['$scope','$http', FunctionalityCtrl]);
app.controller('RegistrationCtrl',['$scope','$http', RegistrationCtrl]);
app.controller('SearchroomsCtrl',['$scope','$http','availableroomsService', SearchroomsCtrl]);
app.controller('MakereservationCtrl',['$scope','$http','availableroomsService', MakereservationCtrl]);
app.controller('PaymentinfoCtrl',['$scope','$http','availableroomsService', PaymentinfoCtrl]);


app.factory('availableroomsService', function () {
        var roomResponse = {};

        return {
            saveroomResponse:function (data) {
                roomResponse = data;
                console.log(data);
            },
            getroomResponse:function () {
                return roomResponse;
            }
        };
    });

function AppCtrl($scope, $http, $location) {
    $scope.curUser='';
    console.log("Hello world from controller");
    $scope.changecurUser = function(newVal) {
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


}

function LoginCtrl($scope, $http) {
    $scope.loginUser = function() {
        console.log($scope.user);
        $http.post('/login', $scope.user).success(function(res){
            if (res) {
                console.log(res);
                console.log("curUser: ", $scope.$parent.curUser);

                $scope.changecurUser($scope.user.Username);

                console.log("curUser: ", $scope.$parent.curUser);
                $scope.loginResponse = res["Data"];
                if(res["Data"]){
                    $scope.loginSucess();

                } else {
                    $scope.loginResponse = "Username or Password Incorrect."
                    console.log("controller u no logedin ");
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

    $scope.registerUser = function() {
        if ($scope.user.Username.charAt(0) != 'C' || $scope.user.Username.charAt(1) == '') {
            $scope.registerResponse = "Username must start with a 'C' and be more than one letter";
            return;
        }
        if ($scope.user.Password != $scope.user.PasswordConfirm) {
            $scope.registerResponse = "Passwords are Different.";
            return;
        }
        if ($scope.user.Email == '' || $scope.user.Password == '') {
            $scope.registerResponse = "All Feilds are Required!";
            return;
        }
        console.log($scope.user);
        $http.post('/register', $scope.user).success(function(res){
            if (res) {
                console.log(res);
                console.log("curUser: ", $scope.$parent.curUser);

                // $scope.changecurUser($scope.user.Username);

                console.log("curUser: ", $scope.$parent.curUser);
                $scope.registerResponse = res["Data"];


                // if(res["Data"]){
                //     $scope.loginSucess();
                //
                // }

            }
        });
    };
}
function SearchroomsCtrl($scope, $http, availableroomsService) {
    console.log('You made it to SearchroomsCtrl. Hello!');
    $scope.locations = [{name:'Atlanta'},{name:'Charlotte'},{name:'Savannah'},{name:'Orlando'},{name:'Miami'}];
    $scope.curSelectedLoc = $scope.locations[0];
    $scope.startdate = new Date("2015,1,1");
    $scope.enddate = new Date("2015,2,1");
    $scope.search = function () {
    var body = {"Startdate":$scope.startdate.toISOString().substr(0,9)
                    ,"Enddate":$scope.enddate.toISOString().substr(0,9)
                    ,"Location":$scope.curSelectedLoc.name};

        $http.post('/searchrooms', body).success(function(res) {
            if (res) {
                // TODO: save responce properly formated from sql to saveroomResponse
                console.log("Search worked");
                availableroomsService.saveroomResponse(res);
                console.log("service response:",availableroomsService.getroomResponse());
                $scope.showRooms();
            }
        });
    }
}


function MakereservationCtrl($scope, $http) {
    console.log('You made it to Makereservation. Hello!');
    // TODO: set room list from getroomResponse
    // TODO: set location from getroomResponse to send with push

    $scope.roomlist = [
        {number: 1, category: 'Standard', pallowed: 5, costperday : 200, costextrabed : 20, selected : true },
        {number: 3, category: 'Family', pallowed: 4, costperday : 100, costextrabed : 10, selected : false}
    ];
    $scope.checkDetails = function(argument) {
        var selroomnums = {
            nums: []
        }
        angular.forEach($scope.roomlist, function(room,key){
            var a = room
            console.log(room['selected']);
            if (room['selected']) {
                selroomnums.nums.push(room['number'])
            }

        });

        console.log(selroomnums.nums);

    }

}
function PaymentinfoCtrl($scope, $http) {
    console.log('You made it to Paymentinfo. Hello!');
}