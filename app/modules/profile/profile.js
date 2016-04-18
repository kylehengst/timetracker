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