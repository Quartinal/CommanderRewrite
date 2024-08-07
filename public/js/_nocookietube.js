(function() {
    window.onload = () => {
        let player;

        const youtubeApi = () => {
            if (window.YT) {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            }

            return new Promise((resolve, reject) => {
                window.onYouTubeIframeAPIReady = () => {
                    resolve();
                };
            });
        };

        const input = document.querySelector(".input input"),
            button = document.querySelector(".input button"),
            theater = document.querySelector(".theater");
        
        const youtubeStateChange = event => {
            switch (event.data) {
                case YT.PlayerState.ENDED:
                case YT.PlayerState.CUED:
                    theater.style.setProperty("display", "none");
                    document.body.classList.remove("playing");
                    break;
                case YT.PlayerState.PLAYING:
                case YT.PlayerState.BUFFERING:
                    theater.style.setProperty("display", "flex");
                    document.body.classList.add("playing");
                    break;
                case YT.PlayerState.PAUSED:
                    break;
            }
        };

        const onPlayerReady = () => {
            if (location.hash && location.hash !== "#null") {
                player.loadVideoById(location.hash.substring(1));
            } else {
                form.style.setProperty("display", "flex");
            }
        };

        youtubeApi().then(() => {
            player = new YT.Player("player", {
                host: "https://www.youtube-nocookie.com",
                playerVars: {
                    modestbranding: 1,
                    wmode: "transparent",
                    showinfo: 0,
                    autohide: 1,
                    autoplay: 1
                },
                events: {
                    "onStateChange": youtubeStateChange,
                    "onReady": onPlayerReady
                }
            });
        });

        const getYoutubeId = url => {
            try {
                url = new URL(url);
            } catch (error) {
                return false;
            }

            if (url.host === "www.youtube.com") {
                return (new URLSearchParams(url.search)).get("v");
            }
            
            if (url.host === "youtu.be") {
                return url.pathname.substring(1);
            }

            return false;
        };

        button.onclick = (e) => {
            e.preventDefault();

            const id = getYoutubeId(input.value);

            if (id) {
                player.loadVideoById(id);
                history.pushState(null, null, "#" + id);
            } else {
                alert("Please provide a YouTube URL");
            }
        };

        input.onkeydown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                const id = getYoutubeId(input.value);

                if (id) {
                    player.loadVideoById(id);
                    history.pushState(null, null, "#" + id);
                } else {
                    alert("Please provide a YouTube URL");
                }
            }
        };

        document.querySelector(".consent-icon svg").onclick = () => {
            player.stopVideo();
            form.style.setProperty("display", "flex");
            history.pushState(null, null, location.pathname);
        };

        window.onhashchange = () => {
            if (location.hash.length > 1) {
                form.style.setProperty("display", "none");
                player.loadVideoById(location.hash.substring(1));
            } else {
                form.style.setProperty("display", "flex");
            }
        };
    };
})();