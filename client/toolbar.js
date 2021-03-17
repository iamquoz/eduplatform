var app = angular.module('platform',['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngAnimate']);

  
app.controller('mainToolbar', function($scope){

});

app.controller('mainSidebar', function ($scope, $timeout, $mdSidenav) {
    $scope.toggleLeft  = function () {
      $mdSidenav('left').toggle();
    };
    $scope.openLeft  = function () {
      $mdSidenav('left').open();
    };
    $scope.closeLeft = function () {
      $mdSidenav('left').close();
    };
  }).controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('left').close();
    };
  });
