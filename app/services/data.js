(function() {
    'use strict';

    angular.module('app')

        .service('Data', Data);

    Data.$inject = ['$http', 'CONFIG'];

    function Data($http, CONFIG) {

        var model = this;
        model.getLatest = getLatest;

        var urls = {
            //LATEST: CONFIG.API_URL+'latest'
        };

        /**
         * Get the latest exchange rates
         * @returns {*}
         */

        function getLatest(){
            //return $http.get(urls.LATEST).then(function(response){
            //    return response.data;
            //});
        }

    }

})();