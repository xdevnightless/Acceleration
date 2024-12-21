
fetch("/apps.json")
    .then((response) => response.json())
    .then((apps) => {
        apps.sort((a, b) => a.name.localeCompare(b.name));
        apps.forEach((app) => {
            const appDiv = document.createElement("div");
            appDiv.classList.add("card");
            const imgElement = document.createElement("img");
            imgElement.src = app.icon;
            imgElement.alt = app.name;
            imgElement.classList.add("app-image");
            imgElement.loading = "lazy";
            const appName = document.createElement("p");
            appName.classList.add("app-name");
            appName.textContent = app.name;
            appDiv.addEventListener("click", () => {
                launch(app.link);
            });
            appDiv.appendChild(imgElement);
            appDiv.appendChild(appName);
            document.querySelector('.app-links').appendChild(appDiv);
        });
        const searchBar = document.getElementById("searchApps");
        searchBar.addEventListener("input", () => {
            const query = searchBar.value.toLowerCase();
            const appElements = document.querySelector('.app-links').querySelectorAll(".card");
            appElements.forEach((appElement) => {
                const appName = appElement.querySelector(".app-name");
                const match = appName && appName.textContent.toLowerCase().includes(query);
                appElement.style.display = match ? "block" : "none";
            });
        });
    })

    function launch(link) {
        registerSW();
        parent.setupBaremux();
        location.href = __uv$config.prefix + __uv$config.encodeUrl(link);
        parent.hideNav();
    }
