function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        // Get timezone abbreviation if possible, or just don't show it to keep it simple and correct
        // formatting as HH:MM
        clockEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

async function updateLocation() {
    const locationTextEls = document.querySelectorAll('.location-text');
    const countryEls = document.querySelectorAll('.country');
    const CACHE_KEY = 'userLocationData_v2';
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        let data;

        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_DURATION) {
                data = parsed.data;
                console.log('Using cached location data');
            }
        }

        if (!data) {
            console.log('Fetching new location data');
            const response = await fetch('https://ipwho.is/');
            data = await response.json();

            if (data.success === true) {
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: data
                }));
            }
        }

        if (data && data.success === true) {
            // Update UI
            locationTextEls.forEach(el => {
                el.innerText = `${data.city}, ${data.region}`;
            });
            countryEls.forEach(el => {
                el.innerText = data.country;
            });
        }

    } catch (error) {
        console.warn('Error fetching location from ipwho.is, trying fallback:', error);
        try {
            // Fallback to geojs.io
            const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
            const data = await response.json();

            // store fallback data in same structure
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: {
                    success: true,
                    city: data.city,
                    region: data.region,
                    country: data.country
                }
            }));

            // Update UI with fallback data
            locationTextEls.forEach(el => {
                el.innerText = `${data.city}, ${data.region}`;
            });
            countryEls.forEach(el => {
                el.innerText = data.country;
            });

        } catch (fallbackError) {
            console.error('All location fetches failed:', fallbackError);
            // Optional: Set default "Earth" or similar if needed, or leave as is
        }
    }
}

document.addEventListener('DOMContentLoaded', updateLocation);

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
    });
    document.querySelectorAll('a, button, .logo-wrapper, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            cursorOutline.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--text-color)';
        });
    });
}

function renderFooterMarquee() {
    const footer = document.getElementById('footer-marquee');
    if (!footer) return;

    // Book SVG (Quran)
    const bookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" class="smiley-icon"><path d="M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24ZM120,40h48v72L148.79,97.6a8,8,0,0,0-9.6,0L120,112Zm80,144H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40h32v88a8,8,0,0,0,12.8,6.4L144,114l27.21,20.4A8,8,0,0,0,176,136a8,8,0,0,0,8-8V40h16Z"></path></svg>`;

    const items = [
        { text: 'In the Name of Allah, the Most Gracious, the Most Merciful', hoverColor: 'var(--accent-green)' },
        { text: 'Convey from me, even if it is one verse', hoverColor: '#a855f7' },
        { text: 'The Quran is the Guide of Life', hoverColor: '#3b82f6' },
        { text: 'Fast & Free API', hoverColor: '#f59e0b' }
    ];

    let marqueeHTML = '<div class="marquee-container mb-8 cursor-default select-none"><div class="marquee-content">';

    const marqueeItems = [...items, ...items];

    marqueeItems.forEach(item => {
        marqueeHTML += `<span class="marquee-text text-[8vw] leading-none font-medium tracking-tighter mr-10 transition-colors duration-500 inline-flex items-center gap-4" style="--hover-color: ${item.hoverColor}" onmouseenter="this.style.color='${item.hoverColor}'" onmouseleave="this.style.color=''">${bookIcon}${item.text}</span>`;
    });
    marqueeHTML += '</div></div>';

    marqueeHTML += `
    <div class="footer-bottom">
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <p>Built with ❤️ for the Ummah.</p>
        <p>Read. Reflect. Act.</p>
      </div>
      
      

      <div class="footer-right">
        <div class="footer-social-links" style="display: flex; gap: 1rem; justify-content: flex-end;">
            <a href="https://damarcreative.my.id/" target="_blank" aria-label="Portfolio" style="color: inherit; transition: color 0.3s;" onmouseenter="this.style.color='var(--accent-green)'" onmouseleave="this.style.color='inherit'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </a>
            <a href="https://github.com/Damarcreative" target="_blank" aria-label="GitHub" style="color: inherit; transition: color 0.3s;" onmouseenter="this.style.color='var(--accent-green)'" onmouseleave="this.style.color='inherit'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://huggingface.co/Damarjati" target="_blank" aria-label="HuggingFace" style="color: inherit; transition: color 0.3s;" onmouseenter="this.style.color='var(--accent-green)'" onmouseleave="this.style.color='inherit'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16a3.5 3.5 0 0 0 4 0"></path><path d="M20.4 14a8 8 0 0 0-1.7-5.3 7 7 0 0 0-3.2-3.2 8.3 8.3 0 0 0-3.5-.5c-3.7 0-6.9 2.1-8.5 5.2a8 8 0 0 0-.5 3.8 8.4 8.4 0 0 0 1.2 3.6 8 8 0 0 0 .5 3.8c1.6 3.1 4.8 5.2 8.5 5.2 1.2 0 2.4-.2 3.5-.5a7 7 0 0 0 3.2-3.2 8 8 0 0 0 1.7-5.3"></path></svg>
            </a>
        </div>
        <p>© 2026 DamarCreative. Open Source.</p>
      </div>
    </div>
  `;

    footer.innerHTML = marqueeHTML;
}

