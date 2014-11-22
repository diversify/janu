var audio = new Audio();

function playSong(song){
	audio.src = song.preview_url;
	audio.play();
}