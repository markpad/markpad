if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
    };
}
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str){
        return this.slice(-str.length) == str;
    };
}

if(!window.MARKPAD){
    window.MARKPAD = {};
}

if(!MARKPAD.angular_dependencies){
    MARKPAD.angular_dependencies = [];
}

angular.module("markpad", ['ajax.model','dontpad.api', 'markpad.model']);

angular.module("markpad").config(function($interpolateProvider, $httpProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

MARKPAD.DONTPAD_ENDPOINT = 'http://dontpad.com/';