renderFooterMarquee();

function renderProjects() {
    const dataScript = document.getElementById('projects-data');
    const container = document.getElementById('projects-container');
    if (!dataScript || !container) return;

    const projects = JSON.parse(dataScript.textContent);
    let html = '';

    projects.forEach(project => {
        const skillsHtml = project.skills ?
            `<div class="skills-list">${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}</div>` : '';

        const linksHtml = project.links ?
            `<div class="project-links">
                ${project.links.sort((a, b) => {
                if (a.label === 'Source') return -1;
                if (b.label === 'Source') return 1;
                return 0;
            }).map(link => `
                    <a href="${link.url}" class="project-link" target="_blank">
                        ${link.label} 
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </a>`).join('')}
            </div>` : '';

        html += `
            <div class="project-item">
                <div class="project-meta">
                    <p class="project-year">${project.year}</p>
                    <h3>${project.title}</h3>
                    ${linksHtml}
                </div>
                <div class="project-info">
                    <p>${project.description || 'No description available.'}</p>
                    ${skillsHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderExperience() {
    const dataScript = document.getElementById('experience-data');
    const container = document.getElementById('experience-container');
    if (!dataScript || !container) return;

    const experiences = JSON.parse(dataScript.textContent);
    let html = '';

    experiences.forEach(exp => {
        const skillsHtml = exp.skills ?
            `<div class="skills-list">${exp.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}</div>` : '';

        html += `
            <div class="list-item">
                <div class="experience-item">
                    <div class="experience-date">${exp.period}</div>
                    <div class="experience-content">
                        <h3>${exp.role}</h3>
                        <p class="company">${exp.company}</p>
                        <p class="description">${exp.description}</p>
                        ${skillsHtml}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderEducation() {
    const dataScript = document.getElementById('education-data');
    const container = document.getElementById('education-container');
    if (!dataScript || !container) return;

    const data = JSON.parse(dataScript.textContent);
    let html = '<div class="education-grid">';

    html += '<div><h2 class="section-subtitle">Formal Education</h2>';
    data.formal.forEach(edu => {
        const badgesHtml = edu.badges ?
            `<div class="skills-list">${edu.badges.map(badge => `<span class="skill-tag">${badge}</span>`).join('')}</div>` : '';

        html += `
            <div class="list-item education-item">
                <p class="year">${edu.period}</p>
                <h3>${edu.degree}</h3>
                <p class="school">${edu.school}</p>
                <p class="description">${edu.description}</p>
                ${badgesHtml}
            </div>
        `;
    });
    html += '</div>';

    html += '<div><h2 class="section-subtitle">Certifications</h2>';
    data.certifications.forEach(cert => {
        html += `
            <div class="list-item cert-item">
                <p class="year">${cert.year}</p>
                <h3>${cert.title}</h3>
                <p class="description">${cert.description}</p>
            </div>
        `;
    });
    html += '</div></div>';

    container.innerHTML = html;
}

function renderAbout() {
    const dataScript = document.getElementById('about-data');
    const container = document.getElementById('about-container');
    if (!dataScript || !container) return;

    const data = JSON.parse(dataScript.textContent);

    const introHtml = data.intro.map(p => `<p>${p}</p>`).join('');

    const statsHtml = `
        <div class="about-stats">
            ${data.stats.map(stat => `
                <div class="stat-item">
                    <div class="stat-number">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('')}
        </div>
    `;

    const servicesHtml = data.services.map(service => `
        <div class="list-item">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');

    const skillsHtml = `
        <div class="skills-section">
            <h4>Skills</h4>
            <div class="skills-list">
                ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `;

    container.innerHTML = `
        <div class="about-grid">
            <div class="about-intro">
                ${introHtml}
                ${statsHtml}
            </div>
            <div>
                ${servicesHtml}
                ${skillsHtml}
            </div>
        </div>
    `;
}


function renderResources() {
    const container = document.getElementById('resource-container');
    const dataScript = document.getElementById('resource-data');

    if (!container || !dataScript) return;

    const arrowIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em"><path d="M7 17L17 7M17 7H7M17 7V17"></path></svg>`;

    try {
        const data = JSON.parse(dataScript.textContent);
        const { models, datasets, repos } = data;

        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(0);
            const parts = dateStr.split(' ');
            if (parts.length !== 3) return new Date(0);

            const monthMap = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };

            const day = parseInt(parts[0], 10);
            const month = monthMap[parts[1]] !== undefined ? monthMap[parts[1]] : 0;
            const year = parseInt(parts[2], 10);

            return new Date(year, month, day);
        };

        const sortByDateDesc = (a, b) => parseDate(b.date) - parseDate(a.date);

        models.sort(sortByDateDesc);
        datasets.sort(sortByDateDesc);
        repos.sort(sortByDateDesc);

        let html = '<div class="resource-grid">';

        html += '<div class="resource-column"><h2>AI Models</h2><div class="resource-list">';
        models.forEach(item => {
            html += `
                <a href="https://huggingface.co/${item.id}" target="_blank" class="resource-card">
                    <h3>${item.id.split('/')[1]} ${arrowIcon}</h3>
                    <div class="resource-date">${item.date}</div>
                    <div class="resource-tags">
                        ${item.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
                    </div>
                </a>
            `;
        });
        html += '</div></div>';

        html += '<div class="resource-column"><h2>Datasets</h2><div class="resource-list">';
        datasets.forEach(item => {
            html += `
                <a href="https://huggingface.co/datasets/${item.id}" target="_blank" class="resource-card">
                    <h3>${item.id.split('/')[1]} ${arrowIcon}</h3>
                    <div class="resource-date">${item.date}</div>
                    <div class="resource-tags">
                        ${item.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
                    </div>
                </a>
            `;
        });
        html += '</div></div>';

        html += '<div class="resource-column"><h2>Repositories</h2><div class="resource-list">';
        repos.forEach(item => {
            const langTag = item.language ? `<span class="resource-tag">${item.language}</span>` : '';
            html += `
                <a href="${item.html_url}" target="_blank" class="resource-card">
                    <h3>${item.name} ${arrowIcon}</h3>
                    <p>${item.description || 'No description provided.'}</p>
                    <div class="resource-date">${item.date}</div>
                    <div class="resource-tags">
                        ${langTag}
                    </div>
                </a>
            `;
        });
        html += '</div></div>';

        html += '</div>';
        container.innerHTML = html;

    } catch (e) {
        console.error("Error parsing resource data", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing scripts...');
    setupMobileMenu();
    renderProjects();
    renderExperience();
    renderEducation();
    renderAbout();
    renderResources();
    initQuranApp();
    initEditionsModal();
    initPlayground();
});

function initPlayground() {
    const sendBtn = document.getElementById('playground-send');
    const urlInput = document.getElementById('playground-url');
    const outputContainer = document.getElementById('playground-output');
    const codeBlock = document.getElementById('playground-code');

    if (!sendBtn || !urlInput || !outputContainer || !codeBlock) return;

    sendBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) return;

        // Visual feedback
        sendBtn.textContent = '...';
        sendBtn.disabled = true;
        outputContainer.style.display = 'block';
        codeBlock.textContent = 'Loading...';

        try {
            const start = Date.now();
            const res = await fetch(url);
            const data = await res.json();
            const duration = Date.now() - start;

            // Format JSON
            codeBlock.textContent = JSON.stringify(data, null, 2);
            codeBlock.style.color = 'var(--text-color)'; // Reset successful color
        } catch (err) {
            codeBlock.textContent = `Error: ${err.message}`;
            codeBlock.style.color = '#ef4444'; // Red for error
        } finally {
            sendBtn.textContent = 'Send';
            sendBtn.disabled = false;
        }
    });
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    console.log('Mobile menu setup:', { menuToggle, navMenu });

    if (menuToggle && navMenu) {
        // Remove any existing listeners to be safe (though not strictly necessary on page load)
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);

        newToggle.addEventListener('click', (e) => {
            console.log('Hamburger clicked!');
            e.stopPropagation(); // Prevent bubbling
            newToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            console.log('Menu active state:', navMenu.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!newToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                console.log('Clicked outside, closing menu');
                newToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Link clicked, closing menu');
                newToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    } else {
        console.error('Mobile menu elements not found!');
    }
}

function initEditionsModal() {
    const viewAllBtn = document.getElementById('view-all-editions');
    const modal = document.getElementById('editions-modal');
    const closeBtn = document.getElementById('close-modal');
    const searchInput = document.getElementById('edition-search');
    const grid = document.getElementById('editions-grid');

    if (!viewAllBtn || !modal || !closeBtn || !searchInput || !grid) return;

    // List of available editions (derived from file system)
    const editions = [
        'am-sadiq', 'ar-jalalayn', 'ar-muyassar', 'arabic', 'az-mammadaliyev', 'az-musayev',
        'ber-mensur', 'bg-theophanov', 'bn-bengali', 'bn-hoque', 'bs-korkut', 'bs-mlivo',
        'cs-hrbek', 'cs-nykl', 'de-aburida', 'de-bubenheim', 'de-khoury', 'de-zaidan',
        'dv-divehi', 'en-ahmedali', 'en-ahmedraza', 'en-arberry', 'en-hilali', 'en-itani',
        'en-maududi', 'en-mubarakpuri', 'en-pickthall', 'en-qarai', 'en-qaribullah',
        'en-sahih', 'en-sarwar', 'en-shakir', 'en-transliteration', 'en-wahiduddin',
        'en-yusufali', 'es-bornez', 'es-cortes', 'es-garcia', 'fa-ansarian', 'fa-ayati',
        'fa-bahrampour', 'fa-fooladvand', 'fa-gharaati', 'fa-ghomshei', 'fa-khorramdel',
        'fa-khorramshahi', 'fa-makarem', 'fa-moezzi', 'fa-mojtabavi', 'fa-sadeqi',
        'fa-safavi', 'fr-hamidullah', 'ha-gumi', 'hi-farooq', 'hi-hindi', 'id-indonesian',
        'id-jalalayn', 'id-muntakhab', 'it-piccardo', 'ja-japanese', 'ko-korean',
        'ku-asan', 'ml-abdulhameed', 'ml-karakunnu', 'ms-basmeih', 'nl-keyzer',
        'nl-leemhuis', 'nl-siregar', 'no-berg', 'pl-bielawskiego', 'ps-abdulwali',
        'pt-elhayek', 'ro-grigore', 'ru-abuadel', 'ru-kalam', 'ru-krachkovsky',
        'ru-kuliev-alsaadi', 'ru-kuliev', 'ru-muntahab', 'ru-osmanov', 'ru-porokhova',
        'ru-sablukov', 'sd-amroti', 'so-abduh', 'sq-ahmeti', 'sq-mehdiu', 'sq-nahi',
        'sv-bernstrom', 'sw-barwani', 'ta-tamil', 'tg-ayati', 'th-thai', 'tr-ates',
        'tr-bulac', 'tr-diyanet', 'tr-golpinarli', 'tr-ozturk', 'tr-transliteration',
        'tr-vakfi', 'tr-yazir', 'tr-yildirim', 'tr-yuksel', 'tt-nugman', 'ug-saleh',
        'ur-ahmedali', 'ur-jalandhry', 'ur-jawadi', 'ur-junagarhi', 'ur-kanzuliman',
        'ur-maududi', 'ur-najafi', 'ur-qadri', 'uz-sodik', 'zh-jian', 'zh-majian'
    ];

    // Render list function
    const renderList = (filter = '') => {
        grid.innerHTML = '';
        const filtered = editions.filter(ed => ed.toLowerCase().includes(filter.toLowerCase()));

        // Sort alphabetically
        filtered.sort();

        filtered.forEach(edition => {
            const tag = document.createElement('div');
            tag.className = 'edition-tag';

            const textSpan = document.createElement('span');
            textSpan.textContent = edition;
            tag.appendChild(textSpan);

            // SVG Icon
            const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            iconSvg.setAttribute("width", "18");
            iconSvg.setAttribute("height", "18");
            iconSvg.setAttribute("viewBox", "0 0 256 256");
            iconSvg.innerHTML = '<path fill="#888888" d="M216 34H88a6 6 0 0 0-6 6v42H40a6 6 0 0 0-6 6v128a6 6 0 0 0 6 6h128a6 6 0 0 0 6-6v-42h42a6 6 0 0 0 6-6V40a6 6 0 0 0-6-6m-54 176H46V94h116Zm48-48h-36V88a6 6 0 0 0-6-6H94V46h116Z"/>';

            tag.appendChild(iconSvg);

            // Optional: Copy to clipboard interaction or just visual
            tag.title = 'Click to copy ID';
            tag.addEventListener('click', () => {
                navigator.clipboard.writeText(edition).then(() => {
                    const originalText = textSpan.textContent;
                    textSpan.textContent = 'Copied!';
                    tag.style.borderColor = 'var(--accent-green)';
                    iconSvg.querySelector('path').setAttribute('fill', 'var(--accent-green)');
                    setTimeout(() => {
                        textSpan.textContent = originalText;
                        tag.style.borderColor = '';
                        iconSvg.querySelector('path').setAttribute('fill', '#888888');
                    }, 1000);
                });
            });

            grid.appendChild(tag);
        });
    };

    // Initial render
    renderList();

    // Event Listeners
    viewAllBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        renderList(e.target.value);
    });
}

