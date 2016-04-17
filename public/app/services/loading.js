(function () {
    'use strict';

    angular.module('app')

        .factory('Loading', Loading);

    Loading.$inject = ['$rootScope', '$q','ENV'];

    function Loading($rootScope, $q, ENV) {

        return {
            request: function (config) {
                if(ENV=='dev') console.log(config);
                return config;
            },
            requestError: function (rejection) {
                if(ENV=='dev') console.log(rejection);
                return $q.reject(rejection);
            },
            response: function (response) {
                if(ENV=='dev') console.log(response);
                return response;
            },
            responseError: function (rejection) {
                if(ENV=='dev') console.log(rejection);
                return $q.reject(rejection);
            }
        }

    }

})();