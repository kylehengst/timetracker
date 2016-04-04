(function () {
    'use strict';

    angular.module('app')

        .factory('Loading', Loading);

    Loading.$inject = ['$rootScope', '$q'];

    function Loading($rootScope, $q) {

        return {
            request: function (config) {
                $rootScope.loading++;
                return config;
            },
            requestError: function (rejection) {
                return $q.reject(rejection);
            },
            response: function (response) {
                $rootScope.loading--;
                return response;
            },
            responseError: function (rejection) {
                $rootScope.loading--;
                return $q.reject(rejection);
            }
        }

    }

})();