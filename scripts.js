function updateClock() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wibOffset = 7 * 60 * 60000;
    const wibTime = new Date(utc + wibOffset);
    let hours = wibTime.getHours();
    const minutes = wibTime.getMinutes().toString().padStart(2, '0');
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes} WIB`;
    }
}
setInterval(updateClock, 1000);
updateClock();

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

    const smileyPath = `M50,97.5c-26.1915607,0-47.5-21.3084412-47.5-47.5S23.8084393,2.5,50,2.5S97.5,23.8084393,97.5,50S76.1915588,97.5,50,97.5z M50,7.0238094C26.3030148,7.0238094,7.0238104,26.3030128,7.0238104,50S26.3030148,92.9761887,50,92.9761887S92.9761887,73.6969833,92.9761887,50S73.6969833,7.0238094,50,7.0238094z`;
    const eyesPath = `<ellipse cx="35.2381935" cy="34.3672791" rx="4.7493854" ry="6.5021348"></ellipse><ellipse cx="64.7618027" cy="34.3672791" rx="4.7493854" ry="6.5021348"></ellipse>`;
    const smilePath = `M50,80.4100494c-14.6896172,0-26.6402111-11.4621811-26.6402111-25.5509796c0-1.2492523,1.0131454-2.2619057,2.2619038-2.2619057c1.2487602,0,2.2619057,1.0126534,2.2619057,2.2619057c0,11.594223,9.9213562,21.0271759,22.1164017,21.0271759s22.1164017-9.4329529,22.1164017-21.0271759c0-1.2492523,1.0131454-2.2619057,2.2619019-2.2619057c1.248764,0,2.2619095,1.0126534,2.2619095,2.2619057C76.640213,68.9478683,64.689621,80.4100494,50,80.4100494z`;

    const smiley = `<svg class="smiley-icon" viewBox="0 0 100 100"><path d="${smileyPath}"></path>${eyesPath}<path d="${smilePath}"></path></svg>`;

    const items = [
        { text: 'UIX Designer', hoverColor: 'var(--accent-green)' },
        { text: 'Front-End Dev', hoverColor: '#a855f7' },
        { text: 'Researcher', hoverColor: '#3b82f6' }
    ];

    let marqueeHTML = '<div class="marquee-container mb-8 cursor-default select-none"><div class="marquee-content">';

    const marqueeItems = [...items, ...items];

    marqueeItems.forEach(item => {
        marqueeHTML += `<span class="marquee-text text-[8vw] leading-none font-medium tracking-tighter mr-10 transition-colors duration-500 inline-flex items-center gap-4" style="--hover-color: ${item.hoverColor}" onmouseenter="this.style.color='${item.hoverColor}'" onmouseleave="this.style.color=''">${smiley}${item.text}</span>`;
    });
    marqueeHTML += '</div></div>';

    marqueeHTML += `
    <div class="footer-bottom">
      <div>
        <p>Thoughtful UI. Powerful Code.</p>
      </div>
       <div>
        <p>© 2026 Damar Jati. All rights reserved.</p>
      </div>
      <div class="footer-right">
        <p>Grobogan, Central Java - Indonesia</p>
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
    renderProjects();
    renderExperience();
    renderEducation();
    renderAbout();
    renderResources();
});

