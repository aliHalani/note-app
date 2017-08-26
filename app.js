var myApp = angular.module("NoteApp", ["ngMaterial", "ngAnimate"]);

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
			$scope.notes.splice(index, 1);
			console.log("delete successful");
		}, function errorCallback(response) {
			console.log("error deleting");
		});
	};


	$scope.editNote = function() {
		if($scope.editmode) {
			$scope.unwatch();
		} else {
			//console.log("watch set on " + $scope.notes[$scope.curnoteindex].title);
			$scope.unwatch = $scope.$watch("notes[curnoteindex]", function(newval, oldval) {
				//console.log("old val: " + oldval);
				//console.log("new val: " + newval);
				if(oldval != newval) {
					console.log("Change on " + newval + ", previously was " + oldval);
					$scope.changemade = true;
					$scope.unwatch();
				}
			}, true);
		}

		$scope.editmode = !$scope.editmode;

	};

	// PUT
	$scope.updateNote = function() {
		$scope.editmode = false;
		$scope.changemade = false;
		console.log("updating note with title  " + $scope.notes[$scope.curnoteindex].title);
		$http({
			method: "put",
			url: "http://localhost:8080/notes/" + t.notes[t.curnoteindex]._id,
			data: t.notes[t.curnoteindex]
		}).then(function(data) {
			t.retrieveNotes();
		}, function(res) {
			console.log("error updating");
		});
	};

	$scope.addStack = function(note) {
		console.log(note);
	};


	$scope.retrieveNotes();
	$scope.curnoteindex = 0;
	$scope.editmode = false;
	$scope.changemade = false;


	

}]);