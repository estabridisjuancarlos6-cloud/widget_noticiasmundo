const API_URL = "https://rss.app/feeds/v1.1/Ud9dCDA2fjqJD0it.json";
const INTERVAL_MS = 15000;

let newsItems = [];
let currentNewsIndex = 0;
let carouselInterval;

const carouselContainer = document.getElementById("news-carousel-container");
const paginationContainer = document.getElementById("pagination");

async function fetchNews() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        newsItems = data.items || [];

        if (newsItems.length) {
            renderCarousel();
            startCarousel();
        }
    } catch {
        carouselContainer.innerHTML = "<p>Error al cargar noticias</p>";
    }
}

function renderCarousel() {
    carouselContainer.innerHTML = "";
    paginationContainer.innerHTML = "";

    newsItems.forEach((item, index) => {
        carouselContainer.appendChild(createNewsCard(item, index));
        paginationContainer.appendChild(createDot(index));
    });

    updateDisplay(0);
}

function createNewsCard(item, index) {
    const card = document.createElement("div");
    card.className = "card-body";
    card.dataset.index = index;

    card.innerHTML = `
            <div class="news-row">
                <div class="image-container">
                    <img src="${item.image || 'placeholder.png'}" alt="">
                </div>
                <div class="text-content">
                    <div class="news-title">${item.title}</div>
                    <div class="summary">
                        ${item.content_text || item.title}
                    </div>
                </div>
            </div>
        `;
    return card;
}

function createDot(index) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.onclick = () => {
        clearInterval(carouselInterval);
        updateDisplay(index);
        startCarousel();
    };
    return dot;
}

function updateDisplay(index) {
    currentNewsIndex = index;
    document.querySelectorAll(".card-body").forEach((c, i) =>
        c.classList.toggle("active", i === index)
    );
    document.querySelectorAll(".dot").forEach((d, i) =>
        d.classList.toggle("active", i === index)
    );
}

function startCarousel() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        updateDisplay((currentNewsIndex + 1) % newsItems.length);
    }, INTERVAL_MS);
}

document.addEventListener("DOMContentLoaded", fetchNews);