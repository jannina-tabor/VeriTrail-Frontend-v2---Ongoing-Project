document.addEventListener("DOMContentLoaded", () => {
  const trackInput = document.querySelector(".hero-card .input");
  const trackBtn = document.querySelector(".hero-card .btn-track");

  function executeTrackingRedirect() {
    if (!trackInput) return;
    const queryId = trackInput.value.trim();
    
    if (!queryId) {
      alert("Please enter a valid tracking reference number (e.g. TRX-2026-000145).");
      trackInput.focus();
      return;
    }

    window.location.href = `track.html?id=${encodeURIComponent(queryId)}`;
  }

  if (trackBtn && trackInput) {
    trackBtn.addEventListener("click", executeTrackingRedirect);
    trackInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        executeTrackingRedirect();
      }
    });
  }

  const heroSignUpBtn = document.querySelector('.hero-actions .btn-primary');
  if (heroSignUpBtn) {
    heroSignUpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('signup', 'requester');
    });
  }

  const operationalWorkspaceBtn = document.querySelector('.workspace-card .btn-primary');
  if (operationalWorkspaceBtn) {
    operationalWorkspaceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('signin', 'requester');
    });
  }

  const adminWorkspaceBtn = document.querySelector('.workspace-card .btn-secondary');
  if (adminWorkspaceBtn) {
    adminWorkspaceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('signin', 'supervisor');
    });
  }

  const adminWorkspaceBtn = document.querySelector('.workspace-card .btn-secondary');
  if (adminWorkspaceBtn) {
    adminWorkspaceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('signin', 'it-admin');
    });
    }

});

function openAuthModal(mode = 'signin', defaultRole = 'requester') {
  const overlay = document.getElementById('authModalOverlay');
  if (overlay) overlay.classList.add('show');
  
  if (mode === 'signup') {
    switchAuthTab('signup');
  } else {
    switchAuthTab('signin');
    const roleSelect = document.getElementById('signInRoleSelect');
    if (roleSelect && defaultRole) {
      roleSelect.value = defaultRole;
      toggleAdminBypassField(defaultRole);
    }
  }
}

function closeAuthModal() {
  const overlay = document.getElementById('authModalOverlay');
  if (overlay) overlay.classList.remove('show');
}

function switchAuthTab(tab) {
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const title = document.getElementById('authModalTitle');
  const sub = document.getElementById('authModalSub');

  if (tab === 'signup') {
    if (signInForm) signInForm.style.display = 'none';
    if (signUpForm) signUpForm.style.display = 'flex';
    if (title) title.textContent = "Register VeriTrail Account";
    if (sub) sub.textContent = "Verify your employee credentials to initialize access.";
  } else {
    if (signUpForm) signUpForm.style.display = 'none';
    if (signInForm) signInForm.style.display = 'flex';
    if (title) title.textContent = "Sign In to VeriTrail";
    if (sub) sub.textContent = "Enter your operational credentials to continue.";
  }
}

function toggleAdminBypassField(role) {
  const bypassGroup = document.getElementById('adminBypassGroup');
  if (!bypassGroup) return;
  
  if (role === 'supervisor' || role === 'it-admin') {
    bypassGroup.style.display = 'block';
  } else {
    bypassGroup.style.display = 'none';
  }
}

function togglePasswordVisibility(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);

  if (!passwordInput || !eyeIcon) return;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  } else {
    passwordInput.type = 'password';
    eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  }
}

function verifyEmployeeRoster() {
  const empIdInput = document.getElementById('signUpEmpId');
  const detailsContainer = document.getElementById('signUpDetailsContainer');
  const fullNameInput = document.getElementById('signUpFullName');
  
  const empId = (empIdInput?.value || '').trim().toUpperCase();
  
  if (!empId) {
    alert("Please enter a valid Employee ID.");
    return;
  }

  if (empId === "EMP-2026-042" || empId.startsWith("EMP-")) {
    if (fullNameInput) fullNameInput.value = "Juan Dela Cruz";
    if (detailsContainer) detailsContainer.style.display = 'flex';
    alert("Employee ID verified successfully!");
  } else {
    alert("Employee ID not found in authorized roster. Contact IT Administrator.");
    if (detailsContainer) detailsContainer.style.display = 'none';
  }
}

function executeBlueprintSignIn() {
  const role = document.getElementById('signInRoleSelect').value;
  const username = document.getElementById('signInUsername').value.trim();

  if (!username) {
    alert("Please enter your username.");
    return;
  }

  localStorage.setItem('vt-active-user', JSON.stringify({
    username: username,
    role: role,
    displayName: "Juan Dela Cruz",
    loginTime: Date.now()
  }));

  alert(`Signed in successfully under ${role.toUpperCase()}. Routing to workspace...`);
  closeAuthModal();

  setTimeout(() => {
    if (role === 'supervisor' || role === 'it-admin') {
      window.location.href = `admin.html?role=${encodeURIComponent(role)}`;
    } else {
      window.location.href = `dashboard.html?role=${encodeURIComponent(role)}`;
    }
  }, 500);
}

function executeBlueprintSignUp() {
  const empId = document.getElementById('signUpEmpId').value.trim();
  const username = document.getElementById('signUpUsername').value.trim();

  if (!username) {
    alert("Please complete the registration fields.");
    return;
  }

  localStorage.setItem('vt-active-user', JSON.stringify({
    username: username,
    role: 'requester',
    displayName: "Juan Dela Cruz",
    employeeId: empId,
    loginTime: Date.now()
  }));

  alert("Account created and verified! Routing to operational workspace...");
  closeAuthModal();

  setTimeout(() => {
    window.location.href = `dashboard.html?role=requester`;
  }, 500);
}