document.addEventListener("DOMContentLoaded", function () {
    const particleSwitch = document.getElementById("particle-switch");
    let particlesEnabled = localStorage.getItem("particlesEnabled") === "true";
    
    if (particleSwitch) {
      particleSwitch.checked = particlesEnabled;
    }
  
    if (particlesEnabled) {
      enableParticles();
    }
  });
  
  function enableParticles() {
    if (!document.getElementById("particles-js")) {
      const particlesDiv = document.createElement("div");
      particlesDiv.id = "particles-js";
      particlesDiv.style.position = "fixed";
      particlesDiv.style.top = "0";
      particlesDiv.style.left = "0";
      particlesDiv.style.width = "100%";
      particlesDiv.style.height = "100%";
      particlesDiv.style.zIndex = "-1";
      document.body.appendChild(particlesDiv);
    }
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 100,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out"
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": true, "mode": "grab" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 200, "line_linked": { "opacity": 1 } },
          "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
          "repulse": { "distance": 100, "duration": 0.4 },
          "push": { "particles_nb": 4 },
          "remove": { "particles_nb": 2 }
        }
      },
      "retina_detect": true
    });
  }
  
  function disableParticles() {
    const particlesDiv = document.getElementById("particles-js");
    if (particlesDiv) {
      particlesDiv.parentNode.removeChild(particlesDiv);
    }
  }
  