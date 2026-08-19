
document.addEventListener("DOMContentLoaded", () => {

  const sidebar =
    document.querySelector(".sidebar");

  const sidebarBackdrop =
    document.querySelector(".sidebar-backdrop");

  const notificationPanel =
    document.getElementById("notificationPanel");

  const notificationButton =
    document.getElementById("notificationButton");

  const notificationBadge =
    document.getElementById("notificationBadge");

  const roleConfig = {

    requester: {
      navId: "nav-requester",
      homeView: "req-home"
    },

    handler: {
      navId: "nav-handler",
      homeView: "h-home"
    },

    messenger: {
      navId: "nav-messenger",
      homeView: "m-home"
    },

    receiver: {
      navId: "nav-receiver",
      homeView: "r-home"
    }

  };

  window.openSidebar = function () {

    if (!sidebar) return;

    sidebar.classList.add("open");

    if (sidebarBackdrop) {
      sidebarBackdrop.classList.add("visible");
    }

    document.body.classList.add("sidebar-open");

  };


  window.closeSidebar = function () {

    if (!sidebar) return;

    sidebar.classList.remove("open");

    if (sidebarBackdrop) {
      sidebarBackdrop.classList.remove("visible");
    }

    document.body.classList.remove("sidebar-open");

  };


  if (sidebarBackdrop) {

    sidebarBackdrop.addEventListener(
      "click",
      window.closeSidebar
    );

  }

  window.showView = function (element, viewId) {

    if (!viewId) return;

    const views =
      document.querySelectorAll(".view");

    views.forEach((view) => {
      view.classList.remove("active");
    });

    const targetView =
      document.getElementById(viewId);

    if (!targetView) {

      console.warn(
        `VeriTrail: View "${viewId}" not found.`
      );

      return;

    }

    targetView.classList.add("active");

    const navItems =
      document.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      item.classList.remove("active");
    });

    if (element) {
      element.classList.add("active");
    }

    window.closeSidebar();

    try {

      const url =
        new URL(window.location.href);

      url.searchParams.set(
        "view",
        viewId
      );

      window.history.replaceState(
        {},
        "",
        url
      );

    } catch (error) {

      console.warn(
        "VeriTrail: Could not update URL.",
        error
      );

    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  window.switchRole = function (role) {
    if (!role) return;

    const normalizedRole = String(role).toLowerCase();
    const config = roleConfig[normalizedRole];

    if (!config) {
      console.warn(`VeriTrail: Unknown workspace "${role}".`);
      return;
    }

    localStorage.setItem("vt-workspace", normalizedRole);
    document.body.dataset.workspace = normalizedRole;

    
    Object.values(roleConfig).forEach((item) => {
      const nav = document.getElementById(item.navId);
      if (!nav) return;
      nav.hidden = true;       
      nav.style.display = "none";
    });

    
    const activeNav = document.getElementById(config.navId);
    if (activeNav) {
      activeNav.hidden = false;
      activeNav.style.display = "flex";
    }

    const roleButtons = document.querySelectorAll(".role-button");
    roleButtons.forEach((button) => {
      const buttonRole = button.dataset.role;
      if (buttonRole && buttonRole.toLowerCase() === normalizedRole) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });

    const homeView = document.getElementById(config.homeView);
    if (homeView) {
      const homeNav = activeNav ? activeNav.querySelector(`[data-view="${config.homeView}"]`) : null;
      window.showView(homeNav, config.homeView);
    }
  };

  window.toggleNotifications = function () {

    if (!notificationPanel) return;


    const isOpen =
      !notificationPanel.hidden;


    if (isOpen) {

      window.closeNotifications();

    } else {

      window.openNotifications();

    }

  };


  window.openNotifications = function () {

    if (!notificationPanel) return;


    notificationPanel.hidden = false;

    notificationPanel.classList.add(
      "visible"
    );

  };


  window.closeNotifications = function () {

    if (!notificationPanel) return;


    notificationPanel.classList.remove(
      "visible"
    );


    notificationPanel.hidden = true;

  };

  window.markNotificationsRead = function () {

    const unreadItems =
      document.querySelectorAll(
        ".notification-item.unread"
      );


    unreadItems.forEach((item) => {

      item.classList.remove("unread");

    });

    if (notificationBadge) {

      notificationBadge.textContent = "0";

      notificationBadge.hidden = true;

    }


    localStorage.setItem(
      "vt-notifications-read",
      "true"
    );

  };

  function restoreNotificationState() {

    const notificationsRead =
      localStorage.getItem(
        "vt-notifications-read"
      );


    if (
      notificationsRead !== "true"
    ) {
      return;
    }


    const unreadItems =
      document.querySelectorAll(
        ".notification-item.unread"
      );


    unreadItems.forEach((item) => {

      item.classList.remove("unread");

    });


    if (notificationBadge) {

      notificationBadge.textContent = "0";

      notificationBadge.hidden = true;

    }

  }


  restoreNotificationState();

  document.addEventListener(
    "click",
    (event) => {

      if (!notificationPanel) {
        return;
      }


      if (notificationPanel.hidden) {
        return;
      }


      const insidePanel =
        notificationPanel.contains(
          event.target
        );


      const notificationClicked =
        notificationButton &&
        notificationButton.contains(
          event.target
        );


      if (
        !insidePanel &&
        !notificationClicked
      ) {

        window.closeNotifications();

      }

    }
  );

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") {
        return;
      }


      window.closeSidebar();

      window.closeNotifications();

    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 900) {

        window.closeSidebar();

      }

    }
  );


  function loadWorkspace() {

    const savedWorkspace =
      localStorage.getItem(
        "vt-workspace"
      );


    if (
      savedWorkspace &&
      roleConfig[savedWorkspace]
    ) {

      window.switchRole(
        savedWorkspace
      );

      return;

    }


    window.switchRole(
      "requester"
    );

  }


  function loadInitialView() {

    const params =
      new URLSearchParams(
        window.location.search
      );


    const requestedView =
      params.get("view");


    if (!requestedView) {
      return;
    }


    const targetView =
      document.getElementById(
        requestedView
      );


    if (!targetView) {
      return;
    }


    const targetNav =
      document.querySelector(
        `.nav-item[data-view="${requestedView}"]`
      );


    window.showView(
      targetNav,
      requestedView
    );

  }


  loadWorkspace();

  loadInitialView();


  console.log(
    "VeriTrail Dashboard initialized."
  );

});

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("transferRequestForm");

  const reviewButton =
    document.getElementById("reviewTransferRequest");

  const submitButton =
    document.getElementById("submitTransferRequest");

  const cancelButton =
    document.getElementById("cancelTransferRequest");

  const reviewCard =
    document.getElementById("requestReviewCard");

  const summaryContainer =
    document.getElementById("requestSummary");

  const statusContainer =
    document.getElementById("transferRequestStatus");

  if (!form) {
    return;
  }

  const fields = {

    requestType:
      document.getElementById("requestType"),

    priority:
      document.getElementById("requestPriority"),

    purpose:
      document.getElementById("requestPurpose"),

    item:
      document.getElementById("requestItem"),

    quantity:
      document.getElementById("requestQuantity"),

    unit:
      document.getElementById("requestUnit"),

    condition:
      document.getElementById("requestCondition"),

    itemNotes:
      document.getElementById("itemNotes"),

    destination:
      document.getElementById("requestDestination"),

    recipient:
      document.getElementById("requestRecipient"),

    requestedDate:
      document.getElementById("requestedDate"),

    deliveryMethod:
      document.getElementById("deliveryMethod"),

    deliveryNotes:
      document.getElementById("destinationNotes")

  };

  let reviewReady = false;

  let submitted = false;

  const STORAGE_KEY =
    "vt-transfer-requests";

  function setMinimumDate() {

    if (!fields.requestedDate) {
      return;
    }

    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    const minimumDate =
      `${year}-${month}-${day}`;

    fields.requestedDate.min =
      minimumDate;

  }


  setMinimumDate();

  function getSelectedText(selectElement) {

    if (!selectElement) {
      return "";
    }

    const option =
      selectElement.options[
        selectElement.selectedIndex
      ];

    return option
      ? option.textContent.trim()
      : "";

  }

  function cleanValue(value) {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not specified";
    }

    return String(value).trim();

  }

  function validateTransferRequest() {

    form.classList.remove(
      "form-validation-error"
    );

    if (!form.checkValidity()) {

      form.reportValidity();

      return false;

    }

    const quantity =
      Number(
        fields.quantity.value
      );


    if (
      !Number.isFinite(quantity) ||
      quantity < 1
    ) {

      showFormStatus(
        "Please enter a valid quantity of at least 1.",
        "error"
      );

      fields.quantity.focus();

      return false;

    }

    if (
      fields.requestedDate.value
    ) {

      const selectedDate =
        new Date(
          `${fields.requestedDate.value}T00:00:00`
        );

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );


      if (
        selectedDate < today
      ) {

        showFormStatus(
          "The requested delivery date cannot be in the past.",
          "error"
        );

        fields.requestedDate.focus();

        return false;

      }

    }


    clearFormStatus();

    return true;

  }



  function collectFormData() {

    return {

      requestType:
        getSelectedText(
          fields.requestType
        ),

      priority:
        getSelectedText(
          fields.priority
        ),

      purpose:
        cleanValue(
          fields.purpose.value
        ),

      item:
        getSelectedText(
          fields.item
        ),

      quantity:
        cleanValue(
          fields.quantity.value
        ),

      unit:
        getSelectedText(
          fields.unit
        ),

      condition:
        getSelectedText(
          fields.condition
        ),

      itemNotes:
        cleanValue(
          fields.itemNotes.value
        ),

      destination:
        getSelectedText(
          fields.destination
        ),

      recipient:
        getSelectedText(
          fields.recipient
        ),

      requestedDate:
        cleanValue(
          fields.requestedDate.value
        ),

      deliveryMethod:
        getSelectedText(
          fields.deliveryMethod
        ),

      deliveryNotes:
        cleanValue(
          fields.deliveryNotes.value
        )

    };

  }

  function formatDate(dateString) {

    if (!dateString) {
      return "Not specified";
    }

    const date =
      new Date(
        `${dateString}T00:00:00`
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );

  }


  function createSummaryRow(
    label,
    value
  ) {

    const row =
      document.createElement(
        "div"
      );

    row.className =
      "summary-row";


    const labelElement =
      document.createElement(
        "span"
      );

    labelElement.className =
      "summary-label";

    labelElement.textContent =
      label;


    const valueElement =
      document.createElement(
        "span"
      );

    valueElement.className =
      "summary-value";

    valueElement.textContent =
      value;


    row.appendChild(
      labelElement
    );

    row.appendChild(
      valueElement
    );


    return row;

  }

  function generateReviewSummary() {

    const data =
      collectFormData();


    if (!summaryContainer) {
      return;
    }


    summaryContainer.innerHTML =
      "";

    summaryContainer.appendChild(
      createSummaryRow(
        "Request Type",
        data.requestType
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Priority",
        data.priority
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Purpose",
        data.purpose
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Item / Material",
        data.item
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Quantity",
        `${data.quantity} ${data.unit}`
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Expected Condition",
        data.condition
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Item Notes",
        data.itemNotes
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Destination",
        data.destination
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Recipient",
        data.recipient
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Requested Delivery",
        formatDate(
          data.requestedDate
        )
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Delivery Method",
        data.deliveryMethod
      )
    );

    summaryContainer.appendChild(
      createSummaryRow(
        "Delivery Instructions",
        data.deliveryNotes
      )
    );

  }

  function showReview() {

    if (!validateTransferRequest()) {
      return;
    }


    generateReviewSummary();


    if (reviewCard) {

      reviewCard.hidden =
        false;

      reviewCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }


    reviewReady = true;

    if (reviewButton) {

      reviewButton.textContent =
        "Update Review";

    }

    if (submitButton) {

      submitButton.hidden =
        false;

    }


    showFormStatus(
      "Please review your request before submitting.",
      "success"
    );

  }

  if (reviewButton) {

    reviewButton.addEventListener(
      "click",
      () => {

        showReview();

      }
    );

  }

  form.addEventListener(
    "input",
    () => {

      if (!reviewReady) {
        return;
      }

      reviewReady = false;

      if (submitButton) {

        submitButton.hidden =
          true;

      }


      if (reviewButton) {

        reviewButton.textContent =
          "Review Request";

      }

    }
  );


  form.addEventListener(
    "change",
    () => {

      if (!reviewReady) {
        return;
      }


      reviewReady = false;


      if (submitButton) {

        submitButton.hidden =
          true;

      }


      if (reviewButton) {

        reviewButton.textContent =
          "Review Request";

      }

    }
  );


  function generateRequestId() {

    const requests =
      getStoredRequests();


    const nextNumber =
      requests.length + 1;


    return (
      "VT-2026-" +
      String(
        nextNumber
      ).padStart(
        6,
        "0"
      )
    );

  }

  function getStoredRequests() {

    try {

      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (!stored) {
        return [];
      }


      const parsed =
        JSON.parse(
          stored
        );


      return Array.isArray(
        parsed
      )
        ? parsed
        : [];

    } catch (error) {

      console.warn(
        "VeriTrail: Could not read stored requests.",
        error
      );

      return [];

    }

  }

  function saveRequest(request) {

    const requests =
      getStoredRequests();


    requests.push(
      request
    );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        requests
      )
    );

  }

  function submitTransferRequest() {

    if (
      submitted ||
      !reviewReady
    ) {
      return;
    }


    if (
      !validateTransferRequest()
    ) {
      return;
    }


    const data =
      collectFormData();


    const requestId =
      generateRequestId();


    const now =
      new Date();


    const request = {

      id:
        requestId,

      ...data,

      status:
        "Pending Approval",

      createdAt:
        now.toISOString(),

      createdBy:
        "Juan Dela Cruz"

    };


    saveRequest(
      request
    );


    submitted = true;


    showSubmittedState(
      requestId
    );

  }

  if (submitButton) {

    submitButton.addEventListener(
      "click",
      () => {

        submitTransferRequest();

      }
    );

  }

  function showSubmittedState(
    requestId
  ) {
    const formCards =
      form.querySelectorAll(
        ".form-card:not(.review-card)"
      );


    formCards.forEach(
      (card) => {

        card.hidden =
          true;

      }
    );


    if (reviewCard) {

      reviewCard.hidden =
        false;

    }


    if (summaryContainer) {

      summaryContainer.innerHTML = `

        <div class="request-created">

          <div
            class="request-created-icon"
            aria-hidden="true"
          >
            ✓
          </div>

          <h3>
            Transfer Request Submitted
          </h3>

          <p>
            Your transfer request has been successfully
            submitted and is now awaiting operational review.
          </p>

          <span class="request-id">
            ${requestId}
          </span>

        </div>

      `;

    }

    if (reviewButton) {

      reviewButton.hidden =
        true;

    }


    if (submitButton) {

      submitButton.hidden =
        true;

    }


    if (cancelButton) {

      cancelButton.textContent =
        "Back to Requester Home";

    }


    showFormStatus(
      `Request ${requestId} has been submitted successfully.`,
      "success"
    );

    reviewCard?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

  function showFormStatus(
    message,
    type = ""
  ) {

    if (!statusContainer) {
      return;
    }


    statusContainer.textContent =
      message;


    statusContainer.className =
      "form-status visible";


    if (type) {

      statusContainer.classList.add(
        type
      );

    }

  }


  function clearFormStatus() {

    if (!statusContainer) {
      return;
    }


    statusContainer.textContent =
      "";

    statusContainer.className =
      "form-status";

  }

  function resetTransferForm() {

    form.reset();


    reviewReady =
      false;

    submitted =
      false;


    if (reviewCard) {

      reviewCard.hidden =
        true;

    }


    if (summaryContainer) {

      summaryContainer.innerHTML =
        "";

    }


    if (reviewButton) {

      reviewButton.hidden =
        false;

      reviewButton.textContent =
        "Review Request";

    }


    if (submitButton) {

      submitButton.hidden =
        true;

    }


    if (cancelButton) {

      cancelButton.textContent =
        "Cancel";

    }

    const formCards =
      form.querySelectorAll(
        ".form-card:not(.review-card)"
      );


    formCards.forEach(
      (card) => {

        card.hidden =
          false;

      }
    );


    clearFormStatus();


    setMinimumDate();

  }

  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      () => {

        if (submitted) {

          resetTransferForm();


          if (
            typeof window.showView ===
            "function"
          ) {

            window.showView(
              null,
              "req-home"
            );

          }

          return;

        }

        const hasInput =
          Array.from(
            form.elements
          ).some(
            (element) => {

              if (
                !element.name ||
                element.type === "button" ||
                element.type === "submit"
              ) {
                return false;
              }

              return (
                String(
                  element.value
                ).trim() !== ""
              );

            }
          );


        if (
          hasInput &&
          !window.confirm(
            "Discard this transfer request?"
          )
        ) {

          return;

        }


        resetTransferForm();

        if (
          typeof window.showView ===
          "function"
        ) {

          window.showView(
            null,
            "req-home"
          );

        }

      }
    );

  }


  window.getVeriTrailTransferRequests =
    function () {

      return getStoredRequests();

    };

  setMinimumDate();

});

