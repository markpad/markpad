angular.module('markpad').controller('indexController', function ($scope, MarkpadModel){
    var mpm = $scope.mpm = MarkpadModel;
    mpm.init();
});