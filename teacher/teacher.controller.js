(function () {
    'use strict';

    angular
        .module('platform')
        .controller('HomeController', HomeController);
        HomeController.$inject = ['$cookies', 'UserService', '$scope', '$http'];
        function HomeController($cookies, UserService, $scope ,$http) {
            var vm = this;
            
            vm.user = null;
            vm.allUsers = [];
            vm.deleteUser = deleteUser;
            
        initController($http);
        

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }


        function loadCurrentUser() {
            $cookies = $cookies.globals;
            if (!$cookies)
                $cookies = false;
            else
                $cookies = JSON.parse($cookies);
        
            UserService.GetByUsername (!!($cookies) ? $cookies.currentUser.username : "")
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
            $http.get('./helpers/data.json').then(function(file){
                vm.allUsers = file.data.students;
                vm.allUsers.sort(function(a, b) {
                    if (a.stName < b.stName) return -1;
                    if (a.stName > b.stName) return 1;
                    return 0;
                })
            });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }
    }

   
})();