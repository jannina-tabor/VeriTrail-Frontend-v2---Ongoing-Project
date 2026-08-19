document.addEventListener("DOMContentLoaded", () => {
  const adminSidebar = document.getElementById("adminSidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  window.openAdminSidebar = function () {
    if (!adminSidebar) return;
    adminSidebar.classList.add("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("visible");
  };

  window.closeAdminSidebar = function () {
    if (!adminSidebar) return;
    adminSidebar.classList.remove("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("visible");
  };

  window.showAdminView = function (element, viewId) {
    if (!viewId) return;

    const views = document.querySelectorAll(".view");
    views.forEach(v => v.classList.remove("active"));

    const targetView = document.getElementById(viewId);
    if (!targetView) return;
    targetView.classList.add("active");

    const navItems = document.querySelectorAll(".admin-nav .nav-item");
    navItems.forEach(n => n.classList.remove("active"));
    if (element) element.classList.add("active");

    window.closeAdminSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.switchAdminMode = function (mode) {
    const navSupervisor = document.getElementById("nav-supervisor");
    const navIt = document.getElementById("nav-it");
    const modeSupBtn = document.getElementById("modeSupervisorBtn");
    const modeItBtn = document.getElementById("modeItBtn");
    const title = document.getElementById("adminTopbarTitle");

    if (mode === "it-admin") {
      if (navSupervisor) navSupervisor.hidden = true;
      if (navIt) navIt.hidden = false;
      if (modeSupBtn) modeSupBtn.classList.remove("active");
      if (modeItBtn) modeItBtn.classList.add("active");
      if (title) title.textContent = "IT Administrator Workspace";
      window.showAdminView(document.querySelector('#nav-it [data-view="it-overview"]'), "it-overview");
    } else {
      if (navSupervisor) navSupervisor.hidden = false;
      if (navIt) navIt.hidden = true;
      if (modeSupBtn) modeSupBtn.classList.add("active");
      if (modeItBtn) modeItBtn.classList.remove("active");
      if (title) title.textContent = "Supervisor Dashboard";
      window.showAdminView(document.querySelector('#nav-supervisor [data-view="sup-home"]'), "sup-home");
    }
  };
});