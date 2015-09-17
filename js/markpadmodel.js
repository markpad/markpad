angular.module('markpad.model', ['dontpad.api']);

angular.module('markpad.model').factory('MarkpadModel', function(DontpadApi){

	var model = {
		init: init,
		hasDataToPost: hasDataToPost,
	};

	model.postToDontpad = function(){
		model.enviandoConteudoDontpad = true;
		model.enviadoComSucesso = false;
		DontpadApi.postToDontpad(model.dontpadUri, model.contentToPost).then(function(resultado){
			model.enviadoComSucesso = true;
			console.log(resultado);
		}).finally(function(){
			model.enviandoConteudoDontpad = false;
		});
	}

	function init(){
		model.enviandoConteudoDontpad = false;
		model.enviadoComSucesso = false;
		model.contentToPost = '';
		model.dontpadUri = '';
	}

	function hasDataToPost(){
		return model.contentToPost.length > 0 && model.dontpadUri.length > 0;
	}

	return model;
});