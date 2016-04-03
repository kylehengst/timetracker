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

        'app.routes',
        'app.config',
        'app.filters',

        'app.directives',
        'app.controllers'

    ]);

})();

(function() {
    'use strict';

    angular.module('app.config', [])

        // prod || env
        .constant('ENV','dev')
        .constant('API_URL','')
        .constant('FIREBASE_URL','https://time-tracker-angular.firebaseio.com/')

    ;

})();
(function() {
    'use strict';

    angular.module('app.controllers', []);


})();
(function() {
    'use strict';

    angular
        .module('app.directives',[])

        .directive('reallyClick', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.bind('click', function() {
                        var message = attrs.reallyMessage;
                        if (message && confirm(message)) {
                            scope.$apply(attrs.reallyClick);
                        }
                    });
                }
            }
        })

    ;


})();
(function() {
    'use strict';

    angular.module('app.filters', [])

        .filter('objToArr', function () {

            return function (items) {
                if (!items) return [];
                return Object.keys(items)
                    .map(function (key) {
                        items[key].id = key;
                        return items[key];
                    });
            }

        })

        .filter('toArray', function () {

            return function (obj, id) {
                var result = [];
                var k = id ? id : 'id';
                angular.forEach(obj, function (val, key) {
                    val[k] = key;
                    result.push(val);
                });
                return result;
            };

        })

    ;

})();
(function () {
    'use strict';

    angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider

                .state('home', {
                    url: '',
                    resolve: {},
                    templateUrl: 'app/views/index.html',
                    controller: 'MainCtrl',
                    controllerAs: 'mainvm'
                })
                .state('auth', {
                    abstract: true,
                    url:'/auth',
                    templateUrl: 'app/modules/auth/index.html',
                })
                .state('auth.login', {
                    url: '/login',
                    templateUrl: 'app/modules/auth/login.html',
                    controller: 'AuthLoginCtrl',
                    controllerAs: 'authvm'
                })
                .state('auth.signup', {
                    url: '/signup',
                    templateUrl: 'app/modules/auth/signup.html',
                    controller: 'AuthSignupCtrl',
                    controllerAs: 'authvm'
                })
                .state('auth.forgot', {
                    url: '/forgot',
                    templateUrl: 'app/modules/auth/forgot.html',
                    controller: 'AuthForgotCtrl',
                    controllerAs: 'authvm'
                })

            ;

            $urlRouterProvider.otherwise('/');
            // $locationProvider.html5Mode(true);

        })

        .run(function ($rootScope, ENV) {

            $rootScope.ENV = ENV;

            //state listeners
            if (ENV == 'dev') {
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
                });
                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                    console.log('$stateChangeError - fired when an error occurs during transition.');
                    console.log(error);
                });
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
                });
                $rootScope.$on('$viewContentLoaded', function (event) {
                    console.log('$viewContentLoaded - fired after dom rendered', event);
                });
                $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                    console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
                    console.log(unfoundState, fromState, fromParams);
                });
            }

        })

    ;

})();
(function() {
    'use strict';

    angular.module('app.controllers')

        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$state','$stateParams', '$http'];

    function MainCtrl($state, $stateParams, $http) {

        var mainvm = this;
        mainvm.hello = 'Hello';

        activate();

        function activate()
        {
            // toastr.info('Main Controller');
        }

    }


})();
(function() {
    'use strict';

    angular.module('app.controllers')

        .controller('NavCtrl', NavCtrl);

    NavCtrl.$inject = ['$state','$stateParams', 'App','Auth'];

    function NavCtrl($state, $stateParams, App,Auth) {

        var navvm = this;
        navvm.App = App;
        navvm.logout = logout;
        
        function logout(){
            Auth.$unauth();
            $state.go('home');
        }

    }


})();
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
(function() {
    'use strict';

    angular.module('app')

        .service('App', App);

    App.$inject = ['Auth','$timeout'];

    function App(Auth, $timeout) {

        var model = this;
        model.user = -1;

        Auth.$onAuth(function (authData) {
            console.log(authData);
            $timeout(function () {
                model.user = authData;
            });
        });

    }

})();
(function() {
    'use strict';

    angular.module('app')

        .factory('Auth', Auth);

    Auth.$inject = ['$firebaseAuth', 'FIREBASE_URL'];

    function Auth($firebaseAuth, FIREBASE_URL) {

        var ref = new Firebase(FIREBASE_URL);
        return $firebaseAuth(ref);

    }

})();
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
(function () {
    'use strict';

    angular.module('app.controllers')
        .controller('AuthLoginCtrl', AuthLoginCtrl)
        .controller('AuthSignupCtrl', AuthSignupCtrl)
        .controller('AuthForgotCtrl', AuthForgotCtrl)
    ;

    AuthLoginCtrl.$inject = ['$state', 'Auth'];
    AuthSignupCtrl.$inject = ['$state', 'Auth'];
    AuthForgotCtrl.$inject = ['$state', 'Auth'];

    function AuthLoginCtrl($state, Auth) {

        var authvm = this;

        authvm.form = {email: '', password: ''};
        authvm.error = '';
        authvm.submitForm = submitForm;

        function submitForm() {

            authvm.error = '';

            Auth.$authWithPassword({
                email: authvm.form.email,
                password: authvm.form.password
            }).then(function (user) {
                console.log(user);
                $state.go('home');
            }, function (error) {
                authvm.error = error.toString();
            });

        }

    }

    function AuthSignupCtrl($state, Auth) {

        var authvm = this;
        
        authvm.form = {email:'',password:''};
        authvm.error = '';
        authvm.submitForm = submitForm;

        function submitForm(){
            console.log('submit');
            authvm.error = '';
            Auth.$createUser({
                email: authvm.form.email,
                password: authvm.form.password
            }).then(function(userData) {
                $state.go('auth.login');
            }).then(function(authData) {
                $state.go('home');
            }).catch(function(error) {
                authvm.error = error.toString();
            });

        };

    }

    function AuthForgotCtrl($state, Auth) {

        var authvm = this;

        authvm.form = {email:''};
        authvm.error = '';
        authvm.submitForm = submitForm;

        function submitForm(){
            authvm.error = '';
            authvm.sent = false;
            Auth.$resetPassword({
                email: authvm.form.email
            }).then(function(userData) {
                // $state.go('auth.login');
                authvm.sent = true;
            }).catch(function(error) {
                authvm.error = error.toString();
            });

        };
        
    }


})();