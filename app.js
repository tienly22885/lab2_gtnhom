(() => {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  function setActiveTab(tabId) {
    tabs.forEach(btn => {
      const active = btn.dataset.tab === tabId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.setAttribute("aria-expanded", active ? "true" : "false");
    });

    panels.forEach(p => p.classList.toggle("active", p.id === tabId));

    document.querySelectorAll(".subnav").forEach(s => s.classList.remove("show"));
    const sub = document.querySelector(`.subnav[data-subnav="${tabId}"]`);
    if (sub) sub.classList.add("show");
  }

  function buildSubnav(tabId) {
    const panel = document.getElementById(tabId);
    const sub = document.querySelector(`.subnav[data-subnav="${tabId}"]`);
    if (!panel || !sub) return;

    sub.innerHTML = "";

    // ✅ CHỈ lấy các mục bạn đánh dấu data-nav (không tự quét h2/h3 => không lòi tên thành viên)
    const anchors = panel.querySelectorAll("[data-nav][id]");

    anchors.forEach((el, idx) => {
      const title = el.getAttribute("data-nav");
      const id = el.id;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "subnav-item";
      btn.textContent = `${idx + 1}. ${title}`;

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setActiveTab(tabId);

        sub.querySelectorAll(".subnav-item").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");

        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      sub.appendChild(btn);
    });
  }

  // build submenu cho tất cả lab
  const allLabs = ["lab1", "lab2", "lab3", "lab4", "lab5"];
  allLabs.forEach(buildSubnav);

  // click tab
  tabs.forEach(btn => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  // init
  setActiveTab("lab1");
})();
