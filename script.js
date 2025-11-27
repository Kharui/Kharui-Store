// Variabel global untuk menyimpan data game
let allGames = []; 
const gameModal = document.getElementById("gameModal");

document.addEventListener('DOMContentLoaded', () => {
    // Fungsi fetch akan ditambahkan di Tahap 3
});

function showDetails(gameId) { /* Logika di Tahap 4.3 */ }
function closeModal() { gameModal.style.display = "none"; }
function orderGame() { alert("Fitur pemesanan akan segera berfungsi!"); }

window.onclick = function(event) {
    if (event.target === gameModal) {
        closeModal();
    }
}
