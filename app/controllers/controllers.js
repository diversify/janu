var app = angular.module('janu');

app.controller('januController', ['$scope','$http', function ($scope,$http){
	var janu = this;
	janu.timelineSongs = [];
	janu.timelineYears = [];
	$http.get('data/output.json').success(function(data){
			janu.songs = data;
			
	});
	$scope.addSong = function (evt){
		var years = _.difference(_.keys(janu.songs),janu.timelineYears);
		var year = years[Math.floor(Math.random()*years.length)];
		var randomSong = getRandomSong(janu.songs[year]);
		randomSong.year = year;
		janu.timelineSongs.push(randomSong);
		janu.timelineYears.push(year);
		janu.timelineYears.sort();
		playSong(randomSong);
	};

}]);

function getRandomSong(year){
	return year[Math.floor(Math.random()*year.length)];
}
