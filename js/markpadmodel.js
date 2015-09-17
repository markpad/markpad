angular.module('markpad.model', ['dontpad.api']);

angular.module('markpad.model').factory('MarkpadModel', function(DontpadApi){
	
	var model = {
		init: init,		
	};

	model.postToDontpad = function(dontpadUri, contentData){

		DontpadApi.postToDontpad(dontpadUri, contentData).then(function(resultado){
			model.enviandoConteudoDontpad = true;
			model.enviadoComSucesso = true;
			model.dontpadUri = dontpadUri;
			console.log(resultado);
		}).finally(function(){
			model.enviandoConteudoDontpad = false;
		});
	}

	function init(){
		model.enviandoConteudoDontpad = false;
		model.enviadoComSucesso = false;
		model.dontpadUri = false;		
	}
	
	return model;
});	