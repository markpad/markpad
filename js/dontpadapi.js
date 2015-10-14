angular.module('dontpad.api', ['ajax.model']);

angular.module('dontpad.api').factory('DontpadApi', function(AjaxModel){
    return {
        postToDontpad: function(dontpadUri, contentData){
            var promise = AjaxModel.post(dontpadUri, contentData);
            return promise;
        }
    }
});