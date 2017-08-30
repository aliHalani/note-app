var myApp = angular.module("NoteApp", ["ngMaterial", "ngAnimate"]);

myApp.directive("titleFocus", function() {
	return {
		link: function($scope, element, attrs) {
			element.bind("click", function() {
				$(element).parent().prev().find("input").focus();
			});
		}
	};
});

myApp.controller('NoteController', ["$scope", "$http", "$interval", function($scope, $http, $interval) {

	$scope.setCurrentNote = function(index) {
		if (index != $scope.curnoteindex) {			
			if ($scope.editmode) {
				if ($scope.changemade) {					
					$scope.updateNote();
				}
				$scope.editmode = false;
				$scope.unwatch();
			}
			$scope.curnoteindex = index;
		}
	};

	var t = $scope;

	// GET
	$scope.retrieveNotes = function() {
		$http({
			method: "get",
			url: "http://localhost:8080/notes"
		}).then(function successCallback(response) {
			t.notes = response.data;
			if (t.curnoteindex > (t.notes.length - 1)) {
				t.curnoteindex = t.notes.length - 1;
			}	
		}, function errorCallback(response) {
			console.log("error retrieving");
		});
	};

	// DELETE
	$scope.removeNote = function(index) {		
		$http({
			method: "delete",
			url: "http://localhost:8080/notes/" + t.notes[index]._id
		}).then(function successCallback(data) {
			t.notes.splice(index, 1);
			if (t.curnoteindex > 0) {
				if (t.curnoteindex > index) {
					t.curnoteindex -= 1;
				} else if (t.curnoteindex == t.notes.length ) {
					t.curnoteindex = t.notes.length -1 ;
				}
			}
			console.log("delete successful");
		}, function errorCallback(response) {
			console.log("error deleting");
		});
	};


	$scope.editNote = function(noteindex) {
		
		//console.log("watch set on " + $scope.notes[$scope.curnoteindex].title);
		console.log($scope.notes[noteindex]);
		$scope.unwatch = $scope.$watch(function() { return t.notes[noteindex] }, function(newval, oldval) {
			//console.log("old val: " + oldval);
			//console.log("new val: " + newval);
			if(oldval != newval) {
				console.log("Change on " + newval + ", previously was " + oldval);
				$scope.changemade = true;
				$scope.unwatch();
			}
		}, true);

		$scope.editmode = !$scope.editmode;

	};

	$scope.doneEditing = function() {
		if ($scope.changemade) {
			$scope.updateNote();
		}
		$scope.editmode = false;
		$scope.changemade = false;
		$scope.unwatch();
	};

	// PUT
	$scope.updateNote = function() {
		var cni = $scope.curnoteindex;
		$scope.editmode = false;
		$scope.changemade = false;
		console.log("updating note with title  " + $scope.notes[cni].title);
		$http({
			method: "put",
			url: "http://localhost:8080/notes/" + t.notes[cni]._id,
			data: t.notes[cni]
		}).then(function(data) {
			//t.retrieveNotes();
		}, function(res) {
			console.log("error updating");
		});
	};

	$scope.addNote = function() {
		$http({
			method: "post",
			url: "http://localhost:8080/notes/"
		}).then(function successCallback(res) {
			console.log(res.data);
			$scope.notes.push({title: "", content: "", _id: res.data});
			$scope.setCurrentNote($scope.notes.length - 1);

		}, function errorCallback(response) {
			console.log("error adding note");
			console.log(response);
		});
				
	};


	$scope.retrieveNotes();
	$scope.curnoteindex = 0;
	$scope.editmode = false;
	$scope.changemade = false;


	

}]);