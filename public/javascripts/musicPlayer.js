$(function() {
  const audio = $('#audio')[0];
  const playPauseBtn = $('#playPauseBtn');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const songTitle = $('#songTitle');
  const songArtist = $('#songArtist');
  const progressBar = $('#progressBar');
  const volumeControl = $('#volumeControl');
  const rewindBtn = $('#rewindBackBtn'); 
  const forwardBtn = $('#rewindForwardBtn'); 

  const songs = [
    { nombre: "Für Elise", autor: "Ludwig Van Beethoven", src: "fur-elise" },
    { nombre: "Gymnopédies", autor: "Erik Satie", src: "gymnopedies" },
    { nombre: "Morning Mood", autor: "Edvard Grieg", src: "morning-mood" },
    { nombre: "Canon en D Major", autor: "Johann Pachelbel", src: "canon-d-major" },
    { nombre: "Claro de luna", autor: "Ludwig Van Beethoven", src: "claro-de-luna" },
    { nombre: "El Danubio Azul", autor: "Johann Strauss II", src: "danubio-azul" },
    { nombre: "Canción de cuna", autor: "Frédéric Chopin", src: "cancion-de-cuna" },
    { nombre: "Concierto de Brandeburgo", autor: "Johann Sebastian Bach", src: "concierto-brandeburgo" },
    { nombre: "Waltz in A minor (B. 150)", autor: "Frédéric Chopin", src: "waltz-a-minor" },
    { nombre: "Aria para la cuerda de sol", autor: "Johann Sebastian Bach", src: "aria-cuerda-sol" },
    { nombre: "Pequeña Serenata Nocturna", autor: "Wolfgang Amadeus Mozart", src: "pequena-serenata-nocturna" }
  ];
  

  let currentSongIndex = 0;
  let currentSoundImg = "/images/icons/volume-small.svg"
  let noSoundImg = "/images/icons/volume-cross.svg"
  let soundImg = "/images/icons/volume.svg"
  let smallSoundImg = "/images/icons/volume-small.svg"
  let loudSoundImg = "/images/icons/volume-loud.svg"

  // Cargar la canción actual
 function loadSong(index) {
    const song = songs[index];
    let src =  "/audio/" + song.src + ".mp3";
    audio.src = src;
    songTitle.text(song.nombre);
    songArtist.text(song.autor);
    audio.load();
  }
  loadSong(currentSongIndex);
  // Reproducir o pausar
  playPauseBtn.on("click", function () {
      if (audio.paused) {
          audio.play();
          playPauseBtn.attr('src', '/images/icons/pause.svg')
        } else {
          audio.pause();
          playPauseBtn.attr('src', '/images/icons/play.svg')
      }
  });

  // Reproducir la canción anterior
  prevBtn.on("click", function () {
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      loadSong(currentSongIndex);
      audio.play();
      playPauseBtn.text('Pause');
  });

  // Reproducir la siguiente canción
  nextBtn.on("click",function () {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      loadSong(currentSongIndex);
      audio.play();
      playPauseBtn.text('Pause');
  });
  audio.addEventListener("loadedmetadata", function () {
    audio.addEventListener("timeupdate", function () {
      if (!isNaN(audio.duration) && audio.duration > 0) {
  
        const progress = (audio.currentTime / audio.duration) * 100;
        $("#progressBar").val(progress);
      }
    });
    const progress = (audio.currentTime / audio.duration) * 100;
  });
  
  progressBar.on('input', function() {
    const seekTo = (progressBar.val() / 100) * audio.duration;
    audio.currentTime = seekTo;
  });

  volumeControl.on('input', function() {
    audio.volume = volumeControl.val() / 100;
    
    if(audio.volume === 0 && currentSoundImg !== noSoundImg) {
      $("#soundSvg").attr("src", noSoundImg);
      currentSoundImg = noSoundImg
    } else if (audio.volume <= 0.33 && currentSoundImg !== soundImg) {
      $("#soundSvg").attr("src", soundImg);
      currentSoundImg = soundImg
    } else if (audio.volume > 0.33 && audio.volume <= 0.66 && currentSoundImg !== smallSoundImg) {
      $("#soundSvg").attr("src", smallSoundImg);
      currentSoundImg = smallSoundImg
    } else if (audio.volume > 0.66 && audio.volume <= 1 && currentSoundImg !== loudSoundImg){
      $("#soundSvg").attr("src", loudSoundImg);
      currentSoundImg = loudSoundImg
    }
    console.log(audio.volume)
  });

  rewindBtn.on('click', function() {
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  });

  forwardBtn.on('click', function() {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  });

  
  audio.volume = 0.33
  audio.currentTime = 0;
  progressBar.val(0);
});