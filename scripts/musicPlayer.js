var audio = new Audio();
var TIME_PER_SONG = 15.0;
function playSong(song){
	audio.src = song.preview_url;
	var skipped = false;
	audio.addEventListener("canplay",function(){
		if(!skipped){
			audio.currentTime = 30.0-TIME_PER_SONG;
			skipped=true;
		}
	});
	audio.play();
}

function getTimeLeft(){
	if(audio.duration)
		return Math.round(audio.duration-audio.currentTime);
	else
		return 0;
}
