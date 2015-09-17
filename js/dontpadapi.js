angular.module('dontpad.api', []);

angular.module('dontpad.api').factory('DontpadApi', function($http){
	return {
        postToDontpad: function(dontpadUri, contentData){
        	return $http({
        		method: 'POST', 
        		url: 'http://dontpad.com/'+dontpadUri,
        		data: "text="+contentData+"",
        		dataType: 'json',
        		headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        	});
        }
	}
});