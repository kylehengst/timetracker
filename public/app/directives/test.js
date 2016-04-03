(function() {
    'use strict';

    angular
        .module('app.directives')
        .directive('dcTest', dcTest);

    function dcTest() {

        var directive = {
            link: link,
            templateUrl: 'app/directives/test.html',
            replace:true,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {

        }

    }

})();