document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const closeButton = document.getElementById("close-popup");
    const hintText = document.getElementById("hint-text");

    // Generate a random letter (A-Z)
    function generateRandomKey() {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return letters[Math.floor(Math.random() * letters.length)];
    }

    // Store random key in localStorage
    let randomKey = generateRandomKey();
    localStorage.setItem("loadingKey", randomKey);

    // Update hint text in HTML
    if (hintText) {
        // Terrifying warning first
        hintText.innerHTML = `<b style="color: red;">ANY mistake and you start from ZERO. No exceptions.</b>`;
    
        setTimeout(() => {
            hintText.innerHTML = `Press <b style="color: red;">Nipples</b> to continue loading.`;
        }, 10000);
    
        setTimeout(() => {
            hintText.innerHTML = `Press <b>${randomKey}</b> to continue loading.`;
        }, 12000);
    };
    console.log(`${randomKey}`)
    closeButton.addEventListener("click", function () {
        popup.style.display = "none"; // Hide popup

        // Load loading.js dynamically after popup is closed
        let script = document.createElement("script");
        script.src = "js/loading.js";
        script.onload = () => console.log("loading.js loaded");
        document.body.appendChild(script);
    });
});
