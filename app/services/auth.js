(function() {
    'use strict';

    angular.module('app')

        .factory('Auth', Auth);

    Auth.$inject = ['$firebaseAuth', 'CONFIG'];

    function Auth($firebaseAuth, CONFIG) {

        var ref = new Firebase(CONFIG.FIREBASE_URL);
        return $firebaseAuth(ref);
        
        // return {
        //     get: function(){
        //         return $firebaseAuth(ref).$onAuth(function (authData) {
        //             return authData;
        //         });
        //     }
        // }

    }

})();