document.addEventListener("DOMContentLoaded", () => {

  const requestList =
    document.getElementById("outboundRequestList");

  const emptyState =
    document.getElementById("outboundEmptyState");

  const filterEmptyState =
    document.getElementById("outboundFilterEmpty");

  const searchInput =
    document.getElementById("outboundSearch");

  const statusFilter =
    document.getElementById("outboundStatusFilter");

  const priorityFilter =
    document.getElementById("outboundPriorityFilter");

  const totalCount =
    document.getElementById("outboundTotal");

  const pendingCount =
    document.getElementById("outboundPending");

  const progressCount =
    document.getElementById("outboundProgress");

  const completedCount =
    document.getElementById("outboundCompleted");

  const createButton =
    document.getElementById("createOutboundRequest");

  const clearFiltersButton =
    document.getElementById("clearOutboundFilters");


  if (!requestList) {
    return;
  }

  const STORAGE_KEY =
    "vt-transfer-requests";

  function getRequests() {

    try {

      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!stored) {
        return [];
      }

      const parsed =
        JSON.parse(stored);

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch (error) {

      console.warn(
        "VeriTrail: Unable to load transfer requests.",
        error
      );

      return [];

    }

  }

  function saveRequests(requests) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(requests)
    );

  }

  function normalizeStatus(status) {

    return String(
      status || ""
    )
      .toLowerCase()
      .replace(/\s+/g, "-");

  }

  function normalizePriority(priority) {

    return String(
      priority || ""
    )
      .toLowerCase()
      .trim();

  }

  function formatRequestDate(dateString) {

    if (!dateString) {
      return "Not specified";
    }

    const date =
      new Date(
        `${dateString}T00:00:00`
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-PH",
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    );

  }

  function formatStatusLabel(status) {

    if (!status) {
      return "Unknown";
    }

    return String(status)
      .replace(/-/g, " ")
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }

  function createRequestElement(
    request
  ) {

    const item =
      document.createElement(
        "article"
      );

    item.className =
      "outbound-request-item";

    item.dataset.requestId =
      request.id || "";


    const main =
      document.createElement(
        "div"
      );

    main.className =
      "outbound-request-main";


    const requestId =
      document.createElement(
        "span"
      );

    requestId.className =
      "outbound-request-id";

    requestId.textContent =
      request.id || "No ID";


    const itemName =
      document.createElement(
        "h3"
      );

    itemName.className =
      "outbound-request-item-name";

    itemName.textContent =
      request.item || "Unspecified Item";


    main.appendChild(
      requestId
    );

    main.appendChild(
      itemName
    );

    const destination =
      createMeta(
        "Destination",
        request.destination
      );


    const delivery =
      createMeta(
        "Requested Delivery",
        formatRequestDate(
          request.requestedDate
        )
      );

    const statusContainer =
      document.createElement(
        "div"
      );

    const status =
      document.createElement(
        "span"
      );

    const normalizedStatus =
      normalizeStatus(
        request.status
      );

    status.className =
      `outbound-status ${normalizedStatus}`;

    status.textContent =
      formatStatusLabel(
        request.status
      );

    statusContainer.appendChild(
      status
    );

    const action =
      document.createElement(
        "div"
      );

    action.className =
      "outbound-request-action";


    const viewButton =
      document.createElement(
        "button"
      );

    viewButton.type =
      "button";

    viewButton.className =
      "outbound-request-view";

    viewButton.textContent =
      "View Details";


    viewButton.addEventListener(
      "click",
      () => {

        openRequestDetails(
          request
        );

      }
    );


    action.appendChild(
      viewButton
    );

    item.appendChild(
      main
    );

    item.appendChild(
      destination
    );

    item.appendChild(
      delivery
    );

    item.appendChild(
      statusContainer
    );

    item.appendChild(
      action
    );


    return item;

  }

  function createMeta(
    label,
    value
  ) {

    const container =
      document.createElement(
        "div"
      );

    container.className =
      "outbound-request-meta";


    const labelElement =
      document.createElement(
        "span"
      );

    labelElement.className =
      "outbound-request-meta-label";

    labelElement.textContent =
      label;


    const valueElement =
      document.createElement(
        "span"
      );

    valueElement.className =
      "outbound-request-meta-value";

    valueElement.textContent =
      value || "Not specified";


    container.appendChild(
      labelElement
    );

    container.appendChild(
      valueElement
    );


    return container;

  }


  function updateCounters(
    requests
  ) {

    const total =
      requests.length;


    const pending =
      requests.filter(
        request =>
          normalizeStatus(
            request.status
          ) ===
          "pending-approval"
      ).length;


    const inProgress =
      requests.filter(
        request =>
          normalizeStatus(
            request.status
          ) ===
          "in-progress"
      ).length;


    const completed =
      requests.filter(
        request =>
          normalizeStatus(
            request.status
          ) ===
          "completed"
      ).length;


    if (totalCount) {
      totalCount.textContent =
        total;
    }

    if (pendingCount) {
      pendingCount.textContent =
        pending;
    }

    if (progressCount) {
      progressCount.textContent =
        inProgress;
    }

    if (completedCount) {
      completedCount.textContent =
        completed;
    }

  }


  function filterRequests(
    requests
  ) {

    const search =
      String(
        searchInput?.value || ""
      )
        .toLowerCase()
        .trim();


    const selectedStatus =
      statusFilter?.value || "all";


    const selectedPriority =
      priorityFilter?.value || "all";


    return requests.filter(
      request => {

        const requestStatus =
          normalizeStatus(
            request.status
          );


        const requestPriority =
          normalizePriority(
            request.priority
          );


        const searchableText = [

          request.id,

          request.item,

          request.destination,

          request.recipient,

          request.purpose

        ]
          .join(" ")
          .toLowerCase();


        const matchesSearch =
          !search ||
          searchableText.includes(
            search
          );

        const matchesStatus =
          selectedStatus === "all" ||
          requestStatus ===
            selectedStatus;


        const matchesPriority =
          selectedPriority === "all" ||
          requestPriority ===
            selectedPriority;


        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );

      }
    );

  }

  function renderRequests() {

    const allRequests =
      getRequests();

    updateCounters(
      allRequests
    );

    const filteredRequests =
      filterRequests(
        allRequests
      );

    requestList.innerHTML =
      "";

    if (
      allRequests.length === 0
    ) {

      requestList.hidden =
        true;

      if (emptyState) {
        emptyState.hidden =
          false;
      }

      if (filterEmptyState) {
        filterEmptyState.hidden =
          true;
      }

      return;

    }

    requestList.hidden =
      false;

    if (emptyState) {
      emptyState.hidden =
        true;
    }

    if (
      filteredRequests.length === 0
    ) {

      requestList.hidden =
        true;

      if (filterEmptyState) {
        filterEmptyState.hidden =
          false;
      }

      return;

    }


    if (filterEmptyState) {
      filterEmptyState.hidden =
        true;
    }

    filteredRequests.forEach(
      request => {

        requestList.appendChild(
          createRequestElement(
            request
          )
        );

      }
    );

  }
    function openRequestDetails(request) {

    if (!request || !request.id) {
        console.warn(
        "VeriTrail: No valid request was selected."
        );

        return;
    }


    /*
    * Store ONLY the selected request ID.
    *
    * The Request Trail page will then retrieve
    * that exact request from the request list.
    */

    sessionStorage.setItem(
        "vt-selected-request-id",
        request.id
    );


    /*
    * Navigate to Request Trail.
    */

    if (
        typeof window.showView ===
        "function"
    ) {

        window.showView(
        null,
        "req-trail"
        );

    }

    }

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        renderRequests();

      }
    );

  }

  if (statusFilter) {

    statusFilter.addEventListener(
      "change",
      () => {

        renderRequests();

      }
    );

  }

  if (priorityFilter) {

    priorityFilter.addEventListener(
      "change",
      () => {

        renderRequests();

      }
    );

  }

  if (clearFiltersButton) {

    clearFiltersButton.addEventListener(
      "click",
      () => {

        if (searchInput) {
          searchInput.value =
            "";
        }

        if (statusFilter) {
          statusFilter.value =
            "all";
        }

        if (priorityFilter) {
          priorityFilter.value =
            "all";
        }

        renderRequests();

      }
    );

  }

  if (createButton) {

    createButton.addEventListener(
      "click",
      () => {

        if (
          typeof window.showView ===
          "function"
        ) {

          window.showView(
            null,
            "req-create"
          );

        }

      }
    );

  }

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        renderRequests();

      }

    }
  );

  window.addEventListener(
    "storage",
    (event) => {

      if (
        event.key ===
        STORAGE_KEY
      ) {

        renderRequests();

      }

    }
  );

  renderRequests();

  window.refreshOutboundRequests =
    function () {

      renderRequests();

    };

});

