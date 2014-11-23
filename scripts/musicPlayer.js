var audio = new Audio();
audio.loading = false;
var TIME_PER_SONG = 20.0;
var TIME_BETWEEN_ROUNDS = 5.0;
var TIME_PER_ROUND = TIME_PER_SONG - TIME_BETWEEN_ROUNDS;

function playSong(song){
  audio.loading = true;
  previewURL(song.song_id, function (preview_url) {
    audio.src = preview_url;
    var skipped = false;
    audio.addEventListener("canplay",function(){
      if(!skipped){
        audio.currentTime = 30.0 - TIME_PER_SONG;
        skipped=true;
      }
    });
    audio.play();
    audio.loading = false;
  });
}

function stopSong () {
  audio.stop();
}

function previewURL(songId, callback) {
  BASE_URL = "https://api.spotify.com/v1/tracks/";
  $.get(BASE_URL + songId, function (data) {
    callback(data.preview_url); 
  });
}

// get the time left in round
function getTimeLeft() {
	if (audio.duration) {
    return Math.ceil(audio.duration - audio.currentTime - TIME_BETWEEN_ROUNDS);
  }
	else {
		return 0;
  }
}

function musicLoading() {
  return audio.loading;
}
