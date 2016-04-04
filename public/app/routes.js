(function () {
    'use strict';

    angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

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
                .state('profile', {
                    url: '/profile',
                    templateUrl: 'app/modules/profile/index.html',
                    controller: 'ProfileCtrl',
                    controllerAs: 'profilevm'
                })
                .state('jobs', {
                    abstract: true,
                    url: '/jobs',
                    templateUrl: 'app/modules/jobs/index.html'
                })
                .state('jobs.list', {
                    url:'',
                    templateUrl: 'app/modules/jobs/jobs.html',
                    controller: 'JobsCtrl',
                    controllerAs: 'jobsvm'
                })

            ;

            $urlRouterProvider.otherwise('/');
            // $locationProvider.html5Mode(true);

            $httpProvider.interceptors.push('Loading');

        })

        .run(function ($rootScope, ENV) {

            $rootScope.ENV = ENV;
            $rootScope.loading = 0;

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