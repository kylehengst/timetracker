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
            $rootScope.loading++;
            Auth.$changeEmail({
                oldEmail: profilevm.form.email,
                newEmail: profilevm.form.newEmail,
                password: profilevm.form.password
            }).then(function(userData) {
                profilevm.emailUpdated = true;
                $rootScope.loading--;
            }).catch(function(error) {
                profilevm.error = error.toString();
                $rootScope.loading--;
            });

        };

        function submitPasswordForm(){
            profilevm.error = '';
            profilevm.passwordUpdated = false;
            $rootScope.loading++;
            Auth.$changePassword({
                email: profilevm.form.email,
                oldPassword: profilevm.form.oldPassword,
                newPassword: profilevm.form.newPassword
            }).then(function(userData) {
                // $state.go('auth.login');
                profilevm.passwordUpdated = true;
                $rootScope.loading--;
            }).catch(function(error) {
                profilevm.error = error.toString();
                $rootScope.loading--;
            });

        };

    }

})();