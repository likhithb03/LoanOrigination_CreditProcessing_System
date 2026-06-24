function showToast(title, message, type = "success") {
    const container = document.querySelector(".toast-container");
    if (!container) return;

    // Set colors based on type
    let bgHeader = "bg-primary text-white";
    let iconClass = "fa-solid fa-circle-info";
    
    if (type === "success") {
        bgHeader = "bg-success text-white";
        iconClass = "fa-solid fa-circle-check";
    } else if (type === "warning") {
        bgHeader = "bg-warning text-dark";
        iconClass = "fa-solid fa-triangle-exclamation";
    } else if (type === "danger" || type === "error") {
        bgHeader = "bg-danger text-white";
        iconClass = "fa-solid fa-circle-exclamation";
    } else if (type === "info") {
        bgHeader = "bg-info text-white";
        iconClass = "fa-solid fa-circle-info";
    }

    const toastId = "toast_" + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" style="border-radius: var(--radius-md); overflow: hidden;">
            <div class="toast-header ${bgHeader} border-0">
                <i class="${iconClass} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <small>Just now</small>
                <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body bg-white text-dark py-3">
                ${message}
            </div>
        </div>
    `;

    container.insertAdjacentHTML("beforeend", toastHtml);
    const toastEl = document.getElementById(toastId);
    
    const bsToast = new bootstrap.Toast(toastEl, {
        delay: 5000,
        autohide: true
    });
    
    bsToast.show();

    // Remove from DOM when hidden
    toastEl.addEventListener("hidden.bs.toast", function () {
        toastEl.remove();
    });
}

function clearNotifications() {
    const badge = document.getElementById("notifBadge");
    const list = document.getElementById("notificationList");
    
    if (badge) badge.style.display = "none";
    if (list) {
        list.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fa-regular fa-bell-slash fs-4 mb-2 d-block"></i>
                No notifications
            </div>
        `;
    }
    showToast("Inbox Cleared", "All alerts have been cleared.", "info");
}
