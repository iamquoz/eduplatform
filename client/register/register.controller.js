(function () {
    'use strict';

    angular
        .module('platform')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;

        
        function getLinkID() {
            var urlString = window.location.href;
            urlString = urlString.substring(0, urlString.search('#')) + urlString.substring(urlString.search('#') + 3);
            var url = new URL(urlString);
            return url.searchParams.get("id");
        }

        vm.linkID = getLinkID();

        function register() {
            vm.user.username = linkID;
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Регистрация прошла успешно', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();