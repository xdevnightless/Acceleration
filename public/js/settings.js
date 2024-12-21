document.addEventListener("DOMContentLoaded", function () {
  const theme = window.localStorage.getItem("theme") || "default";
  applyTheme(theme);

  // Theme saving and application functions
  function onSaveTheme() {
    const selectedOption = document.querySelector("#theme-select");
    window.localStorage.setItem("theme", selectedOption.value);
    applyTheme(selectedOption.value);
  }

  function applyTheme(theme) {
    const element = document.querySelector("body");
    const themes = ["default", "oceanic", "galaxy", "gaming", "cyberpunk", "techno", "hacker", "midnight", "crimson", "halloween", "sunset", "ruby", "noctura", "sapphire", "light", "christmas", "fire"];
    
    themes.forEach(themeClass => {
      element.classList.remove(themeClass);
    });

    if (theme !== "default") {
      document.body.style.backgroundImage = 'none';
      element.classList.add(theme);
    } else {
      document.body.style.backgroundImage = "url('images/bg.png')";
    }
  }

  // Set up the "Save Theme" button listener
  const saveThemeButton = document.getElementById("save-theme-button");
  if (saveThemeButton) {
    saveThemeButton.addEventListener("click", onSaveTheme);
  }

  // Background image upload functionality
  const fileInput = document.querySelector("#background-upload");
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        document.body.style.backgroundImage = `url(${event.target.result})`;
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected.");
    }
  });

  // Image URL saving functionality
  const imageUrlInput = document.getElementById("image-url");
  const imageSaveButton = document.querySelector("#image-settings button");
  imageSaveButton.addEventListener("click", function () {
    const imageUrl = imageUrlInput.value;
    document.body.style.backgroundImage = `url(${imageUrl})`;
  });

  // Particle functions
  function addParticle() {
    const particleContainer = document.getElementById("particleContainer");
    if (!particleContainer) return;
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.setProperty("--d", Math.random() * 10 + "s");
    particleContainer.appendChild(particle);
  }

  function removeParticle() {
    const particleContainer = document.getElementById("particleContainer");
    if (particleContainer) {
      const particles = particleContainer.querySelectorAll(".particle");
      if (particles.length > 0) {
        const lastParticle = particles[particles.length - 1];
        particleContainer.removeChild(lastParticle);
      }
    }
  }

  // Attach particle event listeners
  const addParticlesButton = document.querySelector("#particles-settings button:nth-child(2)");
  const removeParticlesButton = document.querySelector("#particles-settings button:nth-child(3)");

  if (addParticlesButton) addParticlesButton.addEventListener("click", addParticle);
  if (removeParticlesButton) removeParticlesButton.addEventListener("click", removeParticle);
});
