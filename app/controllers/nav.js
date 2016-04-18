(function() {
    'use strict';

    angular.module('app.controllers')

        .controller('NavCtrl', NavCtrl);

    NavCtrl.$inject = ['$state','$stateParams', '$rootScope', 'App','Auth'];

    function NavCtrl($state, $stateParams, $rootScope, App, Auth) {

        var navvm = this;
        navvm.App = App;
        navvm.logout = logout;
        
        function logout(){
            Auth.$unauth();
            $state.go('auth.login');
        }

    }


})();