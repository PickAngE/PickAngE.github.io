document.addEventListener("DOMContentLoaded", () => {
  initMusicPlayer();
  initPageScripts();
  setupNavigation();
  
  window.addEventListener("popstate", () => {
    handleLocation();
  });

  handleLocation();
});

function setupNavigation() {
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    
    if (link && link.dataset.target) {
      e.preventDefault();
      const targetId = link.dataset.target;
      
      window.history.pushState({}, "", `#${targetId}`);
      
      showSection(targetId);
    }
  });
}

function handleLocation() {
  const hash = window.location.hash.substring(1);
  const targetId = hash || "home";
  showSection(targetId);
}

function showSection(targetId) {
  const sections = document.querySelectorAll(".page-section");
  sections.forEach(section => {
    section.classList.add("hidden");
  });
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.classList.remove("hidden");
  } else {
    document.getElementById("home").classList.remove("hidden");
  }

  updateActiveNavLink(targetId);
  window.scrollTo(0, 0);
  
  if (targetId === "home") {
  }
}

function updateActiveNavLink(targetId) {
  const links = document.querySelectorAll(".nav-link");
  
  links.forEach(link => {
    const linkTarget = link.dataset.target;
    if (linkTarget === targetId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function initPageScripts() {
  initHeaderScroll();
  initTypewriter();
  initTiltEffect();
}

function initHeaderScroll() {
  let lastScrollTop = 0;
  const navbar = document.getElementById("navbar");
  
}

let lastScrollTop = 0;
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 50) {
    navbar.classList.add("hide");
  } else {
    navbar.classList.remove("hide");
  }
  lastScrollTop = scrollTop;
});


function initTypewriter() {
  const typingText = document.querySelector(".typing-text");
  if (typingText) {
    if (typingText.dataset.started) return;
    typingText.dataset.started = "true";

    const words = ["Developer", "Bot Creator", "Passionate", "Curious"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; 
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; 
      }

      setTimeout(type, typeSpeed);
    }
    
    type();
  }
}

function initTiltEffect() {
  const cards = document.querySelectorAll(".card");
  
  cards.forEach((card) => {
    // Avoid adding multiple listeners
    if (card.dataset.tiltInitialized) return;
    card.dataset.tiltInitialized = "true";

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });
}

function initMusicPlayer() {
  if (window.musicPlayerInitialized) return;
  window.musicPlayerInitialized = true;

  const playlist = [
    "Aiobahn +81 feat. ななひら & P丸様。 - 天天天国地獄国.mp3",
    "MYTH & ROID - STYX HELIX.mp3",
    "BRIGHTEST HEART.mp3"
  ];

  const audio = new Audio();
  const playBtn = document.getElementById("play-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const songInfo = document.getElementById("current-song");
  
  if (!playBtn) return;

  const playIcon = playBtn.querySelector("i");
  const path = "music/";
  let isPlaying = false;
  
  function pickRandomSong() {
    if (playlist.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * playlist.length);
    const selectedSong = playlist[randomIndex];
    
    audio.src = path + selectedSong;
    audio.load();
    songInfo.textContent = selectedSong.replace(".mp3", "").replace(/_/g, " ");
  }

  pickRandomSong();
  audio.volume = volumeSlider.value;

  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      playIcon.classList.remove("fa-pause");
      playIcon.classList.add("fa-play");
      isPlaying = false;
    } else {
      if (!audio.src) return;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          playIcon.classList.remove("fa-play");
          playIcon.classList.add("fa-pause");
          isPlaying = true;
        }).catch(error => {
          console.log("Playback prevented by browser: " + error);
        });
      }
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });
  audio.addEventListener("ended", () => {
    pickRandomSong();
    audio.play();
  });
}