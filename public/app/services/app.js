(function() {
    'use strict';

    angular.module('app')

        .service('App', App);

    App.$inject = ['Auth','$timeout'];

    function App(Auth, $timeout) {

        var model = this;
        model.user = -1;

        Auth.$onAuth(function (authData) {
            console.log(authData);
            $timeout(function () {
                model.user = authData;
            });
        });

    }

})();