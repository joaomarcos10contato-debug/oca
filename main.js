/* =============================================
   OCA Eventos Sustentáveis — main.js
   Compartilhado por todas as páginas
   ============================================= */

/* NAVBAR — scroll effect */
const navbar = document.getElementById('navbar');
if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* MOBILE MENU */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        burger.classList.toggle('active', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
        if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMobile();
        }
    });
}

function closeMobile() {
    if (!burger || !mobileMenu) return;
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
}

/* NAVBAR ACTIVE LINK — detecta página atual */
(function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    const selectors = '.navbar__links a[data-nav], .navbar__mobile a[data-nav]';
    document.querySelectorAll(selectors).forEach(a => {
        if (a.dataset.nav === page) a.classList.add('active');
    });
})();

/* SCROLL REVEAL */
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

/* CONTADOR DE IMPACTO */
function animateCount(el) {
    const target    = parseInt(el.dataset.target, 10);
    const hasSuffix = el.dataset.suffix === 'kg';
    const duration  = 1500;
    const startTime = performance.now();
    const ease      = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    (function step(now) {
        const t   = Math.min((now - startTime) / duration, 1);
        const val = Math.round(ease(t) * target);
        el.textContent = val.toLocaleString('pt-BR') + (hasSuffix ? ' kg' : '');
        if (t < 1) requestAnimationFrame(step);
    })(performance.now());
}

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
    let counted = false;
    const countObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
            counted = true;
            statsGrid.querySelectorAll('.stat-box__number[data-target]').forEach(el => animateCount(el));
            countObs.disconnect();
        }
    }, { threshold: 0.25 });
    countObs.observe(statsGrid);
}

/* PARTICLE BUTTONS */
function particleColor(btn) {
    if (btn.classList.contains('btn--green'))         return '#604747';
    if (btn.classList.contains('btn--primary'))       return '#C9EE96';
    if (btn.classList.contains('btn--outline-white')) return '#ffffff';
    return '#C9EE96';
}

function burstParticles(btn) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect  = btn.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const color = particleColor(btn);

    btn.style.transform  = 'scale(0.95)';
    btn.style.transition = 'transform 0.1s ease';
    setTimeout(() => { btn.style.transform = ''; btn.style.transition = ''; }, 150);

    for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position:fixed; left:${cx}px; top:${cy}px;
            width:6px; height:6px; border-radius:50%;
            background:${color}; pointer-events:none; z-index:99999;
            transform:translate(-50%,-50%);
        `;
        document.body.appendChild(dot);

        const xDir = (i % 2 ? 1 : -1) * (Math.random() * 55 + 18);
        const yDir = -(Math.random() * 55 + 18);

        dot.animate([
            { transform: 'translate(-50%,-50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${xDir}px), calc(-50% + ${yDir}px)) scale(1)`, opacity: 1, offset: 0.35 },
            { transform: `translate(calc(-50% + ${xDir}px), calc(-50% + ${yDir}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            delay: i * 90,
            easing: 'ease-out',
            fill: 'forwards'
        }).addEventListener('finish', () => dot.remove());
    }
}

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => burstParticles(btn));
});

/* PARTNER MODALS — usado em parceiras.html */
function openPartner(id) {
    const modal = document.getElementById('modal-' + id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePartner(id) {
    const modal = document.getElementById('modal-' + id);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

/* ESC fecha modais */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.partner-modal.open').forEach(m => {
            m.classList.remove('open');
        });
        document.body.style.overflow = '';
    }
});

/* FORMULÁRIO DE CONTATO — usado em contato.html */
function submitContato(e) {
    e.preventDefault();
    const nome    = document.getElementById('f-nome')?.value.trim();
    const empresa = document.getElementById('f-empresa')?.value.trim();
    const email   = document.getElementById('f-email')?.value.trim();
    const tel     = document.getElementById('f-tel')?.value.trim();
    const servico = document.getElementById('f-servico')?.value;
    const msg     = document.getElementById('f-msg')?.value.trim();
    const privacy = document.getElementById('f-privacy')?.checked;

    if (!nome || !email || !tel || !servico || !privacy) return;

    let texto = `Olá, Karine! Meu nome é *${nome}*`;
    if (empresa) texto += ` da empresa *${empresa}*`;
    texto += `.\n\n📧 E-mail: ${email}\n📞 Telefone: ${tel}\n🌿 Serviço: ${servico}`;
    if (msg) texto += `\n\n💬 Mensagem: ${msg}`;

    window.open('https://wa.me/5531998543261?text=' + encodeURIComponent(texto), '_blank');
}

/* KARINE NAME UNDERLINE — usado em sobre.html */
window.addEventListener('load', () => {
    const karinePath  = document.querySelector('.karine-name__path');
    const karineSvg   = document.querySelector('.karine-name__underline');
    const karineSpan  = document.querySelector('.karine-name');
    const karineTitle = document.getElementById('karine-titulo');
    if (!karinePath || !karineSvg || !karineSpan || !karineTitle) return;

    function buildPath(w, flip) {
        const y1 = flip ? 17 : 3;
        const y2 = flip ? 3  : 17;
        return `M 0,10 Q ${w*0.25},${y1} ${w*0.5},10 Q ${w*0.75},${y2} ${w},10`;
    }

    function updatePath() {
        const w = karineSpan.offsetWidth;
        if (!w) return;
        karineSvg.setAttribute('viewBox', `0 0 ${w} 20`);
        karinePath.setAttribute('d', buildPath(w, false));
        karinePath._w = w;
        const len = karinePath.getTotalLength();
        karinePath.style.strokeDasharray  = len;
        karinePath.style.strokeDashoffset = len;
        karinePath.classList.remove('is-drawn');
    }

    updatePath();
    window.addEventListener('resize', updatePath, { passive: true });

    karineSpan.addEventListener('mouseenter', () => {
        if (karinePath._w) karinePath.setAttribute('d', buildPath(karinePath._w, true));
    });
    karineSpan.addEventListener('mouseleave', () => {
        if (karinePath._w) karinePath.setAttribute('d', buildPath(karinePath._w, false));
    });

    const karineObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            karinePath.classList.add('is-drawn');
            karineObs.disconnect();
        }
    }, { threshold: 0.8, rootMargin: '0px 0px -60px 0px' });
    karineObs.observe(karineTitle);
});

/* WORD CYCLING — usado em index.html */
const wordCycle = document.querySelector('.word-cycle');
if (wordCycle) {
    const sizer   = wordCycle.querySelector('.wc-sizer');
    const wcWords = Array.from(wordCycle.querySelectorAll('.wc-word'));
    const words   = ['escolha.', 'cuidado.', 'consciência.', 'responsabilidade.', 'pertencimento.', 'transformação.'];
    let   wIdx    = 0;

    function syncWidth() {
        wordCycle.style.width = sizer.offsetWidth + 'px';
    }
    syncWidth();
    window.addEventListener('resize', syncWidth, { passive: true });

    function nextWord() {
        wcWords[wIdx].classList.remove('is-active');
        wcWords[wIdx].classList.add('is-exit');
        const prev = wIdx;
        wIdx = (wIdx + 1) % words.length;
        wcWords[wIdx].classList.add('is-active');
        sizer.textContent = words[wIdx];
        syncWidth();
        setTimeout(() => wcWords[prev].classList.remove('is-exit'), 400);
    }

    setTimeout(() => setInterval(nextWord, 2000), 1500);
}
