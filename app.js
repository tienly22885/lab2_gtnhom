
/* =========================
   Tabs + Sidebar Submenu
========================= */
const buttons = document.querySelectorAll(".tab-btn");
const panels  = document.querySelectorAll(".tab-panel");

function slugify(s){
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
function cleanText(el){
  return (el.textContent || "").replace(/\s+/g, " ").trim();
}
function ensureId(panelId, el, index){
  if (el.id) return el.id;
  const base = `${panelId}-${slugify(cleanText(el)) || "sec"}-${index+1}`;
  let id = base, k = 2;
  while (document.getElementById(id)) id = `${base}-${k++}`;
  el.id = id;
  return id;
}

function closeAllSubnav(){
  document.querySelectorAll(".subnav").forEach(sn => sn.classList.remove("show"));
  buttons.forEach(b => b.setAttribute("aria-expanded", "false"));
}

function openSubnav(tabId){
  closeAllSubnav();
  const sub = document.querySelector(`.subnav[data-subnav="${tabId}"]`);
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (sub) sub.classList.add("show");
  if (btn) btn.setAttribute("aria-expanded", "true");
}

function activate(tabId, {scrollTop=true} = {}) {
  buttons.forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  panels.forEach(p => p.classList.toggle("active", p.id === tabId));
  if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Build submenu items for each lab from headings (h3/h4) */
function buildSubmenu(tabId){
  const panel = document.getElementById(tabId);
  const sub = document.querySelector(`.subnav[data-subnav="${tabId}"]`);
  if (!panel || !sub) return;

  sub.innerHTML = "";
  const headings = Array.from(panel.querySelectorAll("h3, h4"))
    .filter(h => cleanText(h).length > 0);

  headings.forEach((h, i) => {
    const targetId = ensureId(tabId, h, i);
    const item = document.createElement("button");
    item.type = "button";
    item.className = "subnav-item";
    item.dataset.tab = tabId;
    item.dataset.target = targetId;

    // thụt theo level
    const level = h.tagName.toLowerCase(); // h3/h4
    item.style.paddingLeft = (level === "h4") ? "16px" : "10px";

    item.textContent = cleanText(h);
    sub.appendChild(item);
  });

  // nếu không có heading
  if (headings.length === 0){
    const item = document.createElement("div");
    item.className = "subnav-item";
    item.style.cursor = "default";
    item.style.opacity = ".75";
    item.textContent = "Chưa có tiêu đề (h3/h4) để tạo mục lục.";
    sub.appendChild(item);
  }
}

["lab1","lab2","lab3","lab4"].forEach(buildSubmenu);

/* Click Lab button */
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tabId = btn.dataset.tab;
    const isActive = btn.classList.contains("active");
    const sub = document.querySelector(`.subnav[data-subnav="${tabId}"]`);

    // nếu đang active rồi => toggle xổ mục lục
    if (isActive) {
      if (sub) {
        const willShow = !sub.classList.contains("show");
        closeAllSubnav();
        if (willShow) openSubnav(tabId);
      }
      return;
    }

    // chuyển sang lab khác + mở mục lục lab đó
    activate(tabId);
    openSubnav(tabId);
  });
});

/* Click submenu item -> activate lab + scroll */
document.addEventListener("click", (e) => {
  const item = e.target.closest(".subnav-item");
  if (!item || !item.dataset.target) return;

  const tabId = item.dataset.tab;
  const targetId = item.dataset.target;

  activate(tabId, {scrollTop:false});
  openSubnav(tabId);

  // highlight active item trong submenu hiện tại
  document.querySelectorAll(`.subnav[data-subnav="${tabId}"] .subnav-item`)
    .forEach(x => x.classList.remove("active"));
  item.classList.add("active");

  const el = document.getElementById(targetId);
  if (el){
    setTimeout(() => {
      el.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 50);
  }
});

/* Load: mở submenu của lab đang active */
(function init(){
  const activeBtn = document.querySelector(".tab-btn.active");
  const tabId = activeBtn ? activeBtn.dataset.tab : "lab1";
  openSubnav(tabId);
})();


/* =========================
   Tết FX (giữ như bạn)
========================= */
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
  // bấm sidebar submenu thì không nổ FX
  if (e.target && e.target.closest(".nav")) return;

  spawnConfetti(e.clientX, e.clientY);

  const lx = document.createElement("div");
  lx.className = "lixi";
  lx.textContent = "🧧";
  lx.style.left = (e.clientX - 18) + "px";
  lx.style.top = (e.clientY - 22) + "px";
  document.body.appendChild(lx);
  setTimeout(() => lx.remove(), 1200);
});