// --- Quran App Logic ---

const QURAN_API_BASE = 'https://quran-api.damarcreative.my.id/api';

const quranState = {
    surahs: [],
    currentSurah: null,
    currentEdition: 'id-indonesian',
    showTranslation: true
};

async function initQuranApp() {
    // Check if we are on the Quran page
    const appContainer = document.getElementById('quran-app');
    if (!appContainer) return;

    const dom = {
        surahList: document.getElementById('surah-list-view'),
        readerView: document.getElementById('reader-view'),
        searchInput: document.getElementById('search-surah'),
        ayahContainer: document.getElementById('ayah-container'),
        toggleTranslation: document.getElementById('toggle-translation'),
        selectEdition: document.getElementById('select-edition'),
        btnBack: document.getElementById('btn-back'),
        currentSurahName: document.getElementById('current-surah-name'),
        currentSurahInfo: document.getElementById('current-surah-info'),
        btnPrev: document.getElementById('btn-prev-surah'),
        btnNext: document.getElementById('btn-next-surah')
    };

    try {
        const response = await fetch(`${QURAN_API_BASE}/surah`);
        const result = await response.json();
        // New API returns { status: "success", data: [...] }
        quranState.surahs = result.data || [];
        renderSurahList(quranState.surahs, dom);
        setupQuranEventListeners(dom);
    } catch (error) {
        console.error('Failed to init Quran App:', error);
        if (dom.surahList) {
            dom.surahList.innerHTML = '<p style="color:red">Failed to load Quran data. Please check connection.</p>';
        }
    }
}

