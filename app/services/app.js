(function() {
    'use strict';

    angular.module('app')

        .service('App', App);

    App.$inject = ['Auth','$state','$rootScope','$timeout'];

    function App(Auth, $state, $rootScope, $timeout) {

        var model = this;
        model.user = -1;

        Auth.$onAuth(function (authData) {
            model.user = authData;
            if(!authData){
                $state.go('auth.login');
            }
        });

    }

})();