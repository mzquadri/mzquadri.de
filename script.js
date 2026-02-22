/* ============================================================
   MOHD ZAMIN QUADRI — PORTFOLIO SCRIPT v3 (FUTURISTIC)
   ============================================================ */

//  Loading Screen 
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1500);
});

//  Theme Toggle 
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);
themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateChartsTheme();
});

//  Nav Scroll 
const nav = document.getElementById('nav');
const readingBar = document.getElementById('readingProgress');
window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (readingBar) readingBar.style.width = (sy / docH * 100) + '%';
    nav.classList.toggle('scrolled', sy > 60);
    updateSectionState(sy);
});

//  Section Dots & Nav Active 
function updateSectionState(scrollY) {
    const allSections = document.querySelectorAll('section[id]');
    let active = '';
    allSections.forEach(s => {
        if (scrollY >= s.offsetTop - 140) active = s.getAttribute('id');
    });
    document.querySelectorAll('.sdot').forEach(d => {
        const href = d.getAttribute('href').slice(1);
        d.classList.toggle('active', href === active);
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href').slice(1);
        a.style.color = href === active ? 'var(--cyan)' : '';
    });
}
updateSectionState(0);

//  Mobile Nav 
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
});

//  Back to Top 
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 400);
});
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

//  Typing Effect 
const texts = [
    'AI Engineer',
    'Data Scientist',
    'MSc Mathematics — TU Munich',
    'Graph Neural Networks',
    'Machine Learning Engineer',
    'Deep Learning Enthusiast',
    'Uncertainty Quantification',
];
let ti = 0, ci = 0, deleting = false;
const typed = document.getElementById('typed');
function typeLoop() {
    if (!typed) return;
    const txt = texts[ti];
    if (!deleting) {
        typed.textContent = txt.slice(0, ++ci);
        if (ci === txt.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
    } else {
        typed.textContent = txt.slice(0, --ci);
        if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
    }
    setTimeout(typeLoop, deleting ? 35 : 70);
}
typeLoop();

//  Reveal Observer 
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

//  Hero Stat Counters 
function animateCounters(entries, obs) {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.target;
        let cur = 0;
        const step = Math.ceil(target / 40);
        const iv = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(iv); }
            el.textContent = cur;
        }, 40);
        obs.unobserve(el);
    });
}
const counterObs = new IntersectionObserver(animateCounters, { threshold: 0.5 });
document.querySelectorAll('.hstat-n').forEach(el => counterObs.observe(el));

//  Project Filters 
document.querySelectorAll('.pflt').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pflt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.f;
        document.querySelectorAll('.pcard').forEach(c => {
            const cats = c.dataset.cat || '';
            c.style.display = (f === 'all' || cats.includes(f)) ? '' : 'none';
        });
    });
});

//  Contact Form 
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    formMsg.textContent = ' Message sent! I will get back to you within 24h.';
    form.reset();
    setTimeout(() => formMsg.textContent = '', 5000);
});

//  Copy Email 
const copyBtn = document.getElementById('copyEmail');
if (copyBtn) copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('mohd.zamin@tum.de');
    const txt = document.getElementById('copyEmailTxt');
    txt.textContent = 'Copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => { txt.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
});

//  ENHANCED PARTICLES WITH WEB CONNECTIONS 
(function() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -1000, y: -1000 };
    const MAX_PARTICLES = 80;
    const CONNECTION_DIST = 150;

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function isDark() { return document.documentElement.getAttribute('data-theme') !== 'light'; }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.r = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
            // Slight mouse attraction
            const dx = mouse.x - this.x, dy = mouse.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 200) { this.vx += dx * 0.00005; this.vy += dy * 0.00005; }
        }
        draw() {
            const c = isDark() ? '0,238,255' : '0,112,210';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + c + ',' + this.alpha + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < MAX_PARTICLES; i++) particles.push(new Particle());

    function drawConnections() {
        const c = isDark() ? '0,238,255' : '0,112,210';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < CONNECTION_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(' + c + ',' + (0.12 * (1 - dist/CONNECTION_DIST)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            // Mouse connections
            const mdx = mouse.x - particles[i].x, mdy = mouse.y - particles[i].y;
            const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
            if (mdist < CONNECTION_DIST * 1.5) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = 'rgba(' + c + ',' + (0.2 * (1 - mdist/(CONNECTION_DIST*1.5))) + ')';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(loop);
    }
    loop();
})();