function renderSurahList(surahs, dom) {
    if (!dom.surahList) return;
    dom.surahList.innerHTML = '';
    const template = document.getElementById('tpl-surah-card');
    if (!template) return;

    surahs.forEach(surah => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.resource-card');

        clone.querySelector('.surah-number').textContent = surah.number;
        clone.querySelector('.surah-verses').textContent = `${surah.total_ayahs} Ayahs`;
        clone.querySelector('.surah-name-en').textContent = surah.name;
        clone.querySelector('.surah-name-ar').textContent = surah.name_ar;
        clone.querySelector('.surah-type').textContent = surah.type;

        card.onclick = (e) => {
            e.preventDefault();
            loadSurah(surah.number, dom);
        };

        dom.surahList.appendChild(clone);
    });
    // Re-attach cursor events for new elements
    if (typeof attachCursorEvents === 'function') {
        attachCursorEvents(); // This might be defined elsewhere or we can reuse logic
        // Actually the attachCursorEvents in scripts.js is global for 'a, button...' but these are new elements.
        // Let's add specific logic or rely on a global observer/re-run.
        // scripts.js uses: document.querySelectorAll('a, button...').forEach...
        // We should probably run that again or delegate.
        // For now, let's just re-run the attaching logic if possible, or duplicate the specific attach for these cards.
        attachQuranCursorEvents(dom.surahList);
    }
}

