let currentModalConfirmCallback = null;
let currentModalCancelCallback = null;
let bsConfirmationModal = null;

function showConfirmationModal(title, body, confirmCallback, cancelCallback = null) {
    const modalEl = document.getElementById("confirmationModal");
    if (!modalEl) return;

    document.getElementById("confirmationModalTitle").textContent = title;
    document.getElementById("confirmationModalBody").innerHTML = body;

    currentModalConfirmCallback = confirmCallback;
    currentModalCancelCallback = cancelCallback;

    if (!bsConfirmationModal) {
        bsConfirmationModal = new bootstrap.Modal(modalEl);
    }

    bsConfirmationModal.show();
}

document.addEventListener("DOMContentLoaded", function () {
    const confirmBtn = document.getElementById("confirmationModalConfirmBtn");
    const cancelBtn = document.getElementById("confirmationModalCancelBtn");

    if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
            if (bsConfirmationModal) {
                bsConfirmationModal.hide();
            }
            if (typeof currentModalConfirmCallback === "function") {
                currentModalConfirmCallback();
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            if (typeof currentModalCancelCallback === "function") {
                currentModalCancelCallback();
            }
        });
    }
});
