(function () {
    'use strict';

    angular.module('app')

        .factory('Loading', Loading);

    Loading.$inject = ['$rootScope', '$q','CONFIG'];

    function Loading($rootScope, $q, CONFIG) {

        return {
            request: function (config) {
                if(CONFIG.ENV=='dev') console.log(config);
                return config;
            },
            requestError: function (rejection) {
                if(CONFIG.ENV=='dev') console.log(rejection);
                return $q.reject(rejection);
            },
            response: function (response) {
                if(CONFIG.ENV=='dev') console.log(response);
                return response;
            },
            responseError: function (rejection) {
                if(CONFIG.ENV=='dev') console.log(rejection);
                return $q.reject(rejection);
            }
        }

    }

})();