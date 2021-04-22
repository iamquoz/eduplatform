var currUser;
angular.module('platform', ['ngRoute', 'ngCookies', 'ngAria', 'ngMaterial', 'ngMessages', 'chart.js'])

.controller('addStudent', function($scope, $mdDialog, $http){
    $scope.showPrompt = function(ev) {
        var confirm = $mdDialog.prompt()
            .title("Добавление студента")
            .textContent('Введите полное имя студента')
            .placeholder('ФИО')
            .ariaLabel('label')
            .targetEvent(ev)
            .required(true)
            .ok('ОК')
            .cancel('Отмена');
        $mdDialog.show(confirm).then(function(result){
            $http.post('localhost:8080/Flop', { 'Int' : 3})
                .then(function(){
                    alert(result + "lol");
                })
            alert(result);
        }, function(result){});
    }
})

.controller('addTask', function($scope, $mdDialog, $http) {
    var task = {
        Difficulty: '1',
        Text: '',
        IsOpen: false,
        Variants: [],
        Answer: '',
        ID: 0
    };
    
    var tempStr = {
        strAnsw: ''
    }
    $scope.showPrompt = function(evt) {
        $mdDialog.show({
          controller: function($scope) {
            angular.extend($scope, {
              tempStr,
              task, 
              closeDialog: function (toSend){
                if (toSend){
                    task.Variants = tempStr.strAnsw.split("\n");
                    console.log("send to api");
                    console.log(task);
                }
                else {
                    console.log("don't send");
                }
                $mdDialog.hide();
              }
            });
          },
          templateUrl: './teacher/addTask.tmpl.html',
          targetEvent: evt,
          clickOutsideToClose: true,
        });
      };
})

.controller('addTheory', function($scope, $mdDialog, $http){
    var theory = {
        ID: 0,
        Title: '',
        Text: ''
    }

    $scope.showPrompt = function(evt) {
        $mdDialog.show({
          controller: function($scope) {
            angular.extend($scope, {
              theory,
              closeDialog: function (toSend){
                if (toSend) {
                    console.log("send to api");
                    console.log(theory);
                }
                else {
                    console.log("don't send");
                }
                $mdDialog.hide();
              }
            });
          },
          templateUrl: './teacher/addTheory.tmpl.html',
          targetEvent: evt,
          clickOutsideToClose: true,
        });
      };
})

.controller('giveTask', function($scope, $mdDialog, $http){
    
    var order = {
        Users: [],
        Theory: [],
        Tasks: []
    }
    var tempUsers = [];

    function initUsers() {
        $http.get('./helpers/data.json').then(function(file){
            tempUsers = file.data.students;
            tempUsers.sort(function(a, b) {
                if (a.stName < b.stName) return -1;
                if (a.stName > b.stName) return 1;
                return 0;
            })
        });
    }

    var tempTheories = [];
    function initTheor() {
        $http.get('./helpers/theories.json').then(function(file) {
            tempTheories = file.data.theory
        });
        console.log(tempTheories);
    };

    var tempTasks = [];
    function initTasks() {
        $http.get('./helpers/tasks.json').then(function(file) { 
            tempTasks = file.data.tasks
        });
    };

    function initAll(){
        tempTasks.length = 0;
        tempTheories.length = 0;
        tempUsers.length = 0;
        initUsers();
        initTheor();
        initTasks();
    }

    initAll();
    $scope.showPrompt = function(evt) {
        $mdDialog.show({
          controller: function($scope) {
            angular.extend($scope, {
              order,
              tempUsers,
              tempTasks,
              tempTheories,
              closeDialog: function (toSend){
                if (toSend) {
                    
                    tempUsers = tempUsers.filter(function(name){
                        if (name.selected) return name.id;
                    });
                    tempUsers.forEach(function(name) {order.Users.push(name.id);});

                    tempTheories = tempTheories.filter(function(name) {
                        if (name.selected) return name.id;
                    });
                    tempTheories.forEach(function(name) {order.Theory.push(name.id);});

                    tempTasks = tempTasks.filter(function(name) {
                        if (name.selected) return name.id;
                    });
                    tempTasks.forEach(function(name) {order.Tasks.push(name.id);});

                    initAll();

                    console.log("send to api");
                    console.log(order);
                }
                else {
                    console.log("don't send");
                }
                $mdDialog.hide();
              }
            });
          },
          templateUrl: './teacher/giveTask.tmpl.html',
          targetEvent: evt,
          clickOutsideToClose: true,
        });
      };
})

