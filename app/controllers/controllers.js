var app = angular.module('janu');

app.controller('januController', ['$scope','$http', function ($scope,$http){
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

    // add the first song
    $scope.addSong();
    $scope.gameInSession = true;
  }

  $scope.finalSpanSelected = function () {
    if ($scope.currentAnswer === -1)
      return "timeline-selected"
    else
      return ""
  }

  $scope.chooseSpan = function (index) {
    //unselect previous span
    console.log($scope.currentAnswer);
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
    song = $scope.addSong();
		playSong(song);
  }

	$scope.addSong = function (evt) {
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

    return randomSong;
	};

	$scope.timelineSpanWidth = function (){
		return calculateWidths(janu.timelineSongs.length+1);
	};

}]);

function getRandomSong(year){
	return year[Math.floor(Math.random()*year.length)];
}

//Enter spanNumber (index starts at zero) ex. inf---0---1999---1---2005---2---2010---3---inf
function checkAnswer(){
  var spanNumber = user.answer;
  if(spanNumber == 0){
          if(songs[currentSong].year <= years[0])
                  return true;
  }
  else if(spanNumber==years.length){
          if(songs[currentSong].year >= years[years.length-1])
                  return true;
  }
  else{
          if(songs[currentSong].year <= years[spanNumber] && songs[currentSong].year >= years[spanNumber-1]){
                  return true
          }
  }
  return false;
}

