/* ====================================================
   G.M. NISAL MUHANDIRAM — app.js  (Enhanced v2)
   ==================================================== */

const LOGIN_PASS = '0715864863';
const EDIT_PASS = '0715157912';

let isEditMode = false;
let selectedColor = '#00b4d8';
let currentFilter = 'all';
let galleryData = JSON.parse(localStorage.getItem('nm_gallery') || '[]');
let notesData = JSON.parse(localStorage.getItem('nm_notes') || '[]');
let lbIndex = -1;   // lightbox index in galleryData
let lbItems = [];   // current lightbox-able items

// ============================
// LOADER → LOGIN
// ============================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.6s ease';
        setTimeout(() => {
            loader.style.display = 'none';
            document.getElementById('loginScreen').classList.remove('site-hidden');
            initLoginCanvas();
        }, 600);
    }, 1800);
});

// LOGIN CANVAS PARTICLES
function initLoginCanvas() {
    const canvas = document.getElementById('loginCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const dots = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        a: Math.random()
    }));
    function drawLogin() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dots.forEach(d => {
            d.x += d.dx; d.y += d.dy;
            if (d.x < 0 || d.x > canvas.width) d.dx *= -1;
            if (d.y < 0 || d.y > canvas.height) d.dy *= -1;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,180,216,${d.a * 0.5})`;
            ctx.fill();
        });
        // Draw connecting lines
        dots.forEach((d, i) => {
            dots.slice(i + 1).forEach(d2 => {
                const dist = Math.hypot(d.x - d2.x, d.y - d2.y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(d.x, d.y); ctx.lineTo(d2.x, d2.y);
                    ctx.strokeStyle = `rgba(0,180,216,${0.15 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(drawLogin);
    }
    drawLogin();
}

// ============================
// LOGIN
// ============================
function attemptLogin() {
    const val = document.getElementById('loginInput').value.trim();
    if (val === LOGIN_PASS) {
        const ls = document.getElementById('loginScreen');
        ls.style.opacity = '0';
        ls.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            ls.classList.add('site-hidden');
            document.getElementById('mainSite').classList.remove('site-hidden');
            initSite();
        }, 500);
    } else {
        shake('loginInput');
        showErr('loginError', '❌ Wrong password. Try again.');
    }
}
document.getElementById('loginInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') attemptLogin();
});

// ============================
// INIT SITE
// ============================
function initSite() {
    restoreTexts();
    renderGallery();
    renderNotes();
    setupParticles();
    setupCursor();
    setupScrollProgress();
    setupScrollReveal();
    setupNavScroll();
    setupBackTop();
    setupTilt();
    startTypewriter();
    setupCounters();
}

