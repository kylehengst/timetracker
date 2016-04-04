(function() {
    'use strict';

    angular.module('app')

        .service('App', App);

    App.$inject = ['Auth','$rootScope','$timeout'];

    function App(Auth, $rootScope, $timeout) {

        var model = this;
        model.user = -1;

        $rootScope.loading++;

        Auth.$onAuth(function (authData) {
            $timeout(function () {
                $rootScope.loading--;
                model.user = authData;
            });
        });

    }

})();