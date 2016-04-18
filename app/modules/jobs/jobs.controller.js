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