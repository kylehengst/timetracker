(function () {
    'use strict';

    angular.module('app')

        .factory('JobsFactory', JobsFactory);

    JobsFactory.$inject = ['FIREBASE_URL', '$firebaseArray', '$firebaseObject'];

    function JobsFactory(FIREBASE_URL, $firebaseArray, $firebaseObject) {

        var url = FIREBASE_URL + 'jobs';

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