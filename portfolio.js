// Helper to get the current section from the URL
function getSectionFromPath() {
    // Check query string
    const params = new URLSearchParams(window.location.search);
    if (params.has('sec')) {
        const section = params.get('sec').toLowerCase();
        if (section === 'softwaredev' || section === 'multimedia') return section;
    }
    // Check hash
    if (window.location.hash) {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash === 'softwaredev' || hash === 'multimedia') return hash;
    }
    // Fallback to pathname (for local dev or direct file open)
    const path = window.location.pathname.toLowerCase();
    if (path.includes('softwaredev')) return 'softwaredev';
    if (path.includes('multimedia')) return 'multimedia';
    return 'default';
}

// Helper to get JSON filenames based on section
function getJsonFilenames(section) {
    if (section === 'softwaredev') {
        return {
            works: 'softwaredev.json',
            tools: 'softwaredev-tools.json',
            info: 'softwaredev-info.json'
        };
    }
    if (section === 'multimedia') {
        return {
            works: 'multimedia.json',
            tools: 'multimedia-tools.json',
            info: 'multimedia-info.json'
        };
    }
    // Default fallback
    return {
        works: 'portfolio-data.json',
        tools: 'tools-data.json',
        info: 'default-info.json'
    };
}

let portfolioItems = [];

// Function to create portfolio items
function createPortfolioItem(item) {
    return `
        <div class="portfolio-item" data-category="${item.category}">
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-item-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.link}" class="portfolio-link-btn" target="_blank">View Project</a>
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
    } else {
        // Only show items with isHighlight = 1 for "All Projects"
        filteredItems = portfolioItems.filter(item => item.isHighlight === 1);
    }
    portfolioGrid.innerHTML = filteredItems.map(createPortfolioItem).join('');
    if (window.lucide) lucide.createIcons();
}

// Helper to capitalize category names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper to map category to icon name
function getCategoryIcon(category) {
    switch (category.toLowerCase()) {
        default: return 'folder';
    }
}

function getRolesForSection(section) {
    if (section === 'softwaredev') {
        return [
            "Software Developer",
            "Web Developer",
            "Full Stack Engineer",
            "Frontend Developer",
            "Backend Developer",
            "App Developer",
            "Tech Enthusiast"
        ];
    } else if (section === 'multimedia') {
        return [
            "Multimedia Artist",
            "Video Editor",
            "Graphic Designer",
            "Content Creator",
            "Social Media Manager",
            "Virtual Assistant",
            "Creative Professional"
        ];
    }
    // Multimedia default
    return [
        "Information Technologist",
        "Video Editor",
        "Graphic Designer / Photo Editor",
        "Content Creator / Social Media Manager",
        "Multimedia Artist",
        "Virtual Assistant"
    ];
}

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
                if (Math.random() < 0.1) {
                    scramble[i].char = randomChar();
                }
                output += `<span style="opacity:0.7">${scramble[i].char}</span>`;
                scramble[i].progress += 0.05;
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
    // Detect section
    const section = getSectionFromPath();
    if (section === 'default') {
        document.getElementById('landing-page').style.display = 'flex';
        document.querySelector('header').style.display = 'none';
        document.querySelector('main').style.display = 'none';
        document.querySelector('footer').style.display = 'none';
        return;
    }
    const { works, tools, info } = getJsonFilenames(section);

    // Fetch about, pitch, and roles info
    fetch(info)
        .then(response => response.json())
        .then(data => {
            // Update About section
            const aboutTitle = document.querySelector('#about h2');
            const aboutText = document.querySelector('.about-text');
            if (aboutTitle) aboutTitle.textContent = data.about.title === "Software Developer" ? "About Me (Software Developer)" : "About Me";
            if (aboutText) aboutText.innerHTML = data.about.aboutText;

            // Update Pitch section
            const pitchText = document.querySelector('.pitch-text p');
            if (pitchText) pitchText.textContent = data.pitch;

            // Animated role logic (now from JSON)
            const roles = data.roles || [];
            const roleElement = document.getElementById('animated-role');
            let roleIndex = 0;
            if (roles.length && roleElement) {
                setInterval(() => {
                    const nextIndex = (roleIndex + 1) % roles.length;
                    matrixTransition(roleElement, roles[nextIndex]);
                    roleIndex = nextIndex;
                }, 3000);
            }
            // Update footer links dynamically
            if (data.links) {
                const contact = document.getElementById('footer-contact');
                const resume = document.getElementById('footer-resume');
                const privacy = document.getElementById('footer-privacy');
                if (contact) contact.href = data.links.contact || "#";
                if (resume) resume.href = data.links.resume || "#";
                if (privacy) privacy.href = data.links.privacy || "#";
            }
        });

    // Portfolio section
    fetch(works)
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

    // Tools section dynamic loader
    fetch(tools)
        .then(response => response.json())
        .then(toolsData => {
            const toolsGrid = document.querySelector('.tools-grid');
            if (toolsGrid) {
                toolsGrid.innerHTML = toolsData.map(tool => `
                    <div class="tool-item">
                        <img src="${tool.icon}" alt="${tool.name}">
                        <span>${tool.name}</span>
                        <p class="tool-desc">${tool.description || ""}</p>
                    </div>
                `).join('');
            }
        });

    // Lucide icons and floating icons randomizer
    if (window.lucide) lucide.createIcons();
    const icons = document.querySelectorAll('.floating-icons .fi');
    icons.forEach(icon => {
        randomizeIcon(icon);
        icon.addEventListener('animationiteration', () => randomizeIcon(icon));
    });

    function randomizeIcon(icon) {
        icon.style.left = `${5 + Math.random() * 90}%`;
        icon.style.animationDelay = `${Math.random() * 7}s`;
    }
});