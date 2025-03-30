document.querySelectorAll("link[rel='stylesheet'], style").forEach(el => {
    el.remove(); // Remove all stylesheets and <style> tags
});
document.body.innerHTML = "<h1 style='color: Blue; text-align: center; margin-top: 20%;'>Entering Next Stage...</h1>";
setTimeout(() => {
    document.body.innerHTML = "<h1 style='color: Blue; text-align: center; margin-top: 20%;'>Coming Soon...</h1>";
}, 3000);
