(function() {
    'use strict';

    angular.module('app', [

        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.tooltip',
        'angularFileUpload',
        'firebase',
        'xeditable',

        'env',

        'app.routes',
        'app.filters',

        'app.directives',   
        'app.controllers'

    ]);

})();
