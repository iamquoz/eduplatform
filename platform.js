angular.module('platform', ['ngRoute', 'ngCookies', 'ngAria', 'ngMaterial', 'ngMessages'])

.controller('addStudent', function($scope, $mdDialog){
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
            alert(result);
        }, function(result){});
    }
})

.controller('addTask', function($scope, $mdDialog) {
    var task = {
        difficulty: '1',
        text: '',
        isOpen: false,
        variants: [],
        answer: ''
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
                    console.log(tempStr);
                    task.variants = tempStr.strAnsw.split("\n");
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

.controller('stListCtrl', function($scope, $mdDialog, $http) {
    $scope.showPrompt = function(evt, stInfo) {
        $mdDialog.show({
            controller: function($scope) {
				angular.extend($scope, {
                    stInfo,
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
                    }
                });
			},
            templateUrl: './teacher/viewSt.tmpl.html',
            targetEvent: evt,
            clickOutsideToClose: true
        })
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
    if (!$cookies)
        $cookies = false;
    else
        $cookies = JSON.parse($cookies);
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: (!!$cookies && $cookies.currentUser.authdata[0] == '1') ? 'teacher/teacher.view.html': 'student/student.view.html',
            controllerAs: 'vm'
        })

        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
        })

        .when('/register', {
            controller: 'RegisterController',
            templateUrl: 'register/register.view.html',
            controllerAs: 'vm'
        })

        .otherwise({ redirectTo: '/login' });

}

run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
function run($rootScope, $location, $cookies, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.get('globals') || {};
    console.log('run');
    console.log($rootScope.globals);
    var aNiceCookie;
    if ($rootScope.globals.toString()[1] == "o")
        return;
    aNiceCookie = JSON.parse($rootScope.globals);
    console.log(aNiceCookie.currentUser);
    if ($rootScope.globals) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + aNiceCookie.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = aNiceCookie.currentUser;
        console.log(loggedIn);   
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    });
}