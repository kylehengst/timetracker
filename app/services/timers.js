(function () {
    'use strict';

    angular.module('app')

        .factory('Timers', Timers);

    Timers.$inject = ['FIREBASE_URL', '$firebaseArray','$firebaseObject'];

    function Timers(FIREBASE_URL, $firebaseArray, $firebaseObject) {

        var url = FIREBASE_URL+'timers';

        return {
            getAll: function (uid) {
                var fb = new Firebase(url);
                return $firebaseArray(fb);
            }
        }

    }

})();