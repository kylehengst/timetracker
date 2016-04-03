(function() {
    'use strict';

    angular.module('app.controllers')

        .controller('NavCtrl', NavCtrl);

    NavCtrl.$inject = ['$state','$stateParams', 'App','Auth'];

    function NavCtrl($state, $stateParams, App,Auth) {

        var navvm = this;
        navvm.App = App;
        navvm.logout = logout;
        
        function logout(){
            Auth.$unauth();
            $state.go('home');
        }

    }


})();