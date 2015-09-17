//Bizu do stackoverflow
//http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
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

angular.module("markpad", ['dontpad.api', 'markpad.model']);

angular.module("markpad").config(function($interpolateProvider, $httpProvider){
	$interpolateProvider.startSymbol('{[{').endSymbol('}]}');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

});