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
    $scope.score.round = 0;
    $scope.timeLeft = 15;
    $scope.score.total = 0;
    $scope.markerSet = false;
    // add a song, ignore what it is
    //addSongToTimeline(fetchNewSong());

    // this is the first song the user guesses
    firstSong = fetchNewSong();
    playSong(firstSong);

    $scope.gameInSession = true;

    // start the timer
    $interval(function(){
      timeLeft = getTimeLeft();
      	if(timeLeft<16)
    		$scope.timeLeft = timeLeft; 
    	else
    		$scope.timeLeft = 15;
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

  $scope.markerHovers = function (index) {
    if (index === $scope.timelineHoverIndex)
      return "timeline-hover";
    else
      return "";
  }

  $scope.placeMarker = function () {
    index = markerIndex();

    //if it's the final span, then represent as -1
    if (index === $scope.timelineSongs.length)
      index = -1;

    selectSpan(index);
  }

  markerIndex = function () {
    //get center x of marker and width of timeline
		$songCircle = $("#current-song-circle");
    centerX = $songCircle.offset().left + $songCircle.width() / 2;
    width = $("#timeline").width();

    //calculate index
    return Math.floor(($scope.timelineSongs.length+1) * (centerX / width))
  }

  $scope.moveMarker = function(e){
    if(!$scope.markerSet)
      $("#current-song-circle").css({left:e.pageX});

    // update timeline-hover class of relevant span
    $scope.timelineHoverIndex = markerIndex();
	};

	$scope.addMarkerToGUI = function(e){
		$("#current-song-circle").css({width:'60px', height:'60px'});
	};
	$scope.timelineSpanWidth = function (){
		return calculateWidths(janu.timelineSongs.length+1)-0.2;
	};

  selectSpan = function (index) {
  	if(index === $scope.currentAnswer){
  		$scope.markerSet = false;
  		$scope.currentAnswer = undefined;
  		$scope.score.round = 0;
  	}
  	else{
  		$scope.markerSet = true;
  		$scope.currentAnswer = index;
  		$scope.score.round = getTimeLeft();
  	}
  }

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

    if (ans === undefined || ans === null) {
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

    //clear the selection
    $scope.currentAnswer = null;

    newSong = fetchNewSong();  
    playSong(newSong);
    $scope.markerSet = false;
  }

  function answerSuccess() {
    addSongToTimeline($scope.currentSong); 
    $scope.score.total += $scope.score.round;
  }

}]);

function getRandomSong(year){
	return year[Math.floor(Math.random()*year.length)];
}



