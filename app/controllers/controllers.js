var app = angular.module('janu');

app.controller('januController', ['$scope','$http', function ($scope,$http){
	var janu = this;
	janu.timelineSongs = {};
	$http.get('data/output.json').success(function(data){
			janu.songs = data;
			
	});
	$scope.addSong = function (evt){
		console.log("blerf");
	};
}]);
