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