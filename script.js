document.addEventListener('DOMContentLoaded', () => {
    fetch('games.json')
        .then(response => response.json())
        .then(games => {
            const catalog = document.getElementById('game-catalog');
            catalog.innerHTML = '';

            games.forEach(game => {
                const card = document.createElement('div');
                card.classList.add('game-card');
                card.innerHTML = `
                    <img src="${game.coverImage || 'placeholder.jpg'}" alt="Cover ${game.title}" style="width:100%; height:auto;">
                    <h3>${game.title}</h3>
                    <p>Ukuran: ${game.sizeGB} GB</p>
                    <button onclick="showDetails(${game.id})">Lihat Detail</button>
                `;
                catalog.appendChild(card);
            });
        });
});

function showDetails(gameId) {
    alert('Detail game akan muncul di sini untuk ID: ' + gameId);
}
