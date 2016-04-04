(function () {
    'use strict';

    angular.module('app.controllers')
        .controller('JobsCtrl', JobsCtrl)
    ;

    JobsCtrl.$inject = ['$state', '$rootScope', 'Auth'];

    function JobsCtrl($state, $rootScope, Auth) {

        var jobsvm = this;


    }

})();