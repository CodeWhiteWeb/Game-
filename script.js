document.body.innerHTML = `
<div id="popup">
<div id="popup-content">
    <span id="close-popup">&times;</span>
    <h2>System Notification</h2>
    <p>⚠ WARNING ⚠.</p>
    <p>
        This game(?) contains flashing lights, rapid screen effects, and intense visual stimuli. It may cause eye strain, discomfort, or light-induced seizures in sensitive individuals. Viewer discretion is advised.</p>
        <p id="hint-text"></p>
        <p>Hints will be provided but you have to figure out everything yourself.</p>
</div>
</div>
<style>
body {
    background-color: black;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
    overflow: hidden;
}

/* Popup styles */
#popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7); /* Dark transparent overlay */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

#popup-content {
    background: rgb(0, 0, 0);
    padding: 20px;
    width: 300px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
    position: relative;
}

#close-popup {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
}
    </style>`


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
