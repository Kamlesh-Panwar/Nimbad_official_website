(function() {
    let iframe = document.createElement("iframe");
    iframe.src = "http://127.0.0.1:5000";
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.right = "20px";
    iframe.style.width = "400px";
    iframe.style.height = "550px";
    iframe.style.display = "flex";
    iframe.style.zIndex = "9999";

    fetch("http://127.0.0.1:5000/health")
        .then(res => {
            if (res.ok) {
                document.body.appendChild(iframe);
            } else {
                console.warn("Chatbot server not available.");
            }
        })
        .catch(() => {
            console.warn("Chatbot server is off, iframe hidden.");
        });

    document.body.addEventListener("click", function(event) {
        iframe.style.display = "flex";
    });
})();
