function loadTheme(theme = localStorage.getItem("theme")) {
    document.documentElement.className = theme;
}

loadTheme();