async function loadSurah(number, dom) {
    dom.surahList.style.display = 'none';
    dom.readerView.style.display = 'block';
    dom.ayahContainer.innerHTML = '<div class="loader">Loading Surah...</div>';

    const meta = quranState.surahs.find(s => s.number === Number(number));
    if (meta) {
        dom.currentSurahName.textContent = meta.name;
        dom.currentSurahInfo.textContent = `${meta.name_ar} • ${meta.type} • ${meta.total_ayahs} Verses`;
        quranState.currentSurah = meta.number;

        dom.btnPrev.style.display = meta.number > 1 ? 'inline-block' : 'none';
        dom.btnNext.style.display = meta.number < 114 ? 'inline-block' : 'none';

        // Remove old listeners to avoid stacking (if any) - actually better to just update 'onclick'
        dom.btnPrev.onclick = () => loadSurah(meta.number - 1, dom);
        dom.btnNext.onclick = () => loadSurah(meta.number + 1, dom);
    }

    try {
        const [arabicRes, transRes] = await Promise.all([
            fetch(`${QURAN_API_BASE}/surah/${number}/arabic`),
            fetch(`${QURAN_API_BASE}/surah/${number}/${quranState.currentEdition}`)
        ]);

        const arabicJson = await arabicRes.json();
        const transJson = await transRes.json();

        // New API structure: { status: "success", data: { surah: X, ayahs: [...] } }
        const arabicAyahs = arabicJson.data.ayahs;
        const transAyahs = transJson.data.ayahs;

        renderAyahs(arabicAyahs, transAyahs, dom);
    } catch (error) {
        dom.ayahContainer.innerHTML = '<p class="error">Failed to load Surah text.</p>';
    }
}

