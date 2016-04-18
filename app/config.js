(function() {
    'use strict';

    angular.module('app.config', [])

        // prod || dev
        .constant('ENV','dev')
        .constant('API_URL','')
        .constant('FIREBASE_URL','https://time-tracker-angular.firebaseio.com/')

    ;

})();