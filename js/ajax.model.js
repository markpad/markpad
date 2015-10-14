angular.module('ajax.model', []);
angular.module('ajax.model').factory('AjaxModel', function ($http,$httpParamSerializer) {

    var model = {
        post: post,
        get: get,
    }

    return model;

    function post(url, params){
        if(!params){
            params = {};
        }
        var promise = $http({
            method: 'POST',
            url: url,
            data: $httpParamSerializer(params)
        });
        return promise;
    }

    function get(url, params){
        if(!params){
            params = {};
        }
        var promise = $http({
            method: 'GET',
            url: url,
            params: params
        });
        return promise;
    }

});