(function () {

    const BASE_URL = "http://127.0.0.1:5000";

    async function loadChatbot() {
        try {
            const res = await fetch(BASE_URL);
            const html = await res.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const wrapper = document.createElement("div");
            wrapper.id = "chatbot-wrapper";
            wrapper.innerHTML = doc.body.innerHTML;
            document.body.appendChild(wrapper);

            doc.querySelectorAll("link[rel='stylesheet']").forEach(link => {
                const newLink = document.createElement("link");
                newLink.rel = "stylesheet";
                newLink.href = absolutePath(link.getAttribute("href"));
                document.head.appendChild(newLink);
            });

            await loadScriptsSequentially(doc);

            if (window.initChatbot) {
                window.initChatbot();
            }

        } catch (err) {
            console.warn("Chatbot not available", err);
        }
    }

    function absolutePath(path) {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return BASE_URL + path;
    }

    function loadScriptsSequentially(doc) {
        const scripts = Array.from(doc.querySelectorAll("script[src]"));

        return scripts.reduce((promise, script) => {
            return promise.then(() => new Promise(resolve => {
                const s = document.createElement("script");
                s.src = absolutePath(script.getAttribute("src"));
                s.onload = resolve;
                document.body.appendChild(s);
            }));
        }, Promise.resolve());
    }

    fetch(`${BASE_URL}/health`)
        .then(res => {
            if (res.ok) loadChatbot();
        })
        .catch(() => console.warn("Server not running"));
})();