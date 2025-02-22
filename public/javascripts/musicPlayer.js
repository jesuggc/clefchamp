$(function() {
  const audio = $('#audio')[0];
  const playPauseBtn = $('#playPauseBtn');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const songTitle = $('#songTitle');
  const songArtist = $('#songArtist');
  const progressBar = $('#progressBar');
  const volumeControl = $('#volumeControl');
  const rewindBtn = $('#rewindBackBtn');  // Botón de retroceder
  const forwardBtn = $('#rewindForwardBtn'); 
  // Lista de canciones locales (asumiendo que tienes archivos .mp3 en la misma carpeta)
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
  
  // const songs = ['/audio/FurElise.mp3', 'song2.mp3', 'song3.mp3'];
  let currentSongIndex = 0;

  // Cargar la canción actual
 function loadSong(index) {
    const song = songs[index];
    let src =  "/audio/" + song.src + ".mp3";
    audio.src = src;
    songTitle.text(song.nombre);
    songArtist.text(song.autor);
    audio.load();
  }
  console.log("Cargo")
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
    console.log("Metadata cargada. Duración:", audio.duration);
  
    // Agregar listener para actualizar la barra de progreso
    audio.addEventListener("timeupdate", function () {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        console.log(audio.currentTime);
        console.log(audio.duration);
  
        const progress = (audio.currentTime / audio.duration) * 100;
        console.log("PROGRESS " + progress);
        $("#progressBar").val(progress);
      }
    });
    const progress = (audio.currentTime / audio.duration) * 100;
        console.log("PROGRESS " + progress);
  });
  
  progressBar.on('input', function() {
    const seekTo = (progressBar.val() / 100) * audio.duration;
    audio.currentTime = seekTo;
  });

  volumeControl.on('input', function() {
    audio.volume = volumeControl.val() / 100;
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