document.addEventListener("DOMContentLoaded", () => {

  const detailRequestId =
    document.getElementById(
      "detailRequestId"
    );



  if (!detailRequestId) {
    return;
  }

  const REQUEST_STORAGE_KEY =
    "vt-transfer-requests";

  const SELECTED_REQUEST_KEY =
    "vt-selected-request-id";

  function getRequests() {

    try {

      const stored =
        localStorage.getItem(
          REQUEST_STORAGE_KEY
        );


      if (!stored) {
        return [];
      }


      const requests =
        JSON.parse(
          stored
        );


      return Array.isArray(
        requests
      )
        ? requests
        : [];

    } catch (error) {

      console.error(
        "VeriTrail: Unable to load requests.",
        error
      );

      return [];

    }

  }
  function getSelectedRequest() {

    const selectedId =
      sessionStorage.getItem(
        SELECTED_REQUEST_KEY
      );


    if (!selectedId) {

      console.warn(
        "VeriTrail: No request ID selected."
      );

      return null;

    }


    const requests =
      getRequests();


    const request =
      requests.find(
        item =>
          String(item.id) ===
          String(selectedId)
      );


    if (!request) {

      console.warn(
        "VeriTrail: Selected request was not found:",
        selectedId
      );

      return null;

    }


    return request;

  }

  function formatDate(
    value
  ) {

    if (!value) {
      return "Not specified";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );

  }


  function formatDateTime(
    value
  ) {

    if (!value) {
      return "Not specified";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleString(
      "en-PH",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }
    );

  }
  function normalizeStatus(
    status
  ) {

    return String(
      status || ""
    )
      .toLowerCase()
      .replace(/\s+/g, "-");

  }


  function formatStatus(
    status
  ) {

    return String(
      status || "Unknown"
    )
      .replace(/-/g, " ")
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      );

  }

  function setDetail(
    id,
    value
  ) {

    const element =
      document.getElementById(
        id
      );


    if (!element) {
      return;
    }


    element.textContent =
      value ||
      "Not specified";

  }

  function loadRequestTrail() {

    const request =
      getSelectedRequest();


    if (!request) {

      detailRequestId.textContent =
        "Request Not Found";

      setDetail(
        "detailRequestItem",
        "No request was selected."
      );

      return;

    }

    setDetail(
      "detailRequestId",
      request.id
    );


    setDetail(
      "detailRequestItem",
      request.item
    );


    const statusElement =
      document.getElementById(
        "detailRequestStatus"
      );


    if (statusElement) {

      const status =
        request.status ||
        "Pending Approval";


      statusElement.textContent =
        formatStatus(
          status
        );


      statusElement.className =
        `outbound-status ${normalizeStatus(
          status
        )}`;

    }

    setDetail(
      "detailRequestType",
      request.requestType
    );


    setDetail(
      "detailRequestPriority",
      request.priority
    );


    setDetail(
      "detailRequestPurpose",
      request.purpose
    );


    setDetail(
      "detailRequestCreator",
      request.createdBy
    );


    setDetail(
      "detailRequestCreated",
      formatDateTime(
        request.createdAt
      )
    );

    setDetail(
      "detailItem",
      request.item
    );


    setDetail(
      "detailQuantity",
      request.quantity
    );


    setDetail(
      "detailUnit",
      request.unit
    );


    setDetail(
      "detailCondition",
      request.condition
    );


    setDetail(
      "detailItemNotes",
      request.itemNotes ||
      "No item notes provided."
    );

    setDetail(
      "detailDestination",
      request.destination
    );


    setDetail(
      "detailRecipient",
      request.recipient
    );


    setDetail(
      "detailDeliveryDate",
      formatDate(
        request.requestedDate
      )
    );


    setDetail(
      "detailDeliveryMethod",
      request.deliveryMethod
    );


    setDetail(
      "detailDeliveryNotes",
      request.deliveryNotes ||
      "No delivery instructions provided."
    );

    renderTrail(
      request
    );

  }

  function renderTrail(
    request
  ) {

    const trail =
      document.getElementById(
        "requestTrail"
      );


    if (!trail) {
      return;
    }


    trail.innerHTML =
      "";


    const status =
      normalizeStatus(
        request.status
      );


    const stages = [

      {
        title:
          "Request Created",

        description:
          "The transfer request was submitted by the requester."
      },

      {
        title:
          "Pending Approval",

        description:
          "The request is awaiting operational review and approval."
      },

      {
        title:
          "Approved",

        description:
          "The request has been approved for processing."
      },

      {
        title:
          "Handler Assigned",

        description:
          "A handler has been assigned to process the transfer."
      },

      {
        title:
          "Packing / Inspection",

        description:
          "The item is being prepared and checked before handover."
      },

      {
        title:
          "Handover",

        description:
          "The prepared item has been handed over for delivery."
      },

      {
        title:
          "In Transit",

        description:
          "The transfer is currently moving toward its destination."
      },

      {
        title:
          "Received",

        description:
          "The receiver has completed the transfer."
      }

    ];


    let currentIndex =
      1;


    switch (status) {

      case "approved":
        currentIndex = 2;
        break;

      case "handler-assigned":
        currentIndex = 3;
        break;

      case "packing":
      case "inspection":
      case "packing-inspection":
        currentIndex = 4;
        break;

      case "handover":
        currentIndex = 5;
        break;

      case "in-progress":
      case "in-transit":
        currentIndex = 6;
        break;

      case "completed":
      case "received":
        currentIndex = 7;
        break;

      default:
        currentIndex = 1;

    }


    stages.forEach(
      (stage, index) => {

        let state =
          "future";


        if (
          index <
          currentIndex
        ) {

          state =
            "completed";

        }
        else if (
          index ===
          currentIndex
        ) {

          state =
            "current";

        }


        const trailItem =
          document.createElement(
            "div"
          );


        trailItem.className =
          `request-trail-item ${state}`;


        const marker =
          document.createElement(
            "div"
          );


        marker.className =
          "request-trail-marker";


        marker.textContent =
          state === "completed"
            ? "✓"
            : state === "current"
              ? "•"
              : "○";


        const content =
          document.createElement(
            "div"
          );


        content.className =
          "request-trail-content";


        const title =
          document.createElement(
            "h3"
          );


        title.className =
          "request-trail-title";


        title.textContent =
          stage.title;


        const description =
          document.createElement(
            "p"
          );


        description.className =
          "request-trail-description";


        description.textContent =
          stage.description;


        content.appendChild(
          title
        );


        content.appendChild(
          description
        );


        const time =
          document.createElement(
            "span"
          );


        time.className =
          "request-trail-time";


        if (
          index === 0
        ) {

          time.textContent =
            formatDateTime(
              request.createdAt
            );

        }
        else if (
          state ===
          "current"
        ) {

          time.textContent =
            "Current";

        }
        else {

          time.textContent =
            "—";

        }


        trailItem.appendChild(
          marker
        );


        trailItem.appendChild(
          content
        );


        trailItem.appendChild(
          time
        );


        trail.appendChild(
          trailItem
        );

      }
    );

  }

  function backToOutbound() {

    if (
      typeof window.showView ===
      "function"
    ) {

      window.showView(
        null,
        "req-outbound"
      );

    }

  }


  const backButton =
    document.getElementById(
      "backToOutboundRequests"
    );


  const detailBackButton =
    document.getElementById(
      "detailBackButton"
    );


  if (backButton) {

    backButton.addEventListener(
      "click",
      backToOutbound
    );

  }


  if (detailBackButton) {

    detailBackButton.addEventListener(
      "click",
      backToOutbound
    );

  }


  loadRequestTrail();

});


