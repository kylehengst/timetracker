(function () {
    'use strict';

    angular.module('app')

        .factory('Timers', Timers);

    Timers.$inject = ['CONFIG', '$firebaseArray','$firebaseObject'];

    function Timers(CONFIG, $firebaseArray, $firebaseObject) {

        var url = CONFIG.FIREBASE_URL+'timers';

        return {
            getAll: function (uid) {
                var fb = new Firebase(url);
                return $firebaseArray(fb);
            }
        }

    }

})();