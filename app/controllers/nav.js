(function() {
    'use strict';

    angular.module('app.controllers')

        .controller('NavCtrl', NavCtrl);

    NavCtrl.$inject = ['$state','$stateParams', '$rootScope', 'Auth'];

    function NavCtrl($state, $stateParams, $rootScope, auth) {

        var navvm = this;
        navvm.auth = auth;
        navvm.logout = logout;
        
        function logout(){
            Auth.$unauth();
            $state.go('auth.login');
        }
    }


})();