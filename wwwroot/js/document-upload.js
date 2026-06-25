document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    
    if (!dropZone || !fileInput) return;

    // Drag and drop handlers
    dropZone.addEventListener("dragover", function (e) {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", function () {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", function (e) {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        processFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener("change", function () {
        processFiles(fileInput.files);
        fileInput.value = ""; // Reset input
    });

    dropZone.addEventListener("click", function (e) {
        if (e.target.tagName !== "LABEL" && !e.target.closest("label")) {
            fileInput.click();
        }
    });
});

function processFiles(files) {
    const docCategory = document.getElementById("docCategory");
    const category = docCategory ? docCategory.value : "identity";
    
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            showToast("File Too Large", `"${file.name}" exceeds the 10 MB limit.`, "warning");
            return;
        }
        addFileCard(file, category);
    });
}

function addFileCard(file, category) {
    const filesList = document.getElementById("uploadedFilesList");
    if (!filesList) return;

    const fileId = "file_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    const iconClass = file.type.includes("pdf") ? "fa-file-pdf text-danger" : "fa-file-image text-info";

    const card = document.createElement("div");
    card.className = "p-3 rounded border bg-white d-flex flex-column gap-2";
    card.style.borderRadius = "var(--radius-md)";
    card.id = fileId;
    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2 overflow-hidden">
                <i class="fa-solid ${iconClass} fs-5 flex-shrink-0"></i>
                <div class="overflow-hidden">
                    <div class="fw-semibold text-truncate" style="max-width: 220px; font-size: 0.85rem;">${file.name}</div>
                    <span class="text-muted small">${(file.size / 1024).toFixed(1)} KB &bull; ${category}</span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <span class="badge-status badge-status-processing" id="${fileId}_badge">Uploading</span>
                <button class="btn btn-sm btn-link text-muted p-0" onclick="removeFile('${fileId}')" title="Remove">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        <div class="progress" style="height: 5px; border-radius: 10px;">
            <div class="progress-bar bg-primary" id="${fileId}_prog" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    `;
    filesList.appendChild(card);

    // Simulate upload progress
    simulateUpload(fileId);

    // Update checklist badge
    updateChecklist(category);
}

function simulateUpload(fileId) {
    let progress = 0;
    const progBar = document.getElementById(fileId + "_prog");
    const badge = document.getElementById(fileId + "_badge");
    
    const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            if (progBar) progBar.style.width = "100%";
            if (badge) {
                badge.className = "badge-status badge-status-approved";
                badge.textContent = "Uploaded";
            }
            
            // Show submit button if files are present
            const submitBtn = document.getElementById("btnSubmitDocuments");
            if (submitBtn) submitBtn.classList.remove("d-none");
            
            showToast("File Uploaded", "Document processed and queued for validation.", "success");
        } else {
            if (progBar) progBar.style.width = progress + "%";
        }
    }, 300);
}

function removeFile(fileId) {
    const el = document.getElementById(fileId);
    if (el) {
        el.style.opacity = "0";
        el.style.transition = "opacity 0.3s";
        setTimeout(() => el.remove(), 300);
    }
}

function updateChecklist(category) {
    const map = {
        identity: "chk-identity",
        income: "chk-income",
        bank: "chk-bank",
        property: "chk-property",
        employer: "chk-employer"
    };
    const id = map[category];
    if (!id) return;
    
    const badge = document.getElementById(id);
    if (badge) {
        badge.className = "badge-status badge-status-approved";
        badge.textContent = "Uploaded";
    }
}

function finalizeDocuments() {
    const btn = document.getElementById("btnSubmitDocuments");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Submitting...`;
    
    setTimeout(() => {
        const role = localStorage.getItem("locps_demo_role") || "officer";
        localStorage.setItem("locps_application_state", "submitted");
        if (window.logWorkflowAction) {
            window.logWorkflowAction("Document Upload", "LOC-9844-32");
        }
        showToast("Documents Submitted", "All documents queued for validation desk review.", "success");
        setTimeout(() => {
            if (role === "customer") {
                window.location.href = "/Dashboard";
            } else {
                window.location.href = "/Document/Validate/9844";
            }
        }, 1200);
    }, 1000);
}
