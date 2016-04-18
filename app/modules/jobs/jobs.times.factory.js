(function() {
    'use strict';

    angular.module('app')

        .factory('JobsTimesFactory', JobsTimesFactory);

    JobsTimesFactory.$inject = ['FIREBASE_URL','$firebaseArray','$firebaseObject'];

    function JobsTimesFactory(FIREBASE_URL, $firebaseArray, $firebaseObject) {

        var url = FIREBASE_URL+'times/:job';

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