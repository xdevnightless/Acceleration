const panicKeybind = localStorage.getItem("panicKey") ?? "Shift+~"

function setCloak(title, icon) {
  localStorage.setItem("cloak", JSON.stringify({ title, icon }));
}

function loadCloak(obj) {
  if (obj.title) document.title = obj.title;
  if (obj.icon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = obj.icon;
  }
}

document.addEventListener("keydown", (event) => {
  if (!panicKeybind) return;

  const key = event.key;
  const modifiers = [];

  if (event.ctrlKey) modifiers.push("Ctrl");
  if (event.shiftKey) modifiers.push("Shift");
  if (event.altKey) modifiers.push("Alt");
  if (event.metaKey) modifiers.push("Meta");

  const currentKeybind = [...modifiers, key].join("+");

  if (currentKeybind === panicKeybind) {
    location.href = "https://classroom.google.com/";
  }
});