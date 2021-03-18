var app = angular.module('platform',['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngAnimate', 'ngGrid']);

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
  
  app.controller("mainDiary", function($scope, $http){
    $http.get("./data.json")
    .then(function (file) {
      	$scope.teacher = file.data.teacher;
      	$scope.group = file.data.group;
		$scope.students = file.data.students;
    }
    ,function (data) {
        console.log("there was an error");
    });
});

app.controller('tableCtrl', function($scope, $http){
	$http.get("./data.json").then(function(file) {
		$scope.students = file.data.students;
	});
	$scope.gridOptions = {
		data: 'students',
		enableRowSelection: false,
    rowHeight: 60,
    headerRowHeight: 60,
		columnDefs:[
			{displayName:"ФИО", field: "stName", width: "65%"},
			{displayName:"Баллы", field: "stScore", width: "35%"}
		]
	}	
		
});