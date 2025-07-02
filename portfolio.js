let portfolioItems = [];

// Function to create portfolio items
function createPortfolioItem(item) {
    return `
        <div class="portfolio-item" data-category="${item.category}">
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-item-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </div>
    `;
}

// Function to render portfolio items by category
function renderPortfolio(category) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    let filteredItems = portfolioItems;
    if (category !== 'all') {
        filteredItems = portfolioItems.filter(item => item.category === category);
    }
    portfolioGrid.innerHTML = filteredItems.map(createPortfolioItem).join('');
    if (window.lucide) lucide.createIcons();
}

// Fetch portfolio items and categories from JSON and initialize
document.addEventListener('DOMContentLoaded', () => {
    fetch('portfolio-data.json')
        .then(response => response.json())
        .then(data => {
            portfolioItems = data;

            // Dynamically get unique categories
            const categories = Array.from(
                new Set(portfolioItems.map(item => item.category.toLowerCase()))
            );

            // Render filter buttons dynamically
            const filtersContainer = document.querySelector('.portfolio-filters');
            if (filtersContainer) {
                filtersContainer.innerHTML = `
                    <button class="filter-btn active" data-filter="all">All Projects</button>
                    ${categories.map(cat => `
                        <button class="filter-btn" data-filter="${cat}">
                            <i data-lucide="${getCategoryIcon(cat)}"></i> ${capitalize(cat)}
                        </button>
                    `).join('')}
                `;
            }

            // Add filter functionality
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const category = button.dataset.filter;
                    renderPortfolio(category);
                });
            });

            // Render all items initially
            renderPortfolio('all');

            // Re-initialize Lucide icons
            if (window.lucide) lucide.createIcons();
        });
});

// Helper to capitalize category names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper to map category to icon name
function getCategoryIcon(category) {
    switch (category.toLowerCase()) {
        case 'development': return 'code';
        case 'photography': return 'camera';
        case 'design': return 'pencil';
        case 'video editing': return 'film';
        default: return 'folder';
    }
}

// Matrix-like animated role changer
const roles = [
    "Information Technologist",
    "Web Developer / Designer",
    "Multimedia Artist",
    "Virtual Assistant"
];

function matrixTransition(element, newText, callback) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const oldText = element.textContent;
    const maxLen = Math.max(oldText.length, newText.length);
    let frame = 0;
    const scramble = [];

    function randomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    // Prepare scramble array
    for (let i = 0; i < maxLen; i++) {
        scramble[i] = { from: oldText[i] || "", to: newText[i] || "", char: randomChar(), progress: 0 };
    }

    function animate() {
        let output = "";
        let done = true;
        for (let i = 0; i < maxLen; i++) {
            if (scramble[i].progress < 1) {
                done = false;
                // Make the random letter roll slower by lowering the probability
                if (Math.random() < 0.1) { // was 0.3
                    scramble[i].char = randomChar();
                }
                output += `<span style="opacity:0.7">${scramble[i].char}</span>`;
                scramble[i].progress += 0.05; // was 0.08, slower progress
            } else {
                output += scramble[i].to || "";
            }
        }
        element.innerHTML = output;
        if (!done) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = newText;
            if (callback) callback();
        }
    }
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    // Animated role logic
    const roleElement = document.getElementById('animated-role');
    let roleIndex = 0;
    setInterval(() => {
        const nextIndex = (roleIndex + 1) % roles.length;
        matrixTransition(roleElement, roles[nextIndex]);
        roleIndex = nextIndex;
    }, 3000);
});

document.addEventListener("DOMContentLoaded", function() {
    // Lucide icons
    if (window.lucide) lucide.createIcons();

    // Floating icons randomizer
    const icons = document.querySelectorAll('.floating-icons .fi');
    icons.forEach(icon => {
        randomizeIcon(icon);
        icon.addEventListener('animationiteration', () => randomizeIcon(icon));
    });

    function randomizeIcon(icon) {
        // Random horizontal position (5% to 90%)
        icon.style.left = `${5 + Math.random() * 90}%`;
        // Random animation delay (0 to 7s)
        icon.style.animationDelay = `${Math.random() * 7}s`;
    }
});

// Tools section dynamic loader
document.addEventListener('DOMContentLoaded', () => {
    fetch('tools-data.json')
        .then(response => response.json())
        .then(tools => {
            const toolsGrid = document.querySelector('.tools-grid');
            if (toolsGrid) {
                toolsGrid.innerHTML = tools.map(tool => `
                    <div class="tool-item">
                        <img src="${tool.icon}" alt="${tool.name}">
                        <span>${tool.name}</span>
                        <p class="tool-desc">${tool.description || ""}</p>
                    </div>
                `).join('');
            }
        });
});