(function() {
    'use strict';

    angular.module('app.controllers')

        .controller('TimersCtrl', TimersCtrl);

    TimersCtrl.$inject = ['$state','$stateParams', '$interval', 'Auth', 'Timers'];

    function TimersCtrl($state, $stateParams, $interval, Auth, Timers) {

        var timersvm = this;
        timersvm.auth = Auth.$getAuth();
        timersvm.timers = timersvm.auth ? Timers.getAll(timersvm.auth.uid) : null;
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
            console.log('timers',auth);
            timersvm.auth = auth;
        });

    }

})();