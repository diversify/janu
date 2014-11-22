var app = angular.module('janu');

app.controller('januController', ['$scope','$http','$interval', function ($scope,$http,$interval){
	var janu = $scope;

	$http.get('data/output.json').success(function(data){
			janu.songs = data;
	});

  $scope.gameInSession = false;

  // start game
  $scope.startGame = function () {
    // reset all game variables
    $scope.timelineSongs = [];
    $scope.timelineYears = [];
    $scope.currentSong = undefined;
    $scope.currentAnswer = undefined;
    $scope.score = {};
    $scope.score.total = 0;

    // add a song, ignore what it is
    addSongToTimeline(fetchNewSong());

    // this is the first song the user guesses
    firstSong = fetchNewSong();
    playSong(firstSong);

    $scope.gameInSession = true;
    $interval(function(){
    	$scope.score.round = getTimeLeft(); 
    }, 1);
  }

  $scope

  $scope.finalSpanSelected = function () {
    if ($scope.currentAnswer === -1)
      return "timeline-selected"
    else
      return ""
  }

  $scope.chooseSpan = function (index) {
    //unselect previous span
    if ($scope.currentAnswer !== undefined && $scope.currentAnswer !== -1) {
      $scope.timelineSongs[$scope.currentAnswer].selected = "";
    }

    //update selection
    $scope.currentAnswer = index; 
    if ($scope.currentAnswer !== -1) {
      $scope.timelineSongs[$scope.currentAnswer].selected = "timeline-selected";
    }
  }

  $scope.checkAnswer = function () {
    // song = $scope.addSong();
		// playSong(song);
		// janu.score.total += getTimeLeft();
  }

	$scope.addSong = function (evt) {


    return randomSong;
	};

	$scope.timelineSpanWidth = function (){
		return calculateWidths(janu.timelineSongs.length+1)-0.2;
	};

  // returns a new song to play
  function fetchNewSong() {
		var years = _.difference(_.keys(janu.songs),janu.timelineYears);
		var year = years[Math.floor(Math.random()*years.length)];
		var randomSong = getRandomSong(janu.songs[year]);
		randomSong.year = year;

    $scope.currentSong = randomSong;
    $scope.currentYear = year;

    return randomSong;
  }

  // adds the song to timeline
  function addSongToTimeline(song) {
		janu.timelineSongs.push($scope.currentSong);
    janu.timelineSongs = _.sortBy(janu.timelineSongs, function (song) { return parseInt(song.year); })
		janu.timelineYears.push($scope.currentYear);
		janu.timelineYears.sort();
  }

}]);

function getRandomSong(year){
	return year[Math.floor(Math.random()*year.length)];
}



