(function () {
  'use strict';

  angular
    .module('rooms')
    .controller('RoomsController', RoomsController);

  RoomsController.$inject = ['$scope', '$state', 'roomResolve', '$window', '$http', 'Authentication', 'Notification', '$filter'];

  function RoomsController($scope, $state, room, $window, $http, Authentication, Notification, $filter) {
    var vm = this;

    vm.room = room;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.save = save;

    var roomId = room._id;

    // Save room
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.roomForm');
        return false;
      }

      // Create a new room, or update the current instance
      vm.room.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        var code = vm.room.code;
        // Clear form fields
        vm.room.code = '';
        vm.room.name = '';
        vm.room.nbseats = '';

        if (roomId) {
          $state.go('admin.manage.rooms.view', {
            roomCode: code
          });
        } else {
          $state.go('admin.manage.rooms.list');
        }
        Notification.success({ message: '<i class="glyphicon glyphicon-exclamation-sign"></i> ' + $filter('translate')(roomId ? 'ROOM.SUCCESSFUL_UPDATE' : 'ROOM.SUCCESSFUL_CREATION', { code: code }) });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