//  CHART.JS VISUALIZATIONS 
function isDark() { return document.documentElement.getAttribute('data-theme') !== 'light'; }
function tickC() { return isDark() ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'; }
function gridC() { return isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }

let radarChart, barChart, doughnutChart, polarChart, lineChart;

function createCharts() {
    // --- Radar Chart (existing) ---
    const radarEl = document.getElementById('radarChart');
    if (radarEl) {
        radarChart = new Chart(radarEl, {
            type: 'radar',
            data: {
                labels: ['Deep Learning', 'MLOps', 'Data Eng.', 'Mathematics', 'NLP / LLMs', 'Computer Vision'],
                datasets: [{
                    label: 'Competency',
                    data: [92, 78, 85, 95, 75, 82],
                    borderColor: '#00eeff',
                    backgroundColor: 'rgba(0,238,255,0.12)',
                    borderWidth: 2,
                    pointBackgroundColor: '#00eeff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                scales: { r: { beginAtZero: true, max: 100, ticks: { color: tickC(), stepSize: 20 }, grid: { color: gridC() }, pointLabels: { color: tickC(), font: { family: 'JetBrains Mono', size: 10 } } } },
                plugins: { legend: { display: false } }
            }
        });
    }

    // --- Bar Chart (existing) ---
    const barEl = document.getElementById('barChart');
    if (barEl) {
        barChart = new Chart(barEl, {
            type: 'bar',
            data: {
                labels: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Scikit-learn', 'Docker'],
                datasets: [{
                    label: 'Proficiency',
                    data: [95, 88, 85, 82, 90, 72],
                    backgroundColor: ['rgba(0,238,255,0.75)', 'rgba(0,238,255,0.65)', 'rgba(176,102,255,0.7)', 'rgba(0,232,122,0.7)', 'rgba(109,40,217,0.65)', 'rgba(219,39,119,0.6)'],
                    borderColor: ['#00eeff', '#00eeff', '#b266ff', '#00e87a', '#6d28d9', '#db2777'],
                    borderWidth: 1,
                    borderRadius: 6,
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                scales: { x: { max: 100, ticks: { color: tickC() }, grid: { color: gridC() } }, y: { ticks: { color: tickC(), font: { family: 'JetBrains Mono', size: 10 } }, grid: { display: false } } },
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.raw + '%' } } }
            }
        });
    }

    // --- Doughnut Chart ---
    const doughEl = document.getElementById('doughnutChart');
    if (doughEl) {
        doughnutChart = new Chart(doughEl, {
            type: 'doughnut',
            data: {
                labels: ['Python', 'R', 'SQL', 'VBA', 'MATLAB', 'C++', 'Bash'],
                datasets: [{
                    data: [40, 10, 18, 8, 8, 6, 10],
                    backgroundColor: ['rgba(0,238,255,0.8)', 'rgba(176,102,255,0.7)', 'rgba(0,232,122,0.7)', 'rgba(255,184,0,0.7)', 'rgba(255,45,170,0.6)', 'rgba(109,40,217,0.6)', 'rgba(219,39,119,0.5)'],
                    borderColor: 'transparent',
                    hoverOffset: 12,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                cutout: '60%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: tickC(), font: { family: 'JetBrains Mono', size: 10 }, padding: 12, usePointStyle: true, pointStyleWidth: 8 } },
                    tooltip: { callbacks: { label: c => c.label + ': ' + c.raw + '%' } }
                }
            }
        });
    }

    // --- Polar Chart ---
    const polarEl = document.getElementById('polarChart');
    if (polarEl) {
        polarChart = new Chart(polarEl, {
            type: 'polarArea',
            data: {
                labels: ['Healthcare AI', 'Transport', 'Insurance', 'Automotive', 'Research', 'Education'],
                datasets: [{
                    data: [90, 85, 80, 65, 88, 70],
                    backgroundColor: ['rgba(0,238,255,0.5)', 'rgba(176,102,255,0.5)', 'rgba(0,232,122,0.5)', 'rgba(255,184,0,0.5)', 'rgba(255,45,170,0.5)', 'rgba(109,40,217,0.4)'],
                    borderColor: 'transparent',
                }]
            },
            options: {
                responsive: true,
                scales: { r: { ticks: { color: tickC(), backdropColor: 'transparent' }, grid: { color: gridC() } } },
                plugins: {
                    legend: { position: 'bottom', labels: { color: tickC(), font: { family: 'JetBrains Mono', size: 10 }, padding: 10, usePointStyle: true, pointStyleWidth: 8 } }
                }
            }
        });
    }

    // --- Line Chart (Career Growth) ---
    const lineEl = document.getElementById('lineChart');
    if (lineEl) {
        const lineCtx = lineEl.getContext('2d');
        const grad1 = lineCtx.createLinearGradient(0, 0, 0, 250);
        grad1.addColorStop(0, 'rgba(0,238,255,0.25)');
        grad1.addColorStop(1, 'rgba(0,238,255,0)');
        const grad2 = lineCtx.createLinearGradient(0, 0, 0, 250);
        grad2.addColorStop(0, 'rgba(176,102,255,0.25)');
        grad2.addColorStop(1, 'rgba(176,102,255,0)');

        lineChart = new Chart(lineEl, {
            type: 'line',
            data: {
                labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
                datasets: [
                    { label: 'ML Skills', data: [10, 20, 35, 50, 62, 72, 80, 88, 93, 96], borderColor: '#00eeff', backgroundColor: grad1, fill: true, tension: 0.4, pointRadius: 4, pointHoverRadius: 7, pointBackgroundColor: '#00eeff' },
                    { label: 'Math Depth', data: [30, 40, 55, 65, 72, 78, 82, 86, 90, 94], borderColor: '#b266ff', backgroundColor: grad2, fill: true, tension: 0.4, pointRadius: 4, pointHoverRadius: 7, pointBackgroundColor: '#b266ff' },
                ]
            },
            options: {
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                scales: { x: { ticks: { color: tickC() }, grid: { color: gridC() } }, y: { max: 100, ticks: { color: tickC() }, grid: { color: gridC() } } },
                plugins: { legend: { labels: { color: tickC(), font: { family: 'JetBrains Mono', size: 11 }, usePointStyle: true } } }
            }
        });
    }
}
createCharts();

//  THEME UPDATE FOR ALL CHARTS 
function updateChartsTheme() {
    [radarChart, barChart, doughnutChart, polarChart, lineChart].forEach(c => {
        if (!c) return;
        if (c.config.type === 'radar') {
            c.options.scales.r.ticks.color = tickC();
            c.options.scales.r.grid.color = gridC();
            c.options.scales.r.pointLabels.color = tickC();
        }
        if (c.config.type === 'bar') {
            c.options.scales.x.ticks.color = tickC();
            c.options.scales.x.grid.color = gridC();
            c.options.scales.y.ticks.color = tickC();
        }
        if (c.config.type === 'doughnut' || c.config.type === 'polarArea') {
            c.options.plugins.legend.labels.color = tickC();
        }
        if (c.config.type === 'polarArea') {
            c.options.scales.r.ticks.color = tickC();
            c.options.scales.r.grid.color = gridC();
        }
        if (c.config.type === 'line') {
            c.options.scales.x.ticks.color = tickC();
            c.options.scales.x.grid.color = gridC();
            c.options.scales.y.ticks.color = tickC();
            c.options.scales.y.grid.color = gridC();
            c.options.plugins.legend.labels.color = tickC();
        }
        c.update();
    });
}

//  CONTRIBUTION HEATMAP 
(function() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;
    // Random realistic activity data (52 weeks x 7 days)
    const seed = [0,0,1,0,2,1,0,3,2,1,0,0,1,2,4,3,2,1,0,1,2,3,1,0,0,1,2,3,4,3,2,1,0,0,1,2];
    for (let i = 0; i < 364; i++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        // Generate weighted random activity
        const rand = Math.random();
        let level = 0;
        if (rand > 0.85) level = 4;
        else if (rand > 0.7) level = 3;
        else if (rand > 0.5) level = 2;
        else if (rand > 0.3) level = 1;
        cell.setAttribute('data-level', level);
        cell.title = level + ' contributions';
        grid.appendChild(cell);
    }
})();

//  CONFUSION MATRIX 
(function() {
    const container = document.getElementById('confusionMatrix');
    if (!container) return;
    const labels = ['Normal', 'Pneumonia', 'COVID'];
    const matrix = [
        [89, 4, 2],
        [3, 92, 3],
        [2, 5, 95]
    ];
    // Header row
    const spacer = document.createElement('div');
    spacer.className = 'cm-header';
    spacer.textContent = '';
    container.appendChild(spacer);
    labels.forEach(l => {
        const h = document.createElement('div');
        h.className = 'cm-header';
        h.textContent = l;
        container.appendChild(h);
    });
    // Data rows
    matrix.forEach((row, ri) => {
        const label = document.createElement('div');
        label.className = 'cm-label';
        label.textContent = labels[ri];
        container.appendChild(label);
        row.forEach((val, ci) => {
            const cell = document.createElement('div');
            cell.className = 'cm-cell';
            cell.textContent = val + '%';
            const intensity = val / 100;
            if (ri === ci) {
                cell.style.background = 'rgba(0,238,255,' + (intensity * 0.6) + ')';
                cell.style.color = intensity > 0.5 ? '#fff' : 'var(--txt)';
                cell.style.border = '1px solid rgba(0,238,255,0.3)';
            } else {
                cell.style.background = 'rgba(255,45,170,' + (intensity * 0.5) + ')';
                cell.style.color = intensity > 0.3 ? '#fff' : 'var(--txt2)';
                cell.style.border = '1px solid rgba(255,45,170,0.15)';
            }
            container.appendChild(cell);
        });
    });
})();

//  DASHBOARD METRIC COUNTERS 
function animateDashCounters(entries, obs) {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        let cur = 0;
        const dur = 1500;
        const start = performance.now();
        function tick(now) {
            const prog = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - prog, 3);
            cur = Math.round(eased * target);
            el.textContent = cur;
            if (prog < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
    });
}
const dashObs = new IntersectionObserver(animateDashCounters, { threshold: 0.5 });
document.querySelectorAll('.metric-value[data-count]').forEach(el => dashObs.observe(el));

//  LOSS CURVE SVG ANIMATION 
const lossCurveObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const svg = document.getElementById('lossCurve');
        if (!svg) return;
        // Animate stroke draw
        svg.querySelectorAll('.loss-train-line, .loss-val-line').forEach(path => {
            const len = path.getTotalLength();
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            path.style.transition = 'stroke-dashoffset 2s ease-in-out';
            setTimeout(() => { path.style.strokeDashoffset = '0'; }, 100);
        });
        // Fade in fill areas
        svg.querySelectorAll('.loss-train-area, .loss-val-area').forEach(area => {
            area.style.transition = 'opacity 1.5s ease-in-out 0.8s';
            area.style.opacity = '0.6';
        });
        lossCurveObs.unobserve(e.target);
    });
}, { threshold: 0.3 });
const lossCurveEl = document.getElementById('lossCurve');
if (lossCurveEl) lossCurveObs.observe(lossCurveEl.closest('.analytics-card') || lossCurveEl);