.controller('stListCtrl', function($scope, $mdDialog, $http) {
    var stCtrl = {theories: [], stats: [], selected: -1, viewTasks: -1, boolTasks: false};
    $scope.boolTasks = false;
	$http.get('./helpers/exampleStats.json')
		.then(function(file) {
			stCtrl.theories = file.data.themes;
			stCtrl.stats = file.data.answers;
			console.log(stCtrl);
		});
    $http.get('./helpers/exampleTasks.json')
        .then(function(file){
            stCtrl.allTasks = file.data.tasks;
            console.log(stCtrl.allTasks);
        });

    stCtrl.solvedTasks = Array(16).fill().map((item, index)=> 1 + index);
    $scope.isCorrect;
    $scope.correctFromTeacher;
    $scope.showPrompt = function(evt, stInfo) {
        $mdDialog.show({
            controller: function($scope) {
				angular.extend($scope, {
                    stInfo,
                    stCtrl,
                    closeDialog: function(action) {
                        // action == 1 - delete user
                        // action == 0 - close
                        if (action == 1){
                            var confirm = $mdDialog.confirm()
                                .title("Вы уверены?")
                                .textContent("Вы удаляете пользователя \"" + stInfo.stName + "\"")
                                .ok("Да")
                                .cancel("Отмена");
                            $mdDialog.show(confirm).then(function() {
                                alert("user " + stInfo.id + " deleted");
                            }, function(){});
                        }
                        $mdDialog.hide();
                    },
					getData: function(index) {
						stCtrl.selected = index;
                        stCtrl.boolTasks = !(stCtrl.selected == -1);

						$scope.options0 = {maintainAspectRatio: true, title: {display: true, text: "Общее количество", fontSize: 14}};
                        $scope.options1 = {maintainAspectRatio: true, title: {display: true, text: "Базовый уровень", fontSize: 14}};
						$scope.options2 = {maintainAspectRatio: true, title: {display: true, text: "Продвинутый уровень", fontSize: 14}};
						$scope.options3 = {maintainAspectRatio: true, title: {display: true, text: "Высокий уровень", fontSize: 14}};
						$scope.options4 = {maintainAspectRatio: true, title: {display: true, text: "Четвертый уровень", fontSize: 14}};

						$scope.data = stCtrl.stats[index];	
						$scope.labels = ["Правильных", "Неправильных"];
						$scope.allData = [$scope.data['correctTotal'], $scope.data['wrongTotal']];

						$scope.firstLevel 	= [$scope.data['levelsCorrect'][0], $scope.data['levelsWrong'][0]];
						$scope.secondLevel 	= [$scope.data['levelsCorrect'][1], $scope.data['levelsWrong'][1]];
						$scope.thirdLevel 	= [$scope.data['levelsCorrect'][2], $scope.data['levelsWrong'][2]];
						$scope.fourthLevel 	= [$scope.data['levelsCorrect'][3], $scope.data['levelsWrong'][3]];
					},
                    getTasksData: function(index) {
                        stCtrl.date = new Date();
                        stCtrl.viewTasks = index;
                    }
                });
			},
            templateUrl: './teacher/viewSt.tmpl.html',
            targetEvent: evt,
            clickOutsideToClose: true
        })
    }
})

.controller('viewStats', function($scope, $mdDialog, $http) {
	var stCtrl = {theories: [], stats: [], selected: -1, viewTasks: -1, boolTasks: false};
    $scope.boolTasks = false;
	$http.get('./helpers/exampleStats.json')
		.then(function(file) {
			stCtrl.theories = file.data.themes;
			stCtrl.stats = file.data.answers;
			console.log(stCtrl);
		});
    $http.get('./helpers/exampleTasks.json')
        .then(function(file){
            stCtrl.allTasks = file.data.tasks;
            console.log(stCtrl.allTasks);
        });

    stCtrl.solvedTasks = Array(16).fill().map((item, index)=> 1 + index);

    $scope.showPrompt = function(evt){
		$mdDialog.show({
			controller: function($scope){
				angular.extend($scope, {
					currUser,
					stCtrl,
					closeDialog: function() {
						stCtrl.selected = -1;
                        stCtrl.viewTasks = -1;
                        stCtrl.boolTasks = false;
						$mdDialog.hide();
					},
					getData: function(index) {
						stCtrl.selected = index;
                        stCtrl.boolTasks = !(stCtrl.selected == -1);

						$scope.options0 = {maintainAspectRatio: true, title: {display: true, text: "Общее количество", fontSize: 14}};
						$scope.options1 = {maintainAspectRatio: true, title: {display: true, text: "Базовый уровень", fontSize: 14}};
						$scope.options2 = {maintainAspectRatio: true, title: {display: true, text: "Продвинутый уровень", fontSize: 14}};
						$scope.options3 = {maintainAspectRatio: true, title: {display: true, text: "Высокий уровень", fontSize: 14}};
						$scope.options4 = {maintainAspectRatio: true, title: {display: true, text: "Четвертый уровень", fontSize: 14}};

						$scope.data = stCtrl.stats[index];	
						$scope.labels = ["Правильных", "Неправильных"];
						$scope.allData = [$scope.data['correctTotal'], $scope.data['wrongTotal']];

						$scope.firstLevel 	= [$scope.data['levelsCorrect'][0], $scope.data['levelsWrong'][0]];
						$scope.secondLevel 	= [$scope.data['levelsCorrect'][1], $scope.data['levelsWrong'][1]];
						$scope.thirdLevel 	= [$scope.data['levelsCorrect'][2], $scope.data['levelsWrong'][2]];
						$scope.fourthLevel 	= [$scope.data['levelsCorrect'][3], $scope.data['levelsWrong'][3]];
					},
                    getTasksData: function(index) {
                        stCtrl.date = new Date();
                        stCtrl.viewTasks = index;
                    }
				})
			},
			templateUrl: './student/viewOwn.tmpl.html',
			targetEvent: evt,
			clickOutsideToClose: true
		}).finally(function(){
            stCtrl.selected = -1;
            stCtrl.viewTasks = -1;
            stCtrl.boolTasks = false;
		});
    };
})