function renderAyahs(arabicAyahs, transAyahs, dom) {
    dom.ayahContainer.innerHTML = '';

    arabicAyahs.forEach((ayah, index) => {
        const trans = transAyahs[index];
        const div = document.createElement('div');
        div.className = 'ayah-item';
        div.style.cssText = `
            padding: 2rem 0; 
            border-bottom: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        `;

        // Arabic
        const arabicDiv = document.createElement('div');
        arabicDiv.className = 'ayah-arabic';
        arabicDiv.textContent = ayah.uthmani || ayah.text;
        arabicDiv.style.cssText = `
            font-family: 'Amiri', serif;
            font-size: 2.2rem;
            text-align: right;
            color: var(--text-color);
            line-height: 2.2;
        `;

        // Number
        const numSpan = document.createElement('span');
        numSpan.className = 'ayah-number';
        numSpan.textContent = `${quranState.currentSurah}:${ayah.number}`;
        numSpan.style.cssText = `
            font-size: 0.8rem; 
            color: var(--accent-green); 
            font-weight: bold;
        `;

        div.appendChild(numSpan);
        div.appendChild(arabicDiv);

        // Translation
        if (quranState.showTranslation) {
            const transDiv = document.createElement('div');
            transDiv.className = 'ayah-translation';
            transDiv.textContent = trans ? trans.text : '';
            transDiv.style.cssText = `
                font-size: 1.1rem;
                color: var(--text-muted);
                line-height: 1.6;
            `;
            div.appendChild(transDiv);
        }

        dom.ayahContainer.appendChild(div);
    });
}

function setupQuranEventListeners(dom) {
    if (dom.searchInput) {
        dom.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = quranState.surahs.filter(s =>
                s.name.toLowerCase().includes(query) ||
                String(s.number).includes(query) ||
                s.name_ar.includes(query)
            );
            renderSurahList(filtered, dom);
        });
    }

    if (dom.btnBack) {
        dom.btnBack.addEventListener('click', () => {
            dom.readerView.style.display = 'none';
            dom.surahList.style.display = 'grid';
            window.scrollTo(0, 0);
        });
    }

    if (dom.toggleTranslation) {
        dom.toggleTranslation.addEventListener('change', (e) => {
            quranState.showTranslation = e.target.checked;
            if (quranState.currentSurah) {
                loadSurah(quranState.currentSurah, dom);
            }
        });
    }

    if (dom.selectEdition) {
        dom.selectEdition.addEventListener('change', (e) => {
            quranState.currentEdition = e.target.value;
            if (quranState.currentSurah) {
                loadSurah(quranState.currentSurah, dom);
            }
        });
    }
}

function attachQuranCursorEvents(container) {
    // Only attach to elements within the container to avoid global pollution if needed,
    // but the global logic works by `document.querySelectorAll`.
    // Here we just want to ensure the newly added elements get the effect.
    const cursorOutline = document.querySelector('.cursor-outline');
    if (!cursorOutline) return;

    const elements = container.querySelectorAll('a, button, input, select, .resource-card');
    elements.forEach(el => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = true;

        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            cursorOutline.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--text-color)';
        });
    });
}

