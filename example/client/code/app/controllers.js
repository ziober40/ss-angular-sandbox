angular.module('exampleApp', ['ssAngular','gridster'])
  .config(['authProvider', '$routeProvider', '$locationProvider', function(authProvider, $routeProvider, $locationProvider) {
    authProvider.authServiceModule('example');
    authProvider.loginPath('/login');
    $routeProvider.
    when('/login', {
      controller: 'AuthCtrl',
      templateUrl: 'login.html'
    }).
    when('/app', {
      controller: 'SSCtrl',
      templateUrl: 'app.html'
    }).
    otherwise({
      redirectTo: '/app'
    });
    $locationProvider.html5Mode(true);
  }])
  .controller('SSCtrl', ['$scope', '$location', 'pubsub', 'rpc', 'model', 'auth', function($scope, $location, pubsub, rpc, model, auth) {
    $scope.messages = []
    $scope.streaming = false;
    $scope.status = "";

$scope.standardItems = [
  { sizeX: 2, sizeY: 1, row: 0, col: 0 },
  { sizeX: 2, sizeY: 2, row: 0, col: 2 },
  { sizeX: 1, sizeY: 1, row: 0, col: 4 },
  { sizeX: 1, sizeY: 1, row: 0, col: 5 },
  { sizeX: 2, sizeY: 1, row: 1, col: 0 },
  { sizeX: 1, sizeY: 1, row: 1, col: 4 },
  { sizeX: 1, sizeY: 2, row: 1, col: 5 },
  { sizeX: 1, sizeY: 1, row: 2, col: 0 },
  { sizeX: 2, sizeY: 1, row: 2, col: 1 },
  { sizeX: 1, sizeY: 1, row: 2, col: 3 },
  { sizeX: 1, sizeY: 1, row: 2, col: 4 }
];

    $scope.linkModel('example', {
      name: 'Tom'
    }, 'modelData');

    $scope.$on('ss-example', function(event, msg) {
      $scope.messages.push(msg);
    });

    $scope.toggleData = function() {
      if (!$scope.streaming) {
        $scope.streaming = true;
        $scope.status = rpc('example.on');
      } else {
        $scope.streaming = false;
        $scope.messages = [];
        $scope.status = rpc('example.off', 'Too random');
      }
    };

    $scope.$on('$destroy', function() {
      if ($scope.streaming) {
        rpc('example.off', 'Navigated away');
      }
    });

    $scope.chartObject = {
      "type": "AreaChart",
      "displayed": true,
      "data": {
        "cols": [{
          "id": "month",
          "label": "Month",
          "type": "string",
          "p": {}
        }, {
          "id": "laptop-id",
          "label": "Laptop",
          "type": "number",
          "p": {}
        }, {
          "id": "desktop-id",
          "label": "Desktop",
          "type": "number",
          "p": {}
        }, {
          "id": "server-id",
          "label": "Server",
          "type": "number",
          "p": {}
        }, {
          "id": "cost-id",
          "label": "Shipping",
          "type": "number"
        }],
        "rows": [{
          "c": [{
            "v": "January"
          }, {
            "v": 19,
            "f": "42 items"
          }, {
            "v": 12,
            "f": "Ony 12 items"
          }, {
            "v": 7,
            "f": "7 servers"
          }, {
            "v": 4
          }]
        }, {
          "c": [{
            "v": "February"
          }, {
            "v": 13
          }, {
            "v": 1,
            "f": "1 unit (Out of stock this month)"
          }, {
            "v": 12
          }, {
            "v": 2
          }]
        }, {
          "c": [{
            "v": "March"
          }, {
            "v": 24
          }, {
            "v": 5
          }, {
            "v": 11
          }, {
            "v": 6
          }]
        }]
      },
      "options": {
        "title": "Sales per month",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
          "title": "Sales unit",
          "gridlines": {
            "count": 10
          }
        },
        "hAxis": {
          "title": "Date"
        }
      },
      "formatters": {}
    }

    $scope.logout = function() {
      var promise = auth.logout();
      promise.then(function() {
        $location.path("/");
      });
    }
  }])
  .controller('AuthCtrl', ['$scope', '$location', '$log', 'auth', function($scope, $location, $log, auth) {
    $scope.processAuth = function() {
      $scope.showError = false;
      var promise = auth.login($scope.user, $scope.password);
      promise.then(function(reason) {
        $log.log(reason);
        var newPath = '/app';
        if ($scope.redirectPath) {
          newPath = $scope.redirectPath;
        }
        $location.path(newPath);
      }, function(reason) {
        $log.log(reason);
        $scope.showError = true;
        $scope.errorMsg = "Invalid login. The username and pass for the example app is user/pass";
      });
    };
  }]);