let allGames = [];
const gameModal = document.getElementById("gameModal");
let cart = []; 
let selectedFlashdiskSize = 0; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil Data Game
    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            // Akses array 'entries' (sesuai dengan config.yml)
            allGames = data.entries || []; 
            // Tambahkan ID ke setiap item agar mudah diakses.
            allGames = allGames.map((game, index) => ({...game, id: index + 1})); 

            renderGameCatalog();
            updateCapacityDisplay(); 
        })
        .catch(error => {
            console.error('Error fetching games.json:', error);
            // Menampilkan pesan error yang lebih jelas di frontend jika games.json gagal dimuat
            document.getElementById('game-catalog').innerHTML = '<p>Gagal memuat daftar game. Pastikan games.json ada di root.</p>';
        });
    
    // 2. Event Listener untuk Pilihan Flashdisk
    document.getElementById('flashdisk-size').addEventListener('change', (event) => {
        selectedFlashdiskSize = parseFloat(event.target.value);
        filterCartByCapacity();
        updateCartDisplay();
        updateCapacityDisplay();
    });

    // 3. Inisialisasi Netlify Identity Widget (Opsional, dihapus di admin/index.html)
    // Script Netlify Identity telah dihapus untuk mendukung GitHub OAuth.
});

// Fungsi untuk menampilkan kartu game
function renderGameCatalog() {
    const catalog = document.getElementById('game-catalog');
    catalog.innerHTML = ''; 

    if (allGames.length === 0) {
        catalog.innerHTML = '<p>Daftar game kosong. Silakan tambahkan game melalui panel Admin.</p>';
        return;
    }

    allGames.forEach(game => {
        const coverSrc = game.coverImage ? game.coverImage : 'placeholder.jpg';
        
        // Logika tampilan Ukuran (Full dan RIP)
        const ripSize = game.size_rip ? `${game.size_rip} GB` : '-';
        const displaySize = `Full: ${game.size_full} GB | RIP: ${ripSize}`;

        const card = document.createElement('div');
        card.classList.add('game-card');
        card.innerHTML = `
            <img src="${coverSrc}" alt="Cover ${game.title}" style="width:100%; height:auto;">
            <h3>${game.title}</h3>
            <p>Ukuran: ${displaySize}</p>
            <button onclick="addToCart(${game.id})" id="add-btn-${game.id}">+ Tambah ke Keranjang</button>
            <button onclick="showDetails(${game.id})">Lihat Detail</button>
        `;
        catalog.appendChild(card);
    });
}

// --- LOGIKA KERANJANG DAN KAPASITAS ---

function calculateTotalSize() {
    let total = 0;
    cart.forEach(gameId => {
        const game = allGames.find(g => g.id === gameId);
        if (game) {
            // Menggunakan size_full untuk perhitungan kapasitas
            total += parseFloat(game.size_full); 
        }
    });
    return parseFloat(total.toFixed(1));
}

function updateCapacityDisplay() {
    const totalSize = calculateTotalSize();
    const remaining = selectedFlashdiskSize - totalSize;
    
    document.getElementById('total-size').textContent = totalSize.toFixed(1);
    document.getElementById('remaining-capacity').textContent = remaining.toFixed(1);
    
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.disabled = totalSize === 0 || remaining < 0;

    const remainingElement = document.getElementById('remaining-capacity');
    if (remaining < 0) {
        remainingElement.style.color = 'red';
        checkoutButton.textContent = 'Kapasitas Kurang';
    } else {
        remainingElement.style.color = 'green';
        checkoutButton.textContent = 'Lanjutkan Pemesanan';
    }
}

function filterCartByCapacity() {
    if (selectedFlashdiskSize === 0) {
        cart = [];
        return;
    }
    
    let newCart = [];
    let currentTotal = 0;

    cart.forEach(gameId => {
        const game = allGames.find(g => g.id === gameId);
        if (game && (currentTotal + parseFloat(game.size_full) <= selectedFlashdiskSize)) {
            newCart.push(gameId);
            currentTotal += parseFloat(game.size_full);
        } else if (game) {
             console.warn(`Game ${game.title} melebihi batas kapasitas flashdisk yang baru (${selectedFlashdiskSize} GB). Dihapus dari keranjang.`);
        }
    });
    cart = newCart;
}


function updateCartDisplay() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    const cartCount = document.getElementById('cart-count');
    
    if (cart.length === 0) {
        cartList.innerHTML = '<li>Keranjang kosong.</li>';
    } else {
        cart.forEach(gameId => {
            const game = allGames.find(g => g.id === gameId);
            const li = document.createElement('li');
            li.innerHTML = `${game.title} (${game.size_full} GB) <button onclick="removeFromCart(${gameId})" style="margin-left: 10px; font-size: 0.8em;">X</button>`;
            cartList.appendChild(li);
        });
    }
    
    cartCount.textContent = cart.length;
    updateCapacityDisplay();
}

function addToCart(gameId) {
    if (selectedFlashdiskSize === 0) {
        alert("Harap pilih ukuran Flashdisk terlebih dahulu.");
        return;
    }

    const game = allGames.find(g => g.id === gameId);
    if (!game) return;
