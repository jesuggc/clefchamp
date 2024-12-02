$("#copyFriendCode").on("click", function() {
    let x = $("#friendCode").text().split(":")[1].trim()
    navigator.clipboard.writeText(x)
})

const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("toggleButton");

// Añadimos el evento de clic para expandir/contraer el sidebar
// toggleButton.addEventListener("click", function() {
//     sidebar.classList.toggle("expanded"); // Alterna la clase 'expanded'
// });

$("#toggleSideBar").on("click", function() {
    $("#sideBar").toggleClass("col-1").toggleClass("col-2");
});
