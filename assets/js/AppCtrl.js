angular.module('TreelineExample').controller('AppCtrl', [
           '$scope', '$timeout', '$http',
  function ($scope,   $timeout,   $http){
    console.log('running!');
    $scope.homepage = {};
    $scope.homepage.messageSent = false;
    $scope.contact = {};

    $scope.intent = {
      submitContactForm: function() {
        // Clear out error list
        $scope.contact.errors = [];
        $scope.homepage.messageSent = false;

        // Check for errors
        if(!$scope.contact.name) {
          $scope.contact.errors.push('name');
        }
        if(!$scope.contact.email) {
          $scope.contact.errors.push('email');
        }
        if(!$scope.contact.message) {
          $scope.contact.errors.push('message');
        }

        // If no errors, go ahead and submit.
        if(!$scope.contact.errors.length) {
          $http.post('/contact', {
            name: $scope.contact.name,
            email: $scope.contact.email,
            message: $scope.contact.message
          })
          .then(function(){
            $scope.contact.name = '';
            $scope.contact.email = '';
            $scope.contact.message = '';
            $scope.homepage.messageSent = true;
          })
          .catch(function(err){
            console.log(err);
          });
        }
      }

    };

}]);
