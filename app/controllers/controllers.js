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
    //addSongToTimeline(fetchNewSong());

    // this is the first song the user guesses
    firstSong = fetchNewSong();
    playSong(firstSong);

    $scope.gameInSession = true;

    // start the timer
    $interval(function(){
      timeLeft = getTimeLeft();
    	$scope.score.round = timeLeft; 
      if (timeLeft <= 0) {
        checkAnswer();
      }
    }, 1000);
  }

  $scope.isSelected = function (index) {
    if ($scope.currentAnswer === index)
      return "timeline-selected"
    else
      return ""
  }

  $scope.selectSpan = function (index) {
    $scope.currentAnswer = index;
    markerSet = true;
  }

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

  function checkAnswer() {
    ans = $scope.currentAnswer ;

    if (ans === undefined) {
      // user hasn't chosen an answer, should skip to bottom
    }
    else if($scope.timelineSongs.length==0){
    	answerSuccess();
    }
    else if (ans === 0) {
      if ($scope.currentYear <= $scope.timelineSongs[0].year)
        answerSuccess();
    } else if (ans === -1) {
      if ($scope.currentYear >= _.last($scope.timelineSongs).year)
        answerSuccess();
    } else {
      if ($scope.currentYear >= $scope.timelineSongs[ans-1].year &&
          $scope.currentYear <= $scope.timelineSongs[ans].year)
        answerSuccess();
    }

    newSong = fetchNewSong();  
    playSong(newSong);
    markerSet = false;
  }

  function answerSuccess() {
    addSongToTimeline($scope.currentSong); 
    $scope.score.total += 10;
  }

}]);

function getRandomSong(year){
	return year[Math.floor(Math.random()*year.length)];
}



