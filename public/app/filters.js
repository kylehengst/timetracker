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