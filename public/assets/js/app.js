(function() {
    'use strict';

    angular.module('env', [])

        .constant('CONFIG',{
            ENV:'dev',
            FIREBASE_URL: 'https://time-tracker-angular.firebaseio.com/'
        })

    ;

})();
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
(function () {
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

        .filter('fromNow', function () {

            return function (str) {

                return moment(str).fromNow();

            }

        })

        .filter('mimutesToHours', function () {
    
            return function (str) {
    
                var minutes = eval(str);
    
                var h = Math.floor(minutes / 60);
    
                var m = minutes - (h * 60);
    
                return h ? h + ' hrs ' + m + ' mins' : minutes + ' mins';
    
            }
    
        })

    ;

})();
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

        .run(function ($rootScope, CONFIG, editableOptions) {

            $rootScope.ENV = CONFIG.ENV;
            $rootScope.loading = 0;
            editableOptions.theme = 'bs3';

            //state listeners
            if (CONFIG.ENV == 'dev') {
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

    NavCtrl.$inject = ['$state','$stateParams', '$rootScope', 'Auth'];

    function NavCtrl($state, $stateParams, $rootScope, Auth) {

        var navvm = this;
        navvm.auth = Auth.$getAuth();
        navvm.logout = logout;

        function logout(){
            Auth.$unauth();
            $state.go('auth.login');
        }

        Auth.$onAuth(function(auth){
            navvm.auth = auth;
        });

    }


})();
(function() {
    'use strict';

    angular.module('app.controllers')

        .controller('TimersCtrl', TimersCtrl);

    TimersCtrl.$inject = ['$state','$stateParams', '$interval', 'Auth', 'Timers'];

    function TimersCtrl($state, $stateParams, $interval, Auth, Timers) {

        var timersvm = this;
        timersvm.auth = null;
        timersvm.timers = null;
        timersvm.start = start;
        timersvm.stop = stop;
        timersvm.add = add;
        timersvm.activeTimers = {};
        
        function start(timer){
            timersvm.activeTimers[timer.$id] = $interval(function(){
                timer.seconds++;
                if(timer.minutes==60){
                    timer.minutes = 0;
                    timer.seconds = 0;
                    timer.hours++;
                    timersvm.timers.$save(timer);
                } else if(timer.seconds==60){
                    timer.seconds = 0;
                    timer.minutes++;
                    timersvm.timers.$save(timer);
                }

            },1000);
        }
        function stop(timer){
            if(timersvm.activeTimers[timer.$id]){
                $interval.cancel(timersvm.activeTimers[timer.$id]);
                timersvm.activeTimers[timer.$id] = null;
                timersvm.timers.$save(timer);
            }
        }
        function add(){
            timersvm.timers.$add({user_id:timersvm.auth.uid,description:'',hours:0,minutes:0,seconds:0});
        }

        Auth.$onAuth(function(auth){
            if(!auth) {
                timersvm.auth = null;
                timersvm.timers = null;
                return;
            }
            timersvm.auth = auth;
            timersvm.timers = Timers.getAll(auth.uid);
        });

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
            templateUrl: 'views/directives/test.html',
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

        .factory('Auth', Auth);

    Auth.$inject = ['$firebaseAuth', 'CONFIG'];

    function Auth($firebaseAuth, CONFIG) {

        var ref = new Firebase(CONFIG.FIREBASE_URL);
        return $firebaseAuth(ref);
        
        // return {
        //     get: function(){
        //         return $firebaseAuth(ref).$onAuth(function (authData) {
        //             return authData;
        //         });
        //     }
        // }

    }

})();
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
(function () {
    'use strict';

    angular.module('app')

        .factory('Loading', Loading);

    Loading.$inject = ['$rootScope', '$q','CONFIG'];

    function Loading($rootScope, $q, CONFIG) {

        return {
            request: function (config) {
                if(CONFIG.ENV=='dev') console.log(config);
                return config;
            },
            requestError: function (rejection) {
                if(CONFIG.ENV=='dev') console.log(rejection);
                return $q.reject(rejection);
            },
            response: function (response) {
                if(CONFIG.ENV=='dev') console.log(response);
                return response;
            },
            responseError: function (rejection) {
                if(CONFIG.ENV=='dev') console.log(rejection);
                return $q.reject(rejection);
            }
        }

    }

})();
(function () {
    'use strict';

    angular.module('app')

        .factory('Timers', Timers);

    Timers.$inject = ['CONFIG', '$firebaseArray','$firebaseObject'];

    function Timers(CONFIG, $firebaseArray, $firebaseObject) {

        var url = CONFIG.FIREBASE_URL+'timers';

        return {
            getAll: function (uid) {
                var fb = new Firebase(url);
                return $firebaseArray(fb);
            }
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
                $state.go('app.jobs.list');
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
            authvm.error = '';
            Auth.$createUser({
                email: authvm.form.email,
                password: authvm.form.password
            }).then(function(userData) {
                $state.go('app.auth.login');
            }).then(function(authData) {
                $state.go('app.home');
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
(function () {
    'use strict';

    angular.module('app.controllers')
        .controller('JobsCtrl', JobsCtrl)
    ;

    JobsCtrl.$inject = ['$state','JobsFactory','user','jobs'];

    function JobsCtrl($state, JobsFactory,user,jobs) {

        var jobsvm = this;
        jobsvm.jobs = jobs;
        jobsvm.newJob = {name:'',user_id:user.uid,date:null};
        jobsvm.addJob = addJob;
        
        function addJob(){
            if(!jobsvm.newJob.name) {
                toastr.error('Error');
                return;
            };
            jobsvm.newJob.date = new Date().toISOString();
            JobsFactory.add(jobsvm.newJob).then(function(response){
                $state.go('jobs.job',{job:response.job.id});
            });
        }



    }

})();
(function () {
    'use strict';

    angular.module('app')

        .factory('JobsFactory', JobsFactory);

    JobsFactory.$inject = ['CONFIG', '$firebaseArray', '$firebaseObject'];

    function JobsFactory(CONFIG, $firebaseArray, $firebaseObject) {

        var url = CONFIG.FIREBASE_URL + 'jobs';

        return {
            getAll: function (uid) {
                var fb = new Firebase(url);
                var arr = $firebaseArray(fb.orderByChild('user_id').equalTo(uid));
                return arr.$loaded(function (data) {
                    return data;
                });
            },
            get: function (id) {
                var fbId = new Firebase(url + '/' + id);
                var obj = $firebaseObject(fbId);
                return obj.$loaded(function(data){
                    return data;
                })
            },
            add: function (data) {
                var fb = new Firebase(url);
                var arr = $firebaseArray(fb);
                return arr.$add(data).then(function (ref) {
                    return {job: {id: ref.key()}};
                })
            }
        }

    }

})();
(function () {
    'use strict';

    angular.module('app.controllers')
        .controller('JobsJobCtrl', JobsJobCtrl)
    ;

    JobsJobCtrl.$inject = ['$state', 'JobsFactory', 'JobsTimesFactory','user', 'job', 'times'];

    function JobsJobCtrl($state, JobsFactory, JobsTimesFactory, user, job, times) {

        var jobvm = this;

        jobvm.job = job;
        jobvm.updateJob = updateJob;
        jobvm.deleteJob = deleteJob;

        jobvm.times = times;
        jobvm.newTime = {minutes: 0, description: '', date: null, user_id: user.uid};
        jobvm.addTime = addTime;
        jobvm.updateTime = updateTime;
        jobvm.deleteTime = deleteTime;
        jobvm.totalTime = sumTime;

        sumTime();

        function addTime() {
            if (!jobvm.newTime.minutes || !jobvm.newTime.description) {
                toastr.error('Error');
                return;
            }
            jobvm.newTime.date = new Date().toISOString();
            JobsTimesFactory.add(job.$id,jobvm.newTime).then(function(){
                toastr.success('Time added');
                sumTime();
            });
        }
        function updateTime(time,which,data) {
            time[which] = data;
            jobvm.times.$save(time).then(function(){
                toastr.success('Time updated');
            });
        }
        function deleteTime(time) {
            jobvm.times.$remove(time).then(function(n){
                toastr.info('Time deleted');
                sumTime();
            }, function(error){
                toastr.error(error);
            });
        }
        function sumTime(){
            var t = 0;
            for(var i = 0; i<jobvm.times.length; i++){
                t += jobvm.times[i].minutes;
            }
            jobvm.totalTime = t;
        }

        function updateJob(name) {
            jobvm.job.name = name;
            jobvm.job.$save().then(function (data) {
                toastr.success('Saved');
                return;
            })
        }
        function deleteJob(){
            jobvm.job.$remove().then(function(){
                toastr.success('Job deleted');
                $state.go('jobs.list');
            }, function(error){
                toastr.error(error);
            })
        }
        

    }

})();
(function() {
    'use strict';

    angular.module('app')

        .factory('JobsTimesFactory', JobsTimesFactory);

    JobsTimesFactory.$inject = ['CONFIG','$firebaseArray','$firebaseObject'];

    function JobsTimesFactory(CONFIG, $firebaseArray, $firebaseObject) {

        var url = CONFIG.FIREBASE_URL+'times/:job';

        return {
            getAll: function(jobId,uid){
                var fb = new Firebase(url.replace(':job',jobId));
                var arr = $firebaseArray(fb.orderByChild('user_id').equalTo(uid));
                return arr.$loaded(function(data){
                    return data;
                });
            },
            delete: function(timeId){
                var fbId = new Firebase(url+'/'+id);
                return $firebaseObject(fbId);
            },
            add: function(jobId, data){
                var fb = new Firebase(url.replace(':job',jobId));
                var arr = $firebaseArray(fb);
                return arr.$add(data).then(function(ref){
                    return {time:{id:ref.key()}};
                })
            }
        }

    }

})();
(function () {
    'use strict';

    angular.module('app.controllers')
        .controller('ProfileCtrl', ProfileCtrl)
    ;

    ProfileCtrl.$inject = ['$state', '$rootScope', 'Auth'];

    function ProfileCtrl($state, $rootScope, Auth) {

        var profilevm = this;
        profilevm.form = {email:'',oldEmail:'',newEmail:'',password:'',oldPassword:'',newPassword:''};
        profilevm.error = '';
        profilevm.submitEmailForm = submitEmailForm;
        profilevm.submitPasswordForm = submitPasswordForm;

        function submitEmailForm(){
            profilevm.error = '';
            profilevm.emailUpdated = false;
            Auth.$changeEmail({
                oldEmail: profilevm.form.email,
                newEmail: profilevm.form.newEmail,
                password: profilevm.form.password
            }).then(function(userData) {
                profilevm.emailUpdated = true;
            }).catch(function(error) {
                profilevm.error = error.toString();
            });

        };

        function submitPasswordForm(){
            profilevm.error = '';
            profilevm.passwordUpdated = false;
            Auth.$changePassword({
                email: profilevm.form.email,
                oldPassword: profilevm.form.oldPassword,
                newPassword: profilevm.form.newPassword
            }).then(function(userData) {
                // $state.go('auth.login');
                profilevm.passwordUpdated = true;
            }).catch(function(error) {
                profilevm.error = error.toString();
            });

        };

    }

})();