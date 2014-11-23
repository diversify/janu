
var app = angular.module('janu');

app.controller('januController', ['$scope','$http','$interval','$location', function ($scope,$http,$interval,$location){
	var janu = $scope;


  $scope.gameInSession = false;
  $scope.init = function (){
  	$http.get('data/output.json').success(function(data){
		janu.songs = data;
		janu.startGame();
	});
  };
  // start game
  $scope.startGame = function () {
    // reset all game variables
    $scope.timeLeft = 15;
    $scope.timelineSongs = [];
    $scope.timelineYears = [];
    $scope.currentSong = undefined;
    $scope.currentAnswer = undefined;
    $scope.score = {};
    $scope.score.round = 0;
    $scope.score.total = 0;
    $scope.gameInSession = true;
    $scope.markerSet = false;
    $scope.comboplyer = 1;
    $scope.roundActive = false;

    var loopImages = function(){

         $('#combo-div').fadeIn(1500, function(){

                   $('#combo-div').fadeOut(1500, loopImages);           
         });
    }
    loopImages();
    
    // this is the first song the user guesses
    $("#song-details").hide();
    firstSong = fetchNewSong();
    $('#album-cover').addClass('no-blur'); 
    playSong(firstSong);
    $scope.roundActive = true;

    // start the timer
    $interval(function(){
      timeLeft = getTimeLeft();
      if(timeLeft<16){
        $scope.timeLeft = timeLeft; 
        if(timeLeft==15){
          $('#album-cover').addClass('animate-blur');
        }
        if(timeLeft==14){
          $('#album-cover').addClass('no-blur');
        }
      }
      else
        $scope.timeLeft = 15;
      if (timeLeft <= 0) {
        $scope.timeLeft = 0;
      	$('#album-cover').removeClass('animate-blur');
        if ($scope.roundActive && !musicLoading()) {
          $scope.roundActive = false;
          checkAnswer();
        }
      }
    }, 1000);
  }

  $scope.timeLeft = function () {
    return Math.min(0, getTimeLeft());
  }

  $scope.isSelected = function (index) {
    if ($scope.currentAnswer === index)
      return "timeline-selected"
    else
      return ""
  }

  $scope.markerHovers = function (index) {
    //if marker is set, nothing should have the hover class
    if ($scope.markerSet)
      return "";

    if (index === $scope.timelineHoverIndex)
      return "timeline-hover";
    else
      return "";
  }

  $scope.placeMarker = function () {
    if (!$scope.roundActive)
      return;

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
    index = markerIndex();
    //if it's the final span, then represent as -1
    if (index === $scope.timelineSongs.length)
      index = -1;
    $scope.timelineHoverIndex = index;
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
      $scope.comboplyer = 1;
      $("#album-cover").addClass('wrong');
    }
    else if($scope.timelineSongs.length==0){
    	answerSuccess();
    }
    else if (ans === 0) {
      if ($scope.currentYear <= $scope.timelineSongs[0].year)
        answerSuccess();
      else{
        $scope.comboplyer = 1;
        $("#album-cover").addClass('wrong');
      }
    } else if (ans === -1) {
      if ($scope.currentYear >= _.last($scope.timelineSongs).year)
        answerSuccess();
      else{
        $scope.comboplyer = 1;
        $("#album-cover").addClass('wrong');
      }
    } else {
      if ($scope.currentYear >= $scope.timelineSongs[ans-1].year && $scope.currentYear <= $scope.timelineSongs[ans].year){
        answerSuccess();
      }else{
        $scope.comboplyer = 1;
        $("#album-cover").addClass('wrong');
      }

    }

    //clear the selection
    $scope.currentAnswer = null;

    // new song
    $scope.roundActive = false;
    $("#song-details").fadeIn(500);
    setTimeout(function () {      
      $('#album-cover').removeClass('no-blur');
      $('#album-cover').removeClass('correct');
      $('#album-cover').removeClass('wrong');
      $("#song-details").hide();
      if($scope.timelineSongs.length===10){
        $location.path('/win');
      }
      newSong = fetchNewSong();
      playSong(newSong);
      $scope.markerSet = false;
      $scope.score.round = 0;
      $scope.roundActive = true;
    }, 3000);
  }

  function answerSuccess() {
    $("#album-cover").addClass('correct');
    addSongToTimeline($scope.currentSong); 
    $scope.score.total += ($scope.score.round * $scope.comboplyer);
  	$scope.comboplyer++;
  }

}]);

function getRandomSong(year){
	return year[Math.floor(Math.random()*year.length)];
}