// ============================
// PARTICLES (hero bg)
// ============================
function setupParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
    const pts = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.5 + 0.1
    }));
    function draw() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,180,216,${p.a})`;
            ctx.fill();
        });
        pts.forEach((p, i) => {
            pts.slice(i + 1).forEach(p2 => {
                const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (d < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0,180,216,${0.1 * (1 - d / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ============================
// CUSTOM CURSOR
// ============================
function setupCursor() {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    let tx = 0, ty = 0;
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        tx = e.clientX; ty = e.clientY;
    });
    // Smooth trail
    function animateTrail() {
        const cx = parseFloat(trail.style.left || 0);
        const cy = parseFloat(trail.style.top || 0);
        trail.style.left = cx + (tx - cx) * 0.12 + 'px';
        trail.style.top = cy + (ty - cy) * 0.12 + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
    // Grow cursor on interactive elements
    document.querySelectorAll('a,button,label,.tilt-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '28px';
            cursor.style.height = '28px';
            trail.style.width = '56px';
            trail.style.height = '56px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '16px';
            cursor.style.height = '16px';
            trail.style.width = '40px';
            trail.style.height = '40px';
        });
    });
}

// ============================
// SCROLL PROGRESS BAR
// ============================
function setupScrollProgress() {
    const bar = document.getElementById('scrollBar');
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
    });
}

// ============================
// SCROLL REVEAL
// ============================
function setupScrollReveal() {
    window.observerInstance = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal-left,.reveal-right,.reveal-up').forEach(el => window.observerInstance.observe(el));
    // Skill bar animation on enter
    const skillObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const bar = e.target.querySelector('.skill-bar');
                if (bar) {
                    const w = bar.style.getPropertyValue('--w');
                    bar.style.width = '0';
                    setTimeout(() => { bar.style.width = w; }, 150);
                    skillObs.unobserve(e.target);
                }
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-card').forEach(c => skillObs.observe(c));
}

// ============================
// COUNTER ANIMATION
// ============================
function setupCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = parseInt(el.dataset.target);
                const dur = 1600;
                const step = Math.ceil(dur / target);
                let current = 0;
                const timer = setInterval(() => {
                    current += Math.ceil(target / 60);
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = current;
                }, dur / 60);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
}

// ============================
// NAVBAR SCROLL
// ============================
function setupNavScroll() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        nav.style.background = window.scrollY > 60
            ? 'rgba(11,14,26,0.98)' : 'rgba(11,14,26,0.85)';
    });
}

function setActive(el) {
    document.querySelectorAll('.nav-a').forEach(a => a.classList.remove('active'));
    el.classList.add('active');
}

function toggleMobile() {
    document.getElementById('navLinks').classList.toggle('mobile-open');
}

// ============================
// BACK TO TOP
// ============================
function setupBackTop() {
    const btn = document.getElementById('backTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('site-hidden', window.scrollY < 400);
    });
}

// ============================
// 3D TILT (mouse tilt on cards)
// ============================
function setupTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / rect.height) * 10;
            const tiltY = -(x / rect.width) * 10;
            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ============================
// TYPEWRITER
// ============================
const roles = ['University Student 🎓', 'Web Developer 💻', 'Creative Thinker 🎨', 'Future Leader 🚀', 'Innovator ⚡'];
let ri = 0, ci = 0, deleting = false;
const twEl = document.getElementById('typewriterEl');
function startTypewriter() { if (twEl) typeStep(); }
function typeStep() {
    const word = roles[ri];
    twEl.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    if (!deleting && ci > word.length) { deleting = true; setTimeout(typeStep, 2000); return; }
    if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    setTimeout(typeStep, deleting ? 50 : 85);
}

// ============================
// EDIT MODE
// ============================
function toggleEditMode() {
    if (isEditMode) { exitEditMode(); return; }
    document.getElementById('editModal').classList.remove('site-hidden');
    setTimeout(() => document.getElementById('editPassIn').focus(), 120);
}
function verifyEdit() {
    const v = document.getElementById('editPassIn').value.trim();
    if (v === EDIT_PASS) { closeEditModal(); enableEdit(); }
    else { showErr('editErr', '❌ Wrong admin password.'); shake('editPassIn'); }
}
document.getElementById('editPassIn').addEventListener('keydown', e => { if (e.key === 'Enter') verifyEdit(); });
function closeEditModal() {
    document.getElementById('editModal').classList.add('site-hidden');
    document.getElementById('editPassIn').value = '';
    document.getElementById('editErr').textContent = '';
}
function enableEdit() {
    isEditMode = true;
    document.body.classList.add('edit-mode');
    document.getElementById('editBanner').classList.remove('site-hidden');
    document.getElementById('editBtn').textContent = '🔒 Exit Edit';
    document.querySelectorAll('.editable').forEach(el => { el.contentEditable = 'true'; });
}
function exitEditMode() {
    isEditMode = false;
    document.body.classList.remove('edit-mode');
    document.getElementById('editBanner').classList.add('site-hidden');
    document.getElementById('editBtn').textContent = '✏️ Edit Mode';
    document.querySelectorAll('.editable').forEach(el => { el.contentEditable = 'false'; });
}
function saveEdits() {
    const saved = {};
    document.querySelectorAll('[data-key]').forEach(el => { saved[el.dataset.key] = el.innerHTML; });
    localStorage.setItem('nm_texts', JSON.stringify(saved));
    showToast('✅ Changes saved!');
    exitEditMode();
}
function restoreTexts() {
    const saved = JSON.parse(localStorage.getItem('nm_texts') || '{}');
    Object.keys(saved).forEach(k => {
        const el = document.querySelector(`[data-key="${k}"]`);
        if (el) el.innerHTML = saved[k];
    });
}

// ============================
// GALLERY
// ============================
function getFileType(file) {
    if (file.type.startsWith('video')) return 'videos';
    if (file.type.startsWith('audio')) return 'songs';
    return 'photos';
}

function handleUpload(ev) {
    const files = Array.from(ev.target.files);
    let loaded = 0;
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            // Use string ID to avoid float precision issues
            const id = String(Date.now()) + '_' + String(Math.floor(Math.random() * 1e6));
            galleryData.push({
                id,
                src: e.target.result,
                type: getFileType(file),
                name: file.name
            });
            loaded++;
            // Only re-render after ALL files are loaded to avoid duplicates
            if (loaded === files.length) {
                localStorage.setItem('nm_gallery', JSON.stringify(galleryData));
                renderGallery();
                showToast(`✅ ${loaded} file(s) uploaded!`);
            }
        };
        reader.readAsDataURL(file);
    });
    ev.target.value = '';
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    // Use stable ID to identify default item — never lose or duplicate it
    const defItem = document.getElementById('defaultGalleryItem');
    grid.innerHTML = '';
    if (defItem) {
        grid.appendChild(defItem);
        defItem.style.display = (currentFilter === 'all' || currentFilter === 'photos') ? '' : 'none';
    }

    lbItems = (currentFilter === 'all' || currentFilter === 'photos')
        ? [{ src: 'nisal.jpg', type: 'image' }] : [];

    galleryData.forEach(itm => {
        if (currentFilter !== 'all' && itm.type !== currentFilter) return;

        // Only push to lightbox if viewable (not audio)
        if (itm.type !== 'songs') {
            lbItems.push({ src: itm.src, type: itm.type === 'videos' ? 'video' : 'image', id: itm.id });
        }

        const div = document.createElement('div');
        div.className = 'g-item reveal-up'; // Re-add reveal-up for animations
        div.dataset.id = itm.id;
        div.dataset.type = itm.type;

        let mediaHTML;
        if (itm.type === 'videos') {
            mediaHTML = `<video src="${itm.src}" muted loop></video>`;
        } else if (itm.type === 'songs') {
            // Audio card — no lightbox expand button
            mediaHTML = `
                <div class="audio-card-inner">
                    <div class="audio-icon"><i class="fas fa-music"></i></div>
                    <p class="audio-name">${esc(itm.name || 'Audio')}</p>
                    <audio controls src="${itm.src}"></audio>
                </div>`;
        } else {
            mediaHTML = `<img src="${itm.src}" alt=""/>`;
        }

        // For songs, we make the overlay "passive" or different so it doesn't block controls
        const overlayClass = itm.type === 'songs' ? 'g-overlay g-overlay-song' : 'g-overlay';
        const expandBtn = itm.type !== 'songs'
            ? `<button onclick="openLightboxById('${itm.id}')"><i class="fas fa-expand"></i></button>`
            : '';

        div.innerHTML = `${mediaHTML}
            <div class="${overlayClass}">
                ${expandBtn}
                <button class="g-del" onclick="delItem(this,'${itm.id}')"><i class="fas fa-trash"></i></button>
            </div>`;
        grid.appendChild(div);
        // Trigger intersection observer if it was already set up
        if (window.observerInstance) window.observerInstance.observe(div);
    });
}

function filterGallery(type, btn) {
    currentFilter = type;
    document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery();
}

function delItem(btn, id) {
    if (id) {
        galleryData = galleryData.filter(i => String(i.id) !== String(id));
        localStorage.setItem('nm_gallery', JSON.stringify(galleryData));
    }
    const item = btn.closest('.g-item');
    item.style.transition = 'opacity 0.3s, transform 0.3s';
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    setTimeout(() => { item.remove(); renderGallery(); }, 300);
}

function openLightbox(src, type) {
    lbIndex = 0;
    showLB(src, type);
}

function openLightboxById(id) {
    const idx = lbItems.findIndex(i => i.id && String(i.id) === String(id));
    lbIndex = idx >= 0 ? idx : 0;
    const itm = lbItems[lbIndex];
    if (itm) showLB(itm.src, itm.type);
}

function showLB(src, type) {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('site-hidden');
    document.body.style.overflow = 'hidden';
    const c = document.getElementById('lbContent');
    c.style.opacity = '0';
    setTimeout(() => {
        c.innerHTML = type === 'video'
            ? `<video src="${src}" controls autoplay></video>`
            : `<img src="${src}" alt=""/>`;
        c.style.opacity = '1';
        c.style.transition = 'opacity 0.3s ease';
    }, 100);
}

function lbNav(dir) {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    const itm = lbItems[lbIndex];
    showLB(itm.src, itm.type);
}

function closeLB() {
    document.getElementById('lightbox').classList.add('site-hidden');
    document.body.style.overflow = '';
    document.getElementById('lbContent').innerHTML = '';
}

document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('site-hidden')) {
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowRight') lbNav(1);
        if (e.key === 'ArrowLeft') lbNav(-1);
    }
});

// ============================
// NOTES
// ============================
function pickColor(color, btn) {
    selectedColor = color;
    document.querySelectorAll('.nc').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function addNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    if (!content) { shake('noteContent'); return; }
    notesData.unshift({
        id: Date.now(), title: title || 'Note', content,
        color: selectedColor,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    });
    localStorage.setItem('nm_notes', JSON.stringify(notesData));
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    renderNotes();
}

function renderNotes() {
    const board = document.getElementById('notesBoard');
    board.innerHTML = '';
    if (!notesData.length) { board.innerHTML = '<p class="no-notes">No notes yet. Add one! 📝</p>'; return; }
    notesData.forEach(n => {
        const r = parseInt(n.color.slice(1, 3), 16),
            g = parseInt(n.color.slice(3, 5), 16),
            b = parseInt(n.color.slice(5, 7), 16);
        const div = document.createElement('div');
        div.className = 'note-card';
        div.style.background = `rgba(${r},${g},${b},0.12)`;
        div.style.borderColor = `rgba(${r},${g},${b},0.4)`;
        div.innerHTML = `
      <button class="n-del" onclick="delNote(${n.id})">✖</button>
      <div class="note-card-title" style="color:${n.color}">${esc(n.title)}</div>
      <div class="note-card-body">${esc(n.content)}</div>
      <div class="note-card-date">${n.date}</div>`;
        board.appendChild(div);
    });
}

function delNote(id) {
    notesData = notesData.filter(n => n.id !== id);
    localStorage.setItem('nm_notes', JSON.stringify(notesData));
    renderNotes();
}

// ============================
// CONTACT FORM
// ============================
function submitForm(e) {
    e.preventDefault();
    const ok = document.getElementById('formOk');
    ok.classList.remove('site-hidden');
    e.target.reset();
    setTimeout(() => ok.classList.add('site-hidden'), 5000);
}

// ============================
// COPY
// ============================
function copyText(txt) {
    navigator.clipboard.writeText(txt).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    });
    showToast('✅ Copied: ' + txt);
}

// ============================
// TOAST
// ============================
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('site-hidden');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.add('site-hidden'), 2800);
}

// ============================
// UTILS
// ============================
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function showErr(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    setTimeout(() => { el.textContent = ''; }, 2600);
}
function shake(id) {
    const el = document.getElementById(id);
    el.style.animation = 'none';
    el.getBoundingClientRect(); // reflow
    const anim = document.createElement('style');
    anim.textContent = `@keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`;
    document.head.appendChild(anim);
    el.style.animation = 'shk 0.4s ease';
    el.style.borderColor = '#e63946';
    setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; anim.remove(); }, 500);
}

/* ============================
// MY PRODUCT: TRANSLATOR
// ============================ */

const transInput = document.getElementById('transInput');
const transOutput = document.getElementById('transOutput');
const translatorLoading = document.getElementById('translatorLoading');
const transProgress = document.getElementById('transProgress');
const dropZone = document.getElementById('dropZone');
const copyTransBtn = document.getElementById('copyTransBtn');

// Drag & Drop Setup
if (dropZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); }, false);
    });
    dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
    ['dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover')));
    dropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files.length) handleTransUpload({ target: { files } });
    });
}

async function handleTransUpload(ev) {
    const file = ev.target.files[0];
    if (!file) return;

    showLoading(true, 'Extracting text...');
    let text = '';

    try {
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'pdf') {
            text = await extractPDFText(file);
        } else if (ext === 'docx') {
            text = await extractWordText(file);
        } else if (ext === 'pptx') {
            text = await extractPPTText(file);
        } else {
            showToast(' Unsupported file type.');
            showLoading(false);
            return;
        }

        transInput.value = text;
        showToast(' Text extracted successfully!');
    } catch (err) {
        console.error(err);
        showToast(' Failed to extract text.');
    } finally {
        showLoading(false);
    }
}

// PDF Extraction
async function extractPDFText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + '\n';
        transProgress.textContent = Math.round((i / pdf.numPages) * 100) + '%';
    }
    return fullText;
}

// Word Extraction
async function extractWordText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

// PPT Extraction
async function extractPPTText(file) {
    const zip = await JSZip.loadAsync(file);
    let fullText = '';
    const slideFiles = Object.keys(zip.files).filter(f => f.startsWith('ppt/slides/slide') && f.endsWith('.xml'));

    for (let i = 0; i < slideFiles.length; i++) {
        const content = await zip.file(slideFiles[i]).async('text');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        const textNodes = xmlDoc.getElementsByTagName('a:t');
        for (let node of textNodes) fullText += node.textContent + ' ';
        fullText += '\n';
        transProgress.textContent = Math.round(((i + 1) / slideFiles.length) * 100) + '%';
    }
    return fullText;
}

// Translation Logic
async function performTranslation() {
    const text = transInput.value.trim();
    const src = document.getElementById('srcLang').value;
    const target = document.getElementById('targetLang').value;

    if (!text) { shake('transInput'); return; }

    showLoading(true, 'Translating...');

    try {
        // Split text into chunks for API (max 500 chars for MyMemory free tier per req)
        const chunks = text.match(/.{1,500}/g) || [];
        const results = [];

        for (let i = 0; i < chunks.length; i++) {
            // Added 'de' parameter with user email to increase daily quota from 5k to 50k chars
            const email = "nisalmuhandiram2004@gmail.com";
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunks[i])}&langpair=${src}|${target}&de=${email}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.responseStatus !== 200) {
                transOutput.textContent = `❌ API Error: ${data.responseDetails || "Invalid response"}`;
                showLoading(false);
                return;
            }

            if (data.responseData) results.push(data.responseData.translatedText);
            transProgress.textContent = Math.round(((i + 1) / chunks.length) * 100) + '%';
        }

        transOutput.textContent = results.join(' ');
        copyTransBtn.classList.remove('site-hidden');
        showToast('✅ Translation complete!');
    } catch (err) {
        console.error(err);
        showToast('❌ Translation failed.');
    } finally {
        showLoading(false);
    }
}

function showLoading(show, text = 'Processing...') {
    if (show) {
        translatorLoading.classList.remove('site-hidden');
        translatorLoading.querySelector('p').firstChild.textContent = text + ' ';
        transProgress.textContent = '0%';
    } else {
        translatorLoading.classList.add('site-hidden');
    }
}

function clearTranslator() {
    transInput.value = '';
    transOutput.textContent = 'Translation will appear here...';
    copyTransBtn.classList.add('site-hidden');
    document.getElementById('transFileUpload').value = '';
}

function copyTransOutput() {
    copyText(transOutput.textContent);
}
/* ============================
// MY PRODUCT: DOCUMENT CONVERTER
// ============================ */

if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const convDropZone = document.getElementById('convDropZone');
const convFileInfo = document.getElementById('convFileInfo');
const convResultArea = document.getElementById('convResultArea');
const downloadConvBtn = document.getElementById('downloadConvBtn');
const converterLoading = document.getElementById('converterLoading');
const convProgress = document.getElementById('convProgress');
const convStatusText = document.getElementById('convStatusText');

let convertedBlob = null;
let convertedFileName = "";

if (convDropZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        convDropZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); }, false);
    });
    convDropZone.addEventListener('dragover', () => convDropZone.classList.add('dragover'));
    ['dragleave', 'drop'].forEach(evt => convDropZone.addEventListener(evt, () => convDropZone.classList.remove('dragover')));
    convDropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files.length) handleConvUpload({ target: { files } });
    });
}

async function handleConvUpload(ev) {
    const file = ev.target.files[0];
    if (!file) return;

    convResultArea.classList.add('site-hidden');
    convertedBlob = null;

    const ext = file.name.split('.').pop().toLowerCase();

    try {
        if (ext === 'pdf') {
            if (typeof pdfjsLib === 'undefined') throw new Error("PDF library not loaded");
            await convertPDFtoWord(file);
        } else if (ext === 'docx' || ext === 'doc') {
            if (typeof mammoth === 'undefined') throw new Error("Word library not loaded");
            await convertWordtoPDF(file);
        } else {
            showToast('❌ Unsupported format. Use PDF or Word.');
        }
    } catch (err) {
        console.error("Conversion Error:", err);
        showToast('❌ Conversion failed: ' + (err.message || "Unknown error"));
        setConvLoading(false);
    }
}

function setConvLoading(show, text = "Converting...") {
    if (show) {
        converterLoading.classList.remove('site-hidden');
        convStatusText.firstChild.textContent = text + " ";
        convProgress.textContent = "0%";
    } else {
        converterLoading.classList.add('site-hidden');
    }
}

async function convertPDFtoWord(file) {
    if (typeof docx === 'undefined') {
        throw new Error("Word generation library (docx.JS) could not be loaded. Please check your internet connection.");
    }
    setConvLoading(true, "Reading PDF...");

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(s => s.str).join(' ') + "\n\n";
            convProgress.textContent = Math.round((i / pdf.numPages) * 100) + "%";
        }

        if (!fullText.trim()) {
            throw new Error("No text content found in the PDF.");
        }

        setConvLoading(true, "Generating Word file...");

        // Split text into paragraphs for docx
        const paragraphs = fullText.split('\n').filter(line => line.trim() !== "").map(line => {
            return new docx.Paragraph({
                children: [new docx.TextRun(line)]
            });
        });

        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: paragraphs
            }]
        });

        convertedBlob = await docx.Packer.toBlob(doc);
        convertedFileName = file.name.replace(/\.[^/.]+$/, "") + "_converted.docx";

        showConvResult(file.name, "Microsoft Word (.docx)");
        setConvLoading(false);
        showToast("✅ PDF converted to Word!");
    } catch (e) {
        console.error("PDF to Word error:", e);
        throw new Error("PDF processing failed: " + e.message);
    }
}

async function convertWordtoPDF(file) {
    if (typeof html2pdf === 'undefined') {
        throw new Error("PDF generation library (html2pdf) could not be loaded. Please check your internet connection.");
    }
    setConvLoading(true, "Reading Word file...");

    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const htmlContent = result.value || "Empty Document";

        setConvLoading(true, "Generating PDF...");

        // Create a temporary container for PDF generation
        const tempCont = document.createElement('div');
        tempCont.style.padding = "40px";
        tempCont.style.color = "#000";
        tempCont.style.background = "#fff";
        tempCont.style.fontFamily = "Arial, sans-serif";
        tempCont.style.lineHeight = "1.6";
        tempCont.innerHTML = `<h1 style="text-align:center; color: #333; margin-bottom: 20px;">${file.name}</h1><hr style="margin-bottom: 30px;">${htmlContent}`;

        const opt = {
            margin: 10,
            filename: file.name.replace(/\.[^/.]+$/, "") + ".pdf",
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Use promise-based output for better error handling
        convertedBlob = await html2pdf().set(opt).from(tempCont).output('blob');
        convertedFileName = opt.filename;

        showConvResult(file.name, "PDF Document (.pdf)");
        setConvLoading(false);
        showToast("✅ Word converted to PDF!");
    } catch (e) {
        console.error("Word to PDF error:", e);
        throw new Error("Word processing failed: " + e.message);
    }
}

function showConvResult(origName, type) {
    convFileInfo.innerHTML = `Original: ${origName}<br>Converted to: ${type}`;
    convResultArea.classList.remove('site-hidden');
    downloadConvBtn.onclick = () => {
        const url = URL.createObjectURL(convertedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = convertedFileName;
        a.click();
        URL.revokeObjectURL(url);
    };
}
