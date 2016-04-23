(function () {
    'use strict';

    angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

            $stateProvider

                .state('app', {
                    url: '/app',
                    abstract: true,
                    resolve: {
                        auth: function (Auth) {
                            return Auth.$waitForAuth().then(function () {
                                return Auth.$getAuth();
                            });
                        }
                    },
                    views: {
                        'nav@': {
                            templateUrl: 'views/nav.html',
                            controller: 'NavCtrl',
                            controllerAs: 'navvm'
                        },
                        'timers@': {
                            templateUrl: 'views/timers.html',
                            controller: 'TimersCtrl',
                            controllerAs: 'timersvm'
                        }
                    }
                })
                .state('app.home', {
                    url: '/home',
                    resolve: {},
                    onEnter: function ($state, auth) {
                        if (!auth) $state.go('app.auth.login');
                    },
                    views: {
                        '@': {
                            templateUrl: 'views/index.html',
                            controller: 'MainCtrl',
                            controllerAs: 'mainvm'
                        }
                    }
                })
                .state('app.auth', {
                    abstract: true,
                    url: '/auth',
                    templateUrl: 'views/auth/index.html'
                })
                .state('app.auth.login', {
                    url: '/login',
                    views: {
                        '@': {
                            templateUrl: 'views/auth/login.html',
                            controller: 'AuthLoginCtrl',
                            controllerAs: 'authvm'
                        }
                    }
                })
                .state('app.auth.signup', {
                    url: '/signup',
                    views: {
                        '@': {
                            templateUrl: 'views/auth/signup.html',
                            controller: 'AuthSignupCtrl',
                            controllerAs: 'authvm'
                        }
                    }
                })
                .state('app.auth.forgot', {
                    url: '/forgot',
                    views: {
                        '@': {
                            templateUrl: 'views/auth/forgot.html',
                            controller: 'AuthForgotCtrl',
                            controllerAs: 'authvm'
                        },
                    }
                })
                .state('app.profile', {
                    url: '/profile',
                    resolve: {
                        user: function (Auth) {
                            return Auth.$requireAuth();
                        }
                    },
                    onEnter: function (user, $state) {
                        if (!user) $state.go('home');
                    },
                    views: {
                        '@': {
                            templateUrl: 'views/profile/index.html',
                            controller: 'ProfileCtrl',
                            controllerAs: 'profilevm'
                        }
                    }
                })
                .state('app.jobs', {
                    abstract: true,
                    resolve: {
                        user: function (Auth) {
                            return Auth.$requireAuth();
                        }
                    },
                    onEnter: function (user, $state) {
                        if (!user) $state.go('home');
                    },
                    url: '/jobs',
                    templateUrl: 'views/jobs/index.html'
                })
                .state('app.jobs.list', {
                    url: '',
                    resolve: {
                        jobs: function (JobsFactory, user) {
                            return JobsFactory.getAll(user.uid);
                        }
                    },
                    views: {
                        '@': {
                            templateUrl: 'views/jobs/jobs.html',
                            controller: 'JobsCtrl',
                            controllerAs: 'jobsvm'
                        }
                    }
                })
                .state('app.jobs.job', {
                    url: '/:job',
                    resolve: {
                        job: function (JobsFactory, $stateParams) {
                            return JobsFactory.get($stateParams.job);
                        },
                        times: function (JobsTimesFactory, $stateParams, user) {
                            return JobsTimesFactory.getAll($stateParams.job, user.uid);
                        }
                    },
                    onEnter: function ($state, job, user) {
                        if (job.user_id != user.uid) $state.go('home');
                    },
                    views: {
                        '@': {
                            templateUrl: 'views/jobs/job.html',
                            controller: 'JobsJobCtrl',
                            controllerAs: 'jobvm'
                        }
                    }
                })

            ;

            $urlRouterProvider.otherwise('/app/home');
            // $locationProvider.html5Mode(true);

            $httpProvider.interceptors.push('Loading');

        })

        .run(function ($rootScope, ENV, editableOptions) {

            $rootScope.ENV = ENV;
            $rootScope.loading = 0;
            editableOptions.theme = 'bs3';

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

            $rootScope.offcanvas = false;
            $rootScope.toggleTimers = function(){
                console.log($rootScope.offcanvas);
                $rootScope.offcanvas = !$rootScope.offcanvas;
            }

        })

    ;

})();