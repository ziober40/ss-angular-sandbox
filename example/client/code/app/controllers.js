angular.module('exampleApp', ['ssAngular', 'gridster'])

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
  .run(['gridsterConfig', function(gridsterConfig) {
    gridsterConfig.resizable.start = function(ev, el, widget) {
      widget.dupe = "S:";
    };
  }])
  .controller('SSCtrl', ['$scope', '$location', 'pubsub', 'rpc', 'model', 'auth', function($scope, $location, pubsub, rpc, model, auth) {
    $scope.messages = []
    $scope.streaming = false;
    $scope.status = "";
    $scope.gridsterOpts = {
      columns: 6, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
      width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
      colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [10, 10], // the pixel distance between each widget
      outerMargin: true, // whether margins apply to outer edges of the grid
      isMobile: false, // stacks the grid items if true
      mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
      mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      minColumns: 1, // the minimum columns the grid must have
      minRows: 2, // the minimum height of the grid, in rows
      maxRows: 100,
      defaultSizeX: 2, // the default width of a gridster item, if not specifed
      defaultSizeY: 1, // the default height of a gridster item, if not specified
      minSizeX: 1, // minimum column width of an item
      maxSizeX: null, // maximum column width of an item
      minSizeY: 1, // minumum row height of an item
      maxSizeY: null, // maximum row height of an item
      resizable: {
        enabled: true,
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
        start: function(event, $element, widget) {}, // optional callback fired when resize is started,
        resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
        stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
      },
      draggable: {
        enabled: true, // whether dragging items is supported
        handle: '.my-class', // optional selector for resize handle
        start: function(event, $element, widget) {}, // optional callback fired when drag is started,
        drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
        stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
      }
    };





    $scope.linkModel('example', {
      name: 'Tom'
    }, 'modelData');

    $scope.customItemMap = [{
      sizeX: 6,
      sizeY: 1,
      row: 0,
      col: 0,
      dupe: "siema",
      siusiak: $scope.modelData
    } 
    ];

    // console.dir($scope.modelData);

    $scope.$watch('customItemMap', function(items){
      console.log("chuje muje");
    }, true);

    // $scope.$on('gridster-movable-changed', function(gridster) {
      // console.log('elo');
    // });


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