document.addEventListener("DOMContentLoaded", () => {

  const trackingRequestId =
    document.getElementById("trackingRequestId");
    
  if (!trackingRequestId) {
    return;
  }

  const REQUEST_STORAGE_KEY =
    "vt-transfer-requests";

  function getRequests() {

    try {

      const stored =
        localStorage.getItem(
          REQUEST_STORAGE_KEY
        );

      if (!stored) {
        return [];
      }

      const requests =
        JSON.parse(stored);

      return Array.isArray(requests)
        ? requests
        : [];

    } catch (error) {

      console.error(
        "VeriTrail: Unable to load transfer requests.",
        error
      );

      return [];

    }

  }

  function getSelectedRequest() {

    const selectedId =
      sessionStorage.getItem(
        "vt-selected-request-id"
      );


    if (selectedId) {

      const request =
        getRequests().find(
          item =>
            String(item.id) ===
            String(selectedId)
        );


      if (request) {
        return request;
      }

    }

    const requests =
      getRequests();

    return requests.length
      ? requests[0]
      : null;

  }

  function formatDate(value) {

    if (!value) {
      return "Not specified";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }

    return date.toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );

  }

  function formatStatus(value) {

    if (!value) {
      return "Pending";
    }

    return String(value)
      .replace(/-/g, " ")
      .replace(/\b\w/g, letter =>
        letter.toUpperCase()
      );

  }
  function setTrackingValue(
    id,
    value,
    fallback = "Not specified"
  ) {

    const element =
      document.getElementById(id);

    if (!element) {
      return;
    }

    element.textContent =
      value || fallback;

  }

  function loadShipmentTracking() {

    const request =
      getSelectedRequest();


    if (!request) {

      setTrackingValue(
        "trackingRequestId",
        "No Request Selected"
      );

      setTrackingValue(
        "trackingItem",
        "No shipment available"
      );

      setTrackingValue(
        "trackingStatus",
        "Unavailable"
      );

      return;

    }

    setTrackingValue(
      "trackingRequestId",
      request.id
    );


    setTrackingValue(
      "trackingItem",
      request.item
    );


    setTrackingValue(
      "trackingStatus",
      formatStatus(
        request.status ||
        "Pending"
      )
    );

    setTrackingValue(
      "trackingOrigin",
      request.origin ||
      "IT Department"
    );


    setTrackingValue(
      "trackingOriginDetail",
      request.originDetail ||
      "Main Office"
    );

    setTrackingValue(
      "trackingDestination",
      request.destination
    );


    setTrackingValue(
      "trackingDestinationDetail",
      request.destinationDetail ||
      request.recipient ||
      "Receiving Office"
    );

    setTrackingValue(
      "trackingEta",
      formatDate(
        request.requestedDate
      )
    );


    setTrackingValue(
      "trackingEtaTime",
      request.requestedTime ||
      "Delivery schedule pending"
    );

    setTrackingValue(
      "trackingMethod",
      request.deliveryMethod ||
      "Internal Messenger"
    );


    setTrackingValue(
      "trackingCourier",
      request.courierName ||
      "Assigned Messenger"
    );

    setTrackingValue(
      "trackingHandler",
      request.handler ||
      "Not yet assigned"
    );


    setTrackingValue(
      "trackingMessenger",
      request.messenger ||
      "Not yet assigned"
    );


    setTrackingValue(
      "trackingNumber",
      request.trackingNumber ||
      `VT-TRK-${String(
        request.id || ""
      ).replace(
        "VT-2026-",
        ""
      )}`
    );


    setTrackingValue(
      "trackingShipmentType",
      request.deliveryMethod ===
        "Third-Party Courier"
        ? "External Courier"
        : "Internal Transfer"
    );

    const externalNotice =
      document.getElementById(
        "externalCourierNotice"
      );


    if (
      externalNotice &&
      request.deliveryMethod ===
        "Third-Party Courier"
    ) {

      externalNotice.hidden =
        false;


      setTrackingValue(
        "externalCourierName",
        request.courierName ||
        "External Courier"
      );


      setTrackingValue(
        "externalCourierTracking",
        request.trackingNumber ||
        "Tracking number pending"
      );

    }

    const liveIndicator =
      document.getElementById(
        "trackingLiveIndicator"
      );


    if (liveIndicator) {

      const status =
        String(
          request.status || ""
        ).toLowerCase();


      const isTracking =
        status.includes(
          "transit"
        ) ||
        status.includes(
          "progress"
        );


      if (!isTracking) {

        liveIndicator.innerHTML =
          "<span></span> Tracking Preview";

      }

    }

    renderTrackingMilestones(
      request
    );

  }

  function renderTrackingMilestones(
    request
  ) {

    const container =
      document.getElementById(
        "trackingMilestones"
      );


    if (!container) {
      return;
    }


    const status =
      String(
        request.status ||
        "Pending Approval"
      )
        .toLowerCase()
        .replace(/\s+/g, "-");


    const milestones = [

      {
        key: "approved",

        title:
          "Request Approved",

        description:
          "The transfer request was approved for processing."
      },

      {
        key: "prepared",

        title:
          "Item Prepared",

        description:
          "The item was inspected and prepared for handover."
      },

      {
        key: "handover",

        title:
          "Handover",

        description:
          "The item was handed over for delivery."
      },

      {
        key: "transit",

        title:
          "In Transit",

        description:
          "The shipment is currently moving toward its destination."
      },

      {
        key: "received",

        title:
          "Delivered",

        description:
          "The receiver has confirmed receipt of the shipment."
      }

    ];


    let currentIndex = 0;


    if (
      status.includes(
        "approved"
      )
    ) {

      currentIndex = 0;

    }


    if (
      status.includes(
        "handler"
      )
    ) {

      currentIndex = 1;

    }


    if (
      status.includes(
        "packing"
      ) ||
      status.includes(
        "inspection"
      )
    ) {

      currentIndex = 1;

    }


    if (
      status.includes(
        "handover"
      )
    ) {

      currentIndex = 2;

    }


    if (
      status.includes(
        "transit"
      ) ||
      status.includes(
        "progress"
      )
    ) {

      currentIndex = 3;

    }


    if (
      status.includes(
        "received"
      ) ||
      status.includes(
        "completed"
      ) ||
      status.includes(
        "delivered"
      )
    ) {

      currentIndex = 4;

    }


    container.innerHTML = "";


    milestones.forEach(
      (
        milestone,
        index
      ) => {

        let state =
          "future";


        if (
          index <
          currentIndex
        ) {

          state =
            "completed";

        }
        else if (
          index ===
          currentIndex
        ) {

          state =
            "current";

        }


        const item =
          document.createElement(
            "div"
          );


        item.className =
          `tracking-milestone ${state}`;


        const marker =
          document.createElement(
            "div"
          );


        marker.className =
          "tracking-milestone-marker";


        marker.textContent =
          state ===
          "completed"
            ? "✓"
            : state ===
              "current"
              ? "•"
              : "○";


        const content =
          document.createElement(
            "div"
          );


        content.className =
          "tracking-milestone-content";


        const title =
          document.createElement(
            "h3"
          );


        title.textContent =
          milestone.title;


        const description =
          document.createElement(
            "p"
          );


        description.textContent =
          milestone.description;


        content.appendChild(
          title
        );


        content.appendChild(
          description
        );


        const time =
          document.createElement(
            "time"
          );


        if (
          index === 0 &&
          request.approvedAt
        ) {

          time.textContent =
            formatDate(
              request.approvedAt
            );

        }
        else if (
          state ===
          "current"
        ) {

          time.textContent =
            "Current";

        }
        else if (
          state ===
          "completed"
        ) {

          time.textContent =
            "Completed";

        }
        else {

          time.textContent =
            "—";

        }


        item.appendChild(
          marker
        );


        item.appendChild(
          content
        );


        item.appendChild(
          time
        );


        container.appendChild(
          item
        );

      }
    );

  }


  const courierButton =
    document.getElementById(
      "externalCourierButton"
    );


  if (courierButton) {

    courierButton.addEventListener(
      "click",
      () => {

        const request =
          getSelectedRequest();


        if (
          request &&
          request.courierTrackingUrl
        ) {

          window.open(
            request.courierTrackingUrl,
            "_blank",
            "noopener,noreferrer"
          );

        }
        else {

          alert(
            "Courier tracking will be available once the external courier tracking link has been provided."
          );

        }

      }
    );

  }

  window.refreshShipmentTracking =
    function () {

      loadShipmentTracking();

    };

  loadShipmentTracking();

});

