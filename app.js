var myApp = angular.module("NoteApp", []);

myApp.controller('NoteController', ["$scope", "$http", "$interval", function($scope, $http, $interval) {

	$scope.setCurrentNote = function(index) {
		if (index != $scope.curnoteindex) {
			$scope.curnoteindex = index;
			if ($scope.editmode) {
				$scope.editmode = false;
				$scope.unwatch();
			}
		}
	};

	var t = $scope;

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

	$scope.removeNote = function() {
		$http({
			method: "delete",
			url: "http://localhost:8080/notes/" + t.notes[t.curnoteindex]._id
		}).then(function successCallback(data) {
			t.retrieveNotes();
			console.log("ran retrieve");
		}, function errorCallback(response) {
			console.log("error deleting");
		});
	};

	$scope.editNote = function() {
		$scope.editmode = !$scope.editmode;

		console.log("watch set on " + $scope.notes[$scope.curnoteindex].title);
			$scope.unwatch = $scope.$watch("notes[curnoteindex].title", function(newval, oldval) {
				console.log("old val: " + oldval);
				console.log("new val: " + newval);
				if(oldval != newval) {
					console.log("title changed from " + oldval + " to " + newval);
					$scope.unwatch();
				}
			});
	};

	$scope.saveNote = function() {
		t.editmode = false;
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


	

}]);