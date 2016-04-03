(function() {
    'use strict';

    angular.module('app')

        .service('Data', Data);

    Data.$inject = ['$http', 'API_URL'];

    function Data($http, API_URL) {

        var model = this;
        model.getLatest = getLatest;

        var urls = {
            LATEST: API_URL+'latest'
        };

        /**
         * Get the latest exchange rates
         * @returns {*}
         */

        function getLatest(){
            return $http.get(urls.LATEST).then(function(response){
                return response.data;
            });
        }

    }

})();