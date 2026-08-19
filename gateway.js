document.addEventListener("DOMContentLoaded", () => {
  const activeUserStr = localStorage.getItem('vt-active-user');
  const activeSessionBanner = document.getElementById('activeSessionBanner');
  const sessionUserName = document.getElementById('sessionUserName');

  if (activeUserStr && activeSessionBanner && sessionUserName) {
    try {
      const activeUser = JSON.parse(activeUserStr);
      sessionUserName.textContent = `${activeUser.displayName || 'User'} (${(activeUser.role || 'standard').toUpperCase()})`;
      activeSessionBanner.classList.remove('d-none');
    } catch (e) {
      localStorage.removeItem('vt-active-user');
    }
  }
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;
  const themeIcon = document.getElementById('themeIcon');
  const cachedTheme = localStorage.getItem('vt-theme-lock');

  if (cachedTheme === 'dark') {
    htmlElement.setAttribute('data-bs-theme', 'dark');
    if (themeIcon) themeIcon.className = "bi bi-sun-fill";
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = htmlElement.getAttribute('data-bs-theme') === 'dark';
      if (isDark) {
        htmlElement.removeAttribute('data-bs-theme');
        localStorage.setItem('vt-theme-lock', 'light');
        if (themeIcon) themeIcon.className = "bi bi-moon-fill";
      } else {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('vt-theme-lock', 'dark');
        if (themeIcon) themeIcon.className = "bi bi-sun-fill";
      }
    });
  }
  const trackingInput = document.querySelector(".search-input");
  const trackButton = document.querySelector(".btn-track");

  function executePublicTracking() {
    if (!trackingInput) return;
    const trackingId = trackingInput.value.trim();
    if (!trackingId) {
      alert("Please enter a valid tracking ID reference.");
      trackingInput.focus();
      return;
    }
    window.location.href = `track.html?id=${encodeURIComponent(trackingId)}`;
  }

  if (trackButton && trackingInput) {
    trackButton.addEventListener("click", executePublicTracking);
    trackingInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") executePublicTracking();
    });
  }
  window.navigateToGateway = function(targetAction) {
    const landing = document.getElementById('landingViewSection');
    const gateway = document.getElementById('gatewayCardSection');
    const backBtn = document.getElementById('backToLandingBtn');

    if (landing) landing.classList.add('hidden-step');
    if (gateway) gateway.classList.remove('hidden-step');
    if (backBtn) backBtn.classList.remove('d-none');

    if (targetAction === 'signin') {
      window.switchToSignInView();
    } else {
      window.switchToRegistrationView();
    }
  };

  window.returnToLanding = function() {
    const landing = document.getElementById('landingViewSection');
    const gateway = document.getElementById('gatewayCardSection');
    const backBtn = document.getElementById('backToLandingBtn');

    if (gateway) gateway.classList.add('hidden-step');
    if (landing) landing.classList.remove('hidden-step');
    if (backBtn) backBtn.classList.add('d-none');
  };

  window.switchToSignInView = function() {
    document.getElementById('registrationStep1')?.classList.add('hidden-step');
    document.getElementById('registrationStep2')?.classList.add('hidden-step');
    document.getElementById('registrationStep3')?.classList.add('hidden-step');
    document.getElementById('signInUnifiedView')?.classList.remove('hidden-step');

    const titleEl = document.getElementById('cardMainTitle');
    const subEl = document.getElementById('cardSubToggleText');
    if (titleEl) titleEl.innerText = "Welcome to VeriTrail";
    if (subEl) subEl.innerHTML = 'Sign in to your account';
    
    window.handleSignInRoleLayoutChange('it-admin');
  };

  window.switchToRegistrationView = function() {
    document.getElementById('signInUnifiedView')?.classList.add('hidden-step');
    document.getElementById('registrationStep1')?.classList.remove('hidden-step');
    document.getElementById('registrationStep2')?.classList.add('hidden-step');
    document.getElementById('registrationStep3')?.classList.add('hidden-step');

    const titleEl = document.getElementById('cardMainTitle');
    const subEl = document.getElementById('cardSubToggleText');
    if (titleEl) titleEl.innerText = "Create your VeriTrail Account";
    if (subEl) subEl.innerHTML = 'Already have an account? <a href="javascript:void(0);" onclick="switchToSignInView()" class="fw-semibold text-decoration-none" style="color: var(--vt-accent-tan);">Log In</a>';

    setTimeout(() => document.getElementById('employeeIdInput')?.focus(), 50);
  };

  window.handleSignInRoleLayoutChange = function(roleSelected) {
    const bypassContainer = document.getElementById('bypassCodeContainer');
    const usernameContainer = document.getElementById('usernameContainer');
    const confirmPassContainer = document.getElementById('confirmPasswordContainer');
    const forgotLink = document.getElementById('forgotPasswordLink');
    const submitBtn = document.getElementById('btnSubmitSignIn');

    if (bypassContainer) bypassContainer.style.display = "none";
    if (confirmPassContainer) confirmPassContainer.style.display = "none";
    if (forgotLink) forgotLink.style.display = "inline-block";
    if (submitBtn) submitBtn.innerText = "Sign In";

    if (roleSelected === 'it-admin' || roleSelected === 'supervisor') {
      if (bypassContainer) bypassContainer.style.display = "block";
      const label = document.getElementById('bypassCodeLabel');
      if (label) label.innerText = roleSelected === 'it-admin' ? "Bypass Code" : "Admin ID Code";
    }
  };

  window.redirectToWorkspace = function() {
    const activeUserStr = localStorage.getItem('vt-active-user');
    if (!activeUserStr) {
      alert("No active session found.");
      return;
    }
    const activeUser = JSON.parse(activeUserStr);
    window.location.href = `dashboard.html?role=${encodeURIComponent(activeUser.role)}`;
  };

  window.logoutSession = function() {
    localStorage.removeItem('vt-active-user');
    document.getElementById('activeSessionBanner')?.classList.add('d-none');
  };

});