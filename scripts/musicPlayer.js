var audio = new Audio();

function playSong(song){
	audio.src = song.preview_url;
	audio.play();
}
function getScore(){
	if(audio.duration)
		return Math.round(audio.duration-audio.currentTime);
	else
		return 0;

}