.controller('viewTests', function($scope, $mdDialog, $http) {
    var vm = this;
    vm.textTrivia = "Целые числа a и b называются  сравнимыми по модулю m, если разность a – b  делится на m, т.е. если  m | a – b.",
    vm.textQuestion = [
        "Можно ли привести примеры двух целых чисел, сравнимых по модулям 2, 4, 6, но несравнимых по модулю 3?",
        "Каков минимальный модуль, по которому сравнима любая пара целых чисел?"
        ]
    vm.selected = -1;
    
    vm.intIndex = 0;    

    vm.attempts = 0;
    
    vm.answer = '';
    vm.actualAnsw = '1';
    $http.get('./helpers/exampleStats.json')
        .then(function(file) {
            vm.theories = file.data.themes;
        });
    $scope.showPrompt = function(evt) {
        $mdDialog.show({
            controller: function($scope) {
                angular.extend($scope, {
                    vm,
                    incInd: function(answ) {
                        if (vm.intIndex == 1 && answ != vm.actualAnsw) {
                            vm.attempts++;
                            if (vm.attempts == 4) {
                                vm.intIndex++;
                                vm.attempts = 0;
                            }
                            vm.answer = '';
                            return;
                        }
                        vm.intIndex++;
                    },
                    getData: function(index) {
                        vm.selected = index;
                        console.log(vm.selected);
                    },
                    closeDialog: function() {
                        $mdDialog.hide();
                    }
                })
            },
            templateUrl: './student/viewTests.tmpl.html',
            targetEvent: evt,
            clickOutsideToClose: true
        }
        ).finally(function() {
            vm.intIndex = 0;
            vm.attempts = 0;
            vm.selected = -1;
            vm.answer = '';
        })
    }
})


.filter('roundup', function () {
    return function (value) {
        return Math.round(value * 10) / 10;
    };
})

.filter('spaceFilter', function() {
    return function(str,filterOn,limit) {
      if (limit) {
        return str.substring(0, str.split(filterOn, limit).join(filterOn).length);
      } else {
        return str;
      }
    }
})

.config(config)
.run(run);

config.$inject = ['$routeProvider', '$locationProvider', '$injector'];
function config($routeProvider, $locationProvider) {
    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
    }]);

    $cookies = $cookies.get('globals');
    if ($cookies){
        $cookies = JSON.parse($cookies);
        currUser = $cookies.currentUser;
    }


    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: (currUser && currUser.authdata[0] == '1') ? './teacher/teacher.view.html': './student/student.view.html',
            controllerAs: 'vm'
        })

        .when('/login', {
            controller: 'LoginController',
            templateUrl: './login/login.view.html',
            controllerAs: 'vm'
        })

        .when('/register', {
            controller: 'RegisterController',
            templateUrl: './register/register.view.html',
            controllerAs: 'vm'
        })

        .otherwise({ redirectTo: '/login' });

}

run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
function run($rootScope, $location, $cookies, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.get('globals');
    console.log('run');
    console.log($rootScope.globals);
    if ($rootScope.globals)
        $rootScope.globals = JSON.parse($rootScope.globals);
    console.log($rootScope.globals);
    if ( $rootScope.globals && $rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }



    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        if (($location.path() !== '/login' && $location.path() !== '/register') && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }

        $rootScope.globals = $cookies.get('globals');

        console.log('run');

        console.log($rootScope.globals);
        if ($rootScope.globals)
            $rootScope.globals = JSON.parse($rootScope.globals);
        if (currUser.authdata != $rootScope.globals.currentUser.authdata) {
            currUser = $rootScope.globals.currentUser;
            window.location.reload();
        }
        
    });
}