document.addEventListener("DOMContentLoaded", () => {
  const disputeList = document.getElementById("disputeRequestList");
  const disputeEmptyState = document.getElementById("disputeEmptyState");
  const disputeSearch = document.getElementById("disputeSearch");
  const disputeStatusFilter = document.getElementById("disputeStatusFilter");
  
  const totalActive = document.getElementById("disputeTotalActive");
  const totalProgress = document.getElementById("disputeTotalProgress");
  const totalResolved = document.getElementById("disputeTotalResolved");
  const totalReplacements = document.getElementById("disputeTotalReplacements");

  if (!disputeList) return;

  function getDisputes() {
    const requests = JSON.parse(localStorage.getItem("vt-transfer-requests") || "[]");
    return requests.filter(req => req.status && req.status.toLowerCase().includes("dispute"));
  }

  function renderDisputes() {
    const disputes = getDisputes();
    disputeList.innerHTML = "";

    if (disputes.length === 0) {
      disputeList.hidden = true;
      if (disputeEmptyState) disputeEmptyState.hidden = false;
      updateCounters([]);
      return;
    }

    disputeList.hidden = false;
    if (disputeEmptyState) disputeEmptyState.hidden = true;

    updateCounters(disputes);

    disputes.forEach(dispute => {
      const item = document.createElement("article");
      item.className = "outbound-request-item";

      item.innerHTML = `
        <div class="outbound-request-main">
          <span class="outbound-request-id">${dispute.id || "VT-INC-000"}</span>
          <h3 class="outbound-request-item-name">${dispute.item || "Disputed Asset Transfer"}</h3>
        </div>
        <div class="outbound-request-meta">
          <span class="outbound-request-meta-label">Destination</span>
          <span class="outbound-request-meta-value">${dispute.destination || "Headquarters"}</span>
        </div>
        <div class="outbound-request-meta">
          <span class="outbound-request-meta-label">Reported Issue</span>
          <span class="outbound-request-meta-value">${dispute.itemNotes || "Receiver inspection anomaly"}</span>
        </div>
        <div>
          <span class="outbound-status warning">Disputed</span>
        </div>
        <div class="outbound-request-action">
          <button type="button" class="outbound-request-view" onclick="showView(null, 'req-trail')">View Trail</button>
        </div>
      `;

      disputeList.appendChild(item);
    });
  }

  function updateCounters(disputes) {
    if (totalActive) totalActive.textContent = disputes.length;
    if (totalProgress) totalProgress.textContent = "0";
    if (totalResolved) totalResolved.textContent = "0";
    if (totalReplacements) totalReplacements.textContent = "0";
  }

  renderDisputes();
});

