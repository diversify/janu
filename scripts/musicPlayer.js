var audio = new Audio();
var TIME_PER_SONG = 15.0;

function playSong(song){
  previewURL(song.song_id, function (preview_url) {
    audio.src = preview_url;
    var skipped = false;
    audio.addEventListener("canplay",function(){
      if(!skipped){
        audio.currentTime = 30.0-TIME_PER_SONG;
        skipped=true;
      }
    });
    audio.play();
  });
}

function previewURL(songId, callback) {
  BASE_URL = "https://api.spotify.com/v1/tracks/";
  $.get(BASE_URL + songId, function (data) {
    callback(data.preview_url); 
  });
}

function getTimeLeft(){
	if(audio.duration)
		return Math.round(audio.duration-audio.currentTime);
	else
		return 0;
}