//  3D CARD TILT (MAGNETIC CURSOR) 
document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

//  ANIMATE SKILL BARS ON SCROLL 
const skillBarObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width;
        });
        skillBarObs.unobserve(e.target);
    });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-progress').forEach(el => skillBarObs.observe(el));

console.log(' Portfolio v3 — Futuristic Mode Active');

//  SHAP FEATURE IMPORTANCE (SIMULATED BAR CHART) 
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'shapChart';
    canvas.width = 400; canvas.height = 220;
    // Find the confusion matrix card and insert after it
    const confCard = document.getElementById('confusionMatrix');
    if (!confCard) return;
    const parentCard = confCard.closest('.analytics-card');
    if (!parentCard) return;
    // Create a new sibling card
    const shapCard = document.createElement('div');
    shapCard.className = 'analytics-card reveal visible';
    shapCard.innerHTML = '<h4><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg> SHAP Feature Importance</h4>';
    shapCard.appendChild(canvas);
    parentCard.parentElement.insertBefore(shapCard, parentCard.nextSibling);

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Age', 'Vehicle Power', 'Claim History', 'Region', 'Policy Duration', 'Exposure', 'Bonus/Malus', 'Deductible'],
            datasets: [{
                label: 'SHAP Value (impact)',
                data: [0.42, 0.35, 0.31, 0.28, 0.22, 0.18, 0.15, 0.11],
                backgroundColor: [
                    'rgba(0,238,255,0.75)', 'rgba(0,238,255,0.65)', 'rgba(176,102,255,0.7)',
                    'rgba(176,102,255,0.6)', 'rgba(0,232,122,0.6)', 'rgba(255,184,0,0.55)',
                    'rgba(255,45,170,0.5)', 'rgba(109,40,217,0.45)'
                ],
                borderColor: [
                    '#00eeff', '#00eeff', '#b266ff', '#b266ff', '#00e87a', '#ffb800', '#ff2daa', '#6d28d9'
                ],
                borderWidth: 1,
                borderRadius: 4,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: { ticks: { color: tickC() }, grid: { color: gridC() }, title: { display: true, text: '|SHAP value|', color: tickC(), font: { family: 'JetBrains Mono', size: 10 } } },
                y: { ticks: { color: tickC(), font: { family: 'JetBrains Mono', size: 9 } }, grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
})();

//  SCATTER CHART — PROJECT COMPLEXITY VS IMPACT 
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'scatterChart';
    canvas.width = 400; canvas.height = 220;
    // Insert after heatmap
    const heatmapCard = document.getElementById('heatmapGrid');
    if (!heatmapCard) return;
    const parentCard = heatmapCard.closest('.analytics-card');
    if (!parentCard) return;
    const scatterCard = document.createElement('div');
    scatterCard.className = 'analytics-card analytics-full reveal visible';
    scatterCard.innerHTML = '<h4><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="7.5" r="2.5"/><circle cx="7.5" cy="16.5" r="2.5"/></svg> Project Complexity vs. Business Impact</h4>';
    scatterCard.appendChild(canvas);
    parentCard.parentElement.appendChild(scatterCard);

    new Chart(canvas, {
        type: 'bubble',
        data: {
            datasets: [
                { label: 'AI Radiologist', data: [{ x: 85, y: 92, r: 16 }], backgroundColor: 'rgba(0,238,255,0.6)', borderColor: '#00eeff' },
                { label: 'GNN Transport', data: [{ x: 95, y: 88, r: 18 }], backgroundColor: 'rgba(176,102,255,0.6)', borderColor: '#b266ff' },
                { label: 'Insurance Pipeline', data: [{ x: 70, y: 85, r: 14 }], backgroundColor: 'rgba(0,232,122,0.6)', borderColor: '#00e87a' },
                { label: 'BERT NLP', data: [{ x: 65, y: 78, r: 12 }], backgroundColor: 'rgba(255,45,170,0.6)', borderColor: '#ff2daa' },
                { label: 'RAG Pipeline', data: [{ x: 75, y: 82, r: 13 }], backgroundColor: 'rgba(255,184,0,0.6)', borderColor: '#ffb800' },
                { label: 'RL Route Opt', data: [{ x: 80, y: 75, r: 11 }], backgroundColor: 'rgba(109,40,217,0.6)', borderColor: '#6d28d9' },
                { label: 'cGAN Aug.', data: [{ x: 60, y: 65, r: 9 }], backgroundColor: 'rgba(255,100,100,0.5)', borderColor: '#ff6464' },
                { label: 'Bayesian HPO', data: [{ x: 50, y: 70, r: 8 }], backgroundColor: 'rgba(100,200,255,0.5)', borderColor: '#64c8ff' },
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { min: 30, max: 100, title: { display: true, text: 'Technical Complexity', color: tickC(), font: { family: 'JetBrains Mono', size: 10 } }, ticks: { color: tickC() }, grid: { color: gridC() } },
                y: { min: 40, max: 100, title: { display: true, text: 'Business Impact', color: tickC(), font: { family: 'JetBrains Mono', size: 10 } }, ticks: { color: tickC() }, grid: { color: gridC() } }
            },
            plugins: {
                legend: { position: 'bottom', labels: { color: tickC(), font: { family: 'JetBrains Mono', size: 9 }, usePointStyle: true, pointStyleWidth: 8, padding: 10 } },
                tooltip: { callbacks: { label: c => c.dataset.label + ' (r=' + c.raw.r + ')' } }
            }
        }
    });
})();

