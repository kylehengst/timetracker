(function() {
    'use strict';

    angular.module('app.controllers')

        .controller('NavCtrl', NavCtrl);

    NavCtrl.$inject = ['$state','$stateParams', '$rootScope', 'Auth'];

    function NavCtrl($state, $stateParams, $rootScope, Auth) {

        var navvm = this;
        navvm.auth = Auth.$getAuth();
        navvm.logout = logout;

        function logout(){
            Auth.$unauth();
            $state.go('auth.login');
        }

        Auth.$onAuth(function(auth){
            navvm.auth = auth;
        });

    }


})();