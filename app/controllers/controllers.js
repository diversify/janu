var app = angular.module('janu');

app.controller('januController', ['$scope','$http','$interval', function ($scope,$http,$interval){
	var janu = $scope;

	$http.get('data/output.json').success(function(data){
			janu.songs = data;
	});

  $scope.gameInSession = false;

  // start game
  $scope.startGame = function () {
    $scope.timelineSongs = [];
    $scope.timelineYears = [];
    $scope.currentSong = undefined;
    $scope.score = {};
    $scope.score.total = 0;
    $scope.gameInSession = true;
    $interval(function(){
    	$scope.score.round = getScore(); 
    }, 1);

  }


	$scope.addSong = function (evt){
		janu.score.total += getScore();
		var years = _.difference(_.keys(janu.songs),janu.timelineYears);
		var year = years[Math.floor(Math.random()*years.length)];
		var randomSong = getRandomSong(janu.songs[year]);
		randomSong.year = year;
    
    janu.currentSong = randomSong;

		janu.timelineSongs.push(randomSong);
    janu.timelineSongs = _.sortBy(janu.timelineSongs, function (song) { return parseInt(song.year); })
		janu.timelineYears.push(year);
		janu.timelineYears.sort();
		playSong(randomSong);
	};

	$scope.timelineSpanWidth = function (){
		return calculateWidths(janu.timelineSongs.length+1)-0.2;
	};

}]);
function getRandomSong(year){
	return year[Math.floor(Math.random()*year.length)];
}
