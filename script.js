const albums = [
    {
        id: 0,
        title: "first meet",
        date: "20 Februari 2026",
        cover: "foto/album1/1.jpg",
        photos: [
            { url: "foto/album1/1.jpg", caption: "" },
            { url: "foto/album1/1.jpg", caption: "" },
            { url: "foto/album1/1.jpg", caption: "" },
            { url: "foto/album1/1.jpg", caption: "" }
        ]
    },
    // Di sini bisa tambah album lain sesuai kebutuhan
];

// Koleksi pesan lucu
const funnyMessages = [
    "kamu lebih manis dari kue 🍰",
    "kalau baca ini, kamu lagi senyum 😊",
    "aku suka kamu, tapi lebih suka es krim 🍦",
    "hari ini aku belajar coding biar bisa bikin website ini",
    "kamu itu lucu, bahkan kucing tetangga setuju 🐱",
    "cinta kita seperti wifi, kadang hilang tapi selalu nyambung 📶",
    "foto ini bikin aku kangen kamu",
    "kalau kamu lagi sedih, ingat ada beruang kecil yang jagain 🧸",
    "peluk virtual dari aku 🤗",
    "jangan lupa makan, ya!",
    "aku lagi mikirin kamu sekarang",
    "kamu bikin hariku lebih berwarna 🌈"
];

// render grid
const albumGrid = document.getElementById('albumGrid');

function renderAlbums() {
    albumGrid.innerHTML = albums.map(album => `
        <div class="album-card" data-id="${album.id}">
            <div class="album-card__cover">
                <img src="${album.cover}" alt="${album.title}" loading="lazy">
            </div>
            <div class="album-card__info">
                <h3 class="album-card__title">${album.title}</h3>
                <div class="album-card__date"><i class="fa-regular fa-calendar"></i> ${album.date}</div>
                <div class="album-card__count"><i class="fa-regular fa-image"></i> ${album.photos.length} momen</div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', () => {
            openAlbum(parseInt(card.dataset.id));
        });
    });
}
renderAlbums();

// modal elements
const modal = document.getElementById('albumModal');
const modalTitle = document.getElementById('modalAlbumTitle');
const modalImage = document.getElementById('modalImage');
const captionText = document.getElementById('captionText');
const dotContainer = document.getElementById('dotContainer');
const closeModalBtn = document.getElementById('closeModalBtn');
const prevPhotoBtn = document.getElementById('prevPhotoBtn');
const nextPhotoBtn = document.getElementById('nextPhotoBtn');
const prevAlbumBtn = document.getElementById('prevAlbumBtn');
const nextAlbumBtn = document.getElementById('nextAlbumBtn');

let currentAlbumId = 0;
let currentPhotoIndex = 0;

function openAlbum(id) {
    currentAlbumId = id;
    currentPhotoIndex = 0;
    updateModal();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function updateModal() {
    const album = albums[currentAlbumId];
    modalTitle.textContent = album.title;
    const photo = album.photos[currentPhotoIndex];
    modalImage.src = photo.url;
    captionText.textContent = photo.caption;

    // update dots
    dotContainer.innerHTML = album.photos.map((_, idx) => {
        return `<span class="dot ${idx === currentPhotoIndex ? 'active' : ''}" data-index="${idx}"></span>`;
    }).join('');

    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentPhotoIndex = parseInt(dot.dataset.index);
            updateModal();
        });
    });
}

// navigasi foto
prevPhotoBtn.addEventListener('click', () => {
    const album = albums[currentAlbumId];
    currentPhotoIndex = (currentPhotoIndex - 1 + album.photos.length) % album.photos.length;
    updateModal();
});

nextPhotoBtn.addEventListener('click', () => {
    const album = albums[currentAlbumId];
    currentPhotoIndex = (currentPhotoIndex + 1) % album.photos.length;
    updateModal();
});

// navigasi album
prevAlbumBtn.addEventListener('click', () => {
    currentAlbumId = (currentAlbumId - 1 + albums.length) % albums.length;
    currentPhotoIndex = 0;
    updateModal();
});

nextAlbumBtn.addEventListener('click', () => {
    currentAlbumId = (currentAlbumId + 1) % albums.length;
    currentPhotoIndex = 0;
    updateModal();
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// fitur tambahan: album acak
document.getElementById('randomAlbumBtn').addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * albums.length);
    openAlbum(randomId);
});

// hujan hati
document.getElementById('showerBtn').addEventListener('click', () => {
    for (let i = 0; i < 18; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
    // tambah suara kecil (opsional)
    playPop();
});

// tambahan: klik di area kosong album keluarkan hati kecil
document.querySelector('.book').addEventListener('click', (e) => {
    if (!e.target.closest('.album-card') && !e.target.closest('.btn')) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '💖';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = '2rem';
        heart.style.animation = 'fall 2s linear forwards';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
        playPop();
    }
});

// Fitur kejutan lucu (tombol baru)
// document.getElementById('jokeBtn').addEventListener('click', () => {
//     const randomIndex = Math.floor(Math.random() * funnyMessages.length);
//     const message = funnyMessages[randomIndex];
//     alert('💬 ' + message);
//     // tambah efek beruang
//     const bear = document.getElementById('bear');
//     bear.style.transform = 'scale(1.5)';
//     setTimeout(() => bear.style.transform = 'scale(1)', 300);
//     playPop();
// });

// Karakter beruang interaktif
const bear = document.getElementById('bear');
bear.addEventListener('click', () => {
    const messages = [
        "🧸: Halo! Aku beruang penjaga kenangan!",
        "🧸: Kamu lucu banget hari ini",
        "🧸: Coba klik album, ada kejutan lho",
        "🧸: Aku suka kamu... sama es krim",
        "🧸: Jangan sedih, aku peluk kamu 🤗"
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    // tampilkan tooltip sementara
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = randomMsg;
    tooltip.style.bottom = '80px';
    tooltip.style.right = '20px';
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
    
    // efek suara
    playPop();
});

// Fungsi untuk memainkan efek suara sederhana (menggunakan Web Audio API)
function playPop() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        // browser mungkin tidak mendukung atau autoplay diblokir
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const quoteSpan = document.getElementById('randomQuote');
    function updateRandomQuote() {
        const quotes = [
            "banyak senyum 😊",
            "cinta ❤️",
            "beruang kecil 🧸",
            "kebahagiaan ✨",
            "kenangan manis 🍭"
        ];
        quoteSpan.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }
    updateRandomQuote();
    setInterval(updateRandomQuote, 5000);
});
