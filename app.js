// Tabs
const buttons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

function activate(tabId) {
    buttons.forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    panels.forEach(p => p.classList.toggle("active", p.id === tabId));
    window.scrollTo({ top: 0, behavior: "smooth" });
}

buttons.forEach(btn => btn.addEventListener("click", () => activate(btn.dataset.tab)));

if (location.hash) {
    const id = location.hash.replace("#", "");
    const ok = document.getElementById(id);
    if (ok) activate(id);
}

// Tết FX: confetti nhẹ + lì xì
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const confetti = [];
function spawnConfetti(x, y) {
    const n = 26;
    for (let i = 0; i < n; i++) {
        confetti.push({
            x, y,
            vx: (Math.random() * 2 - 1) * 3.0,
            vy: (Math.random() * 2 - 1) * 3.0,
            r: 1.8 + Math.random() * 2.6,
            a: 1,
            g: 0.05 + Math.random() * 0.06,
            c: Math.random() > 0.5 ? "rgba(193,18,31," : "rgba(245,158,11,"
        });
    }
}

function tick() {
    ctx.clearRect(0, 0, w, h);
    for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i];
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.a -= 0.014;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + p.a + ")";
        ctx.fill();

        if (p.a <= 0 || p.y > h + 40) confetti.splice(i, 1);
    }
    requestAnimationFrame(tick);
}
tick();

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logoutBtn") return;

    spawnConfetti(e.clientX, e.clientY);

    const lx = document.createElement("div");
    lx.className = "lixi";
    lx.textContent = "🧧";
    lx.style.left = (e.clientX - 18) + "px";
    lx.style.top = (e.clientY - 22) + "px";
    document.body.appendChild(lx);
    setTimeout(() => lx.remove(), 1200);
});