document.addEventListener("DOMContentLoaded", () => {
  const supportForm = document.getElementById("supportTicketForm");
  const supportStatus = document.getElementById("supportStatus");
  const supportTicketList = document.getElementById("supportTicketList");

  if (!supportForm) return;

  const STORAGE_KEY = "vt-support-tickets";

  function getTickets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveTicket(ticket) {
    const tickets = getTickets();
    tickets.unshift(ticket);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }

  function renderTickets() {
    const tickets = getTickets();
    if (tickets.length === 0) return; 

    supportTicketList.innerHTML = "";
    tickets.forEach(t => {
      const card = document.createElement("article");
      card.className = "request-card";
      card.innerHTML = `
        <div class="request-main">
          <div class="request-heading">
            <strong>${t.id}</strong>
            <span class="status-badge active">Open</span>
          </div>
          <p>${t.subject}</p>
        </div>
        <div class="request-meta">
          <div>
            <span>Category</span>
            <strong>${t.category}</strong>
          </div>
          <div>
            <span>Priority</span>
            <strong>${t.priority}</strong>
          </div>
        </div>
      `;
      supportTicketList.appendChild(card);
    });
  }

  supportForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const category = document.getElementById("supportCategory").value;
    const priority = document.getElementById("supportPriority").value;
    const subject = document.getElementById("supportSubject").value.trim();
    const description = document.getElementById("supportDescription").value.trim();

    if (!category || !subject || !description) {
      supportStatus.textContent = "Please fill out all required fields.";
      supportStatus.className = "form-status visible error";
      return;
    }

    const newTicket = {
      id: "SUP-2026-" + String(Math.floor(Math.random() * 9000) + 1000),
      category,
      priority,
      subject,
      description,
      createdAt: new Date().toISOString()
    };

    saveTicket(newTicket);

    supportStatus.textContent = `Support ticket ${newTicket.id} has been successfully submitted. IT support will review your inquiry.`;
    supportStatus.className = "form-status visible success";

    supportForm.reset();
    renderTickets();
  });

  renderTickets();
});

document.addEventListener("DOMContentLoaded", () => {
  const activeWorkspace = localStorage.getItem("vt-workspace") || "requester";
  const userRoleElement = document.getElementById("userRole");
  
  if (userRoleElement) {
    userRoleElement.textContent = activeWorkspace.charAt(0).toUpperCase() + activeWorkspace.slice(1);
  }
});
