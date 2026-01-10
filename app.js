(() => {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  let currentTab = "lab1";        // lab đang mở
  let submenuOpen = true;         // trạng thái submenu

  function setActiveTab(tabId, toggle = false) {
    // Nếu click lại cùng tab → toggle submenu
    if (toggle && tabId === currentTab) {
      submenuOpen = !submenuOpen;
    } else {
      submenuOpen = true; // chuyển tab khác thì luôn mở submenu
    }

    currentTab = tabId;

    // active tab
    tabs.forEach(btn => {
      const active = btn.dataset.tab === tabId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.setAttribute("aria-expanded", active ? "true" : "false");
    });

    // panel
    panels.forEach(p => p.classList.toggle("active", p.id === tabId));

    // submenu
    document.querySelectorAll(".subnav").forEach(s => s.classList.remove("show"));
    if (submenuOpen) {
      const sub = document.querySelector(`.subnav[data-subnav="${tabId}"]`);
      if (sub) sub.classList.add("show");
    }
  }

  function buildSubnav(tabId) {
    const panel = document.getElementById(tabId);
    const sub = document.querySelector(`.subnav[data-subnav="${tabId}"]`);
    if (!panel || !sub) return;

    sub.innerHTML = "";

    const anchors = panel.querySelectorAll("[data-nav][id]");

    anchors.forEach((el, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "subnav-item";
      btn.textContent = `${idx + 1}. ${el.dataset.nav}`;

      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        setActiveTab(tabId);

        sub.querySelectorAll(".subnav-item").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");

        document.getElementById(el.id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      sub.appendChild(btn);
    });
  }

  // build submenu
  ["lab1", "lab2", "lab3", "lab4", "lab5"].forEach(buildSubnav);

  // tab click (toggle enabled)
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      setActiveTab(btn.dataset.tab, true);
    });
  });

  // init
  setActiveTab("lab1");
})();
