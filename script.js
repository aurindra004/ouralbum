const albums = [
    {
        id: 0,
        title: "first meet",
        date: "20 Februari 2026",
        cover: "foto/album1/cover.jpeg",
        photos: [
            { url: "foto/album1/cover.jpeg", caption: "pengalaman pertama bikin gelass" },
        ]
    },
    {
        id: 1,
        title: "tiba tiba jakarta",
        date: "5 Maret 2026",
        cover: "foto/album2/cover.jpg",
        photos: [
            { url: "foto/album2/cover.jpg", caption: "" },
            { url: "foto/album2/1.jpg", caption: "" },
            { url: "foto/album2/2.jpg", caption: "" },
            { url: "foto/album2/3.jpg", caption: "" },
            { url: "foto/album2/4.jpg", caption: "" },
            { url: "foto/album2/5.jpg", caption: "" },
        ]
    }
];

const book = document.getElementById('book');
let currentPage = 0;

function renderBook() {
    book.innerHTML = '';
    albums.forEach((album, index) => {
        const page = document.createElement('div');
        page.className = 'page';
        if (index === currentPage) {
            page.classList.add('active');
        } else if (index < currentPage) {
            page.classList.add('flipped');
        } else {
            page.classList.add('prev');
        }
        page.dataset.id = album.id;
        page.innerHTML = `
            <div class="album-item">
                <div class="album-cover">
                    <img src="${album.cover}" alt="${album.title}" loading="lazy">
                </div>
                <div class="album-info">
                    <h3 class="album-title">${album.title}</h3>
                    <div class="album-date"><i class="fa-regular fa-calendar"></i> ${album.date}</div>
                    <div class="album-count"><i class="fa-regular fa-image"></i> ${album.photos.length} momen</div>
                </div>
            </div>
        `;
        book.appendChild(page);
    });
    document.getElementById('pageIndicator').textContent = `Halaman ${currentPage + 1} dari ${albums.length}`;
}

function nextPage() {
    if (currentPage < albums.length - 1) {
        const currentPageElement = document.querySelector(`.page[data-id="${albums[currentPage].id}"]`);
        const nextPageElement = document.querySelector(`.page[data-id="${albums[currentPage + 1].id}"]`);
        
        currentPageElement.classList.remove('active');
        currentPageElement.classList.add('flipped');
        
        nextPageElement.classList.remove('prev');
        nextPageElement.classList.add('active');
        
        currentPage++;
        document.getElementById('pageIndicator').textContent = `Halaman ${currentPage + 1} dari ${albums.length}`;
    } else {
        alert('Sudah di halaman terakhir!');
    }
}

function prevPage() {
    if (currentPage > 0) {
        const currentPageElement = document.querySelector(`.page[data-id="${albums[currentPage].id}"]`);
        const prevPageElement = document.querySelector(`.page[data-id="${albums[currentPage - 1].id}"]`);
        
        currentPageElement.classList.remove('active');
        currentPageElement.classList.add('prev');
        
        prevPageElement.classList.remove('flipped');
        prevPageElement.classList.add('active');
        
        currentPage--;
        document.getElementById('pageIndicator').textContent = `Halaman ${currentPage + 1} dari ${albums.length}`;
    } else {
        alert('Sudah di halaman pertama!');
    }
}

document.getElementById('nextPage').addEventListener('click', nextPage);
document.getElementById('prevPage').addEventListener('click', prevPage);

// Swipe gesture
let touchStartX = 0;
book.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

book.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            prevPage(); // swipe kanan -> halaman sebelumnya
        } else {
            nextPage(); // swipe kiri -> halaman berikutnya
        }
    }
}, { passive: true });

// Buka modal saat klik album
book.addEventListener('click', (e) => {
    const page = e.target.closest('.page');
    if (page) {
        const albumId = parseInt(page.dataset.id);
        openAlbum(albumId);
    }
});

renderBook();

// ========== MODAL ==========
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
    const album = albums.find(a => a.id === currentAlbumId);
    if (!album) return;
    modalTitle.textContent = album.title;
    const photo = album.photos[currentPhotoIndex];
    modalImage.src = photo.url;
    captionText.textContent = photo.caption;

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

function changePhotoWithAnimation(direction) {
    const album = albums.find(a => a.id === currentAlbumId);
    let newIndex;
    if (direction === 'next') {
        newIndex = (currentPhotoIndex + 1) % album.photos.length;
    } else {
        newIndex = (currentPhotoIndex - 1 + album.photos.length) % album.photos.length;
    }

    const carouselMain = document.getElementById('carouselMain');
    carouselMain.classList.add('flip-' + direction);

    setTimeout(() => {
        currentPhotoIndex = newIndex;
        updateModal();
        carouselMain.classList.remove('flip-next', 'flip-prev');
        carouselMain.classList.add('image-enter');
        setTimeout(() => {
            carouselMain.classList.remove('image-enter');
        }, 300);
    }, 400);
}

prevPhotoBtn.addEventListener('click', () => {
    changePhotoWithAnimation('prev');
});

nextPhotoBtn.addEventListener('click', () => {
    changePhotoWithAnimation('next');
});

prevAlbumBtn.addEventListener('click', () => {
    const currentIndex = albums.findIndex(a => a.id === currentAlbumId);
    const newIndex = (currentIndex - 1 + albums.length) % albums.length;
    currentAlbumId = albums[newIndex].id;
    currentPhotoIndex = 0;
    updateModal();
});

nextAlbumBtn.addEventListener('click', () => {
    const currentIndex = albums.findIndex(a => a.id === currentAlbumId);
    const newIndex = (currentIndex + 1) % albums.length;
    currentAlbumId = albums[newIndex].id;
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

document.getElementById('randomAlbumBtn').addEventListener('click', () => {
    const randomId = albums[Math.floor(Math.random() * albums.length)].id;
    openAlbum(randomId);
});

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
    playPop();
});

const bear = document.getElementById('bear');
bear.addEventListener('click', () => {
    const messages = [
        "🧸: Halo! Aku beruang penjaga kenangan!",
        "🧸: Kamu lucu banget hari ini",
        "🧸: jangan lupa hati hati",
        "🧸: jangan lupa mandi hari ini",
        "🧸: Jangan sedih, aku peluk kamu 🤗"
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = randomMsg;
    tooltip.style.bottom = '80px';
    tooltip.style.right = '20px';
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
    
    playPop();
});

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
    } catch (e) {}
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