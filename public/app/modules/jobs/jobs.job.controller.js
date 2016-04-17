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