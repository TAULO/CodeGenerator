angular.module('app').controller('fileController', function($localStorage, 
															$scope, 
															$http, 
															$rootScope, 
															$state, 
															DirectoryService, 
															SessionService) {
	$scope.content = "";
	$scope.extensions = ["txt", "md"];
	$scope.currentExtension = "txt";
	
	$scope.newFileName = "";
	
	if (DirectoryService.getClickedItem() != undefined) {
		$scope.newFileName = DirectoryService.getClickedItem().name;
		$scope.content = DirectoryService.getClickedItem().content;
		$scope.currentExtension = DirectoryService.getClickedItem().extension;
	}
	
	$scope.saveFile = function(){	
		var name = $scope.newFileName;
		var extension = $scope.currentExtension;
		var content = $scope.content;
		
		if (name == "") {
		    $("#fileEditErrorModal .modal-body").html("File don't have a name!");
		    $("#fileEditErrorModal").modal("show");		
		} else if (DirectoryService.getClickedItem() == undefined){
			newFile(name, content, extension);
		} else {
			editFile(name, content, extension);
		}
	}
	
	function newFile(name, content, extension) {
		DirectoryService.newFile(name, content, extension);
	}
	
	function editFile(name, content, extension) {
		DirectoryService.editFile(name, content, extension);
	}
	
	$scope.directoriesView = function() {
		$state.go('dashboard.directories', {folderPath: DirectoryService.getCurrentFolder().path});
	}
});