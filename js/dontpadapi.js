angular.module('dontpad.api', []);

angular.module('dontpad.api').factory('DontpadApi', function($http){
    return {
        postToDontpad: function(dontpadUri, contentData){
        return $http({
            method: 'POST',
            url: MARKPAD.DONTPAD_ENDPOINT + dontpadUri,
            data: "text="+contentData+"",
            dataType: 'json',
            });
        }
    }
});