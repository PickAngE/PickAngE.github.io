document.addEventListener("DOMContentLoaded", () => {
  initMusicPlayer();
});

function initMusicPlayer() {
  if (window.musicPlayerInitialized) return;
  window.musicPlayerInitialized = true;

  const playlist = [
    "Aiobahn +81 feat. ななひら & P丸様。 - 天天天国地獄国.mp3",
    "OneRepublic - Give Me Something.mp3",
  ];

  let currentPlaylist = [...playlist];
  let currentIndex = 0;
  const path = "music/";

  const audio = new Audio();
  const playerContainer = document.querySelector(".music-player");
  const playBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const playlistBtn = document.getElementById("playlist-btn");
  const minimizeBtn = document.getElementById("minimize-btn");
  const playlistMenu = document.getElementById("playlist-menu");
  const trackList = document.getElementById("track-list");
  const volumeSlider = document.getElementById("volume-slider");
  const songInfo = document.getElementById("current-song");

  if (!playBtn || !songInfo) return;

  const playIcon = playBtn.querySelector("i");
  let isPlaying = false;

  // Build playlist menu
  playlist.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.replace(".mp3", "").replace(/_/g, " ");
    li.addEventListener("click", () => {
      currentIndex = index;
      loadTrack(currentIndex, "song-slide-up");
      playlistMenu.classList.add("hidden");
    });
    trackList.appendChild(li);
  });

  function updatePlaylistActiveState() {
    const items = trackList.querySelectorAll("li");
    items.forEach((item, index) => {
      if (index === currentIndex) item.classList.add("active");
      else item.classList.remove("active");
    });
  }

  function updateSongDisplay(trackName, animationClass) {
    songInfo.classList.remove("song-slide-up", "song-slide-down");
    void songInfo.offsetWidth; // Trigger reflow
    songInfo.textContent = trackName.replace(".mp3", "").replace(/_/g, " ");
    songInfo.classList.add(animationClass);
    updatePlaylistActiveState();
  }

  function loadTrack(index, animationClass = "song-slide-up") {
    const selectedSong = currentPlaylist[index];
    audio.src = path + selectedSong;
    audio.load();
    updateSongDisplay(selectedSong, animationClass);

    if (isPlaying) {
      audio.play().catch((e) => console.log("Playback error:", e));
    }
  }

  function nextTrack() {
    currentIndex = (currentIndex + 1) % currentPlaylist.length;
    loadTrack(currentIndex, "song-slide-up");
  }

  function prevTrack() {
    currentIndex =
      (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    loadTrack(currentIndex, "song-slide-down");
  }

  // Initial load
  loadTrack(currentIndex);
  audio.volume = volumeSlider.value;

  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      playIcon.classList.replace("fa-pause", "fa-play");
      playerContainer.classList.remove("playing");
      isPlaying = false;
    } else {
      audio
        .play()
        .then(() => {
          playIcon.classList.replace("fa-play", "fa-pause");
          playerContainer.classList.add("playing");
          isPlaying = true;
        })
        .catch((e) => console.log("Playback prevented:", e));
    }
  });

  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);

  playlistBtn.addEventListener("click", () => {
    playlistMenu.classList.toggle("hidden");
  });

  minimizeBtn.addEventListener("click", () => {
    playerContainer.classList.toggle("minimized");
    // Auto-close playlist if minimizing
    if (playerContainer.classList.contains("minimized")) {
      playlistMenu.classList.add("hidden");
    }
  });

  // Close playlist menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      playlistMenu &&
      playlistBtn &&
      !playlistMenu.contains(e.target) &&
      !playlistBtn.contains(e.target)
    ) {
      playlistMenu.classList.add("hidden");
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });

  audio.addEventListener("ended", nextTrack);
}