//  ANIMATED NEURAL NETWORK CANVAS 
(function() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;
    const nnCanvas = document.createElement('canvas');
    nnCanvas.id = 'neuralNetCanvas';
    nnCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.15;z-index:0;';
    heroVisual.style.position = 'relative';
    heroVisual.appendChild(nnCanvas);
    
    const ctx = nnCanvas.getContext('2d');
    const layers = [4, 6, 8, 6, 3];
    let W, H;
    
    function resize() {
        W = nnCanvas.width = heroVisual.offsetWidth;
        H = nnCanvas.height = heroVisual.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let phase = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        phase += 0.02;
        const layerSpacing = W / (layers.length + 1);
        const positions = [];
        
        layers.forEach((count, li) => {
            const x = layerSpacing * (li + 1);
            const nodeSpacing = H / (count + 1);
            const nodes = [];
            for (let i = 0; i < count; i++) {
                const y = nodeSpacing * (i + 1);
                nodes.push({ x, y });
            }
            positions.push(nodes);
        });
        
        // Draw connections
        for (let l = 0; l < positions.length - 1; l++) {
            for (let i = 0; i < positions[l].length; i++) {
                for (let j = 0; j < positions[l+1].length; j++) {
                    const from = positions[l][i];
                    const to = positions[l+1][j];
                    const pulse = Math.sin(phase + l * 0.5 + i * 0.3 + j * 0.2) * 0.5 + 0.5;
                    ctx.beginPath();
                    ctx.moveTo(from.x, from.y);
                    ctx.lineTo(to.x, to.y);
                    ctx.strokeStyle = 'rgba(0,238,255,' + (0.05 + pulse * 0.15) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        positions.forEach((layer, li) => {
            layer.forEach((node, ni) => {
                const pulse = Math.sin(phase + li + ni * 0.5) * 0.5 + 0.5;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 3 + pulse * 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,238,255,' + (0.3 + pulse * 0.5) + ')';
                ctx.fill();
            });
        });
        
        requestAnimationFrame(draw);
    }
    draw();
})();
