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