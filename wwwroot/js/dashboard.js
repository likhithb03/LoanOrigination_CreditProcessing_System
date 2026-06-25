document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem("locps_demo_role") || "officer";
    const appState = localStorage.getItem("locps_application_state") || "submitted";

    // 1. Hide all layout dashboards
    document.getElementById("customerDashboard")?.classList.add("d-none");
    document.getElementById("officerDashboard")?.classList.add("d-none");
    document.getElementById("underwriterDashboard")?.classList.add("d-none");
    document.getElementById("adminDashboard")?.classList.add("d-none");

    // 2. Select and initialize appropriate dashboard view
    if (role === "customer") {
        document.getElementById("customerDashboard")?.classList.remove("d-none");
        initCustomerDashboard(appState);
    } else if (role === "officer") {
        document.getElementById("officerDashboard")?.classList.remove("d-none");
        initOfficerDashboard(appState);
    } else if (role === "underwriter") {
        document.getElementById("underwriterDashboard")?.classList.remove("d-none");
        initUnderwriterDashboard(appState);
    } else if (role === "admin") {
        document.getElementById("adminDashboard")?.classList.remove("d-none");
        initAdminDashboard();
    }
});

// ================= CUSTOMER PORTAL INIT =================
function initCustomerDashboard(state) {
    const progressMap = {
        submitted: { percent: 12.5, steps: 1, badge: "Pending Docs Validation", desc: "Awaiting documents verification check by Loan Officer." },
        verified_docs: { percent: 37.5, steps: 2, badge: "Docs Verified", desc: "Documents accepted. Awaiting credit rating analysis calculation." },
        credit_scored: { percent: 62.5, steps: 3, badge: "Credit Scored", desc: `Credit score generated (CIBIL: ${localStorage.getItem("locps_credit_score_9844") || "785"}). Sent to Underwriter review.` },
        approved: { percent: 87.5, steps: 4, badge: "Sanctioned Approved", desc: "Application approved! Transfer initiation queued by Underwriter." },
        disbursed: { percent: 100, steps: 5, badge: "Funds Disbursed", desc: "Net sanctioned funds successfully transferred to your HDFC account." }
    };

    const cfg = progressMap[state] || progressMap.submitted;

    const loanType = localStorage.getItem("locps_loan_type") || "Home Purchase Loan";
    const loanAmount = localStorage.getItem("locps_loan_amount") ? parseInt(localStorage.getItem("locps_loan_amount")) : 4500000;
    const loanRate = localStorage.getItem("locps_loan_rate") ? parseFloat(localStorage.getItem("locps_loan_rate")) : 8.5;

    const custProductType = document.getElementById("custProductType");
    if (custProductType) custProductType.textContent = loanType;

    const custProductAmount = document.getElementById("custProductAmount");
    if (custProductAmount) custProductAmount.textContent = "₹ " + loanAmount.toLocaleString('en-IN');

    const custSubmissionDate = document.getElementById("custSubmissionDate");
    if (custSubmissionDate) {
        const logs = JSON.parse(localStorage.getItem("locps_workflow_logs") || "[]");
        const submissionLog = logs.find(l => l.action === "Loan Application Submission");
        if (submissionLog) {
            custSubmissionDate.textContent = submissionLog.ts.split(' ')[0];
        }
    }

    // Set stepper nodes active and completed states
    for (let i = 1; i <= 5; i++) {
        const item = document.getElementById(`step${i}_item`);
        if (item) {
            item.classList.remove("active", "completed");
            if (i < cfg.steps) {
                item.classList.add("completed");
            } else if (i === cfg.steps) {
                item.classList.add("active");
            }
        }
    }

    // Update alert information panels
    const badge = document.getElementById("custStatusBadge");
    const desc = document.getElementById("custStatusDetail");
    if (badge) {
        badge.textContent = cfg.badge;
        if (state === "approved" || state === "disbursed") {
            badge.className = "badge bg-success text-white px-3 py-2 fw-semibold";
        } else {
            badge.className = "badge bg-warning text-dark px-3 py-2 fw-semibold";
        }
    }
    if (desc) desc.innerHTML = `<i class="fa-solid fa-circle-info me-1"></i> ${cfg.desc}`;

    // Update checklist badge visibility if not submitted
    const checklistDiv = document.getElementById("docChecklist");
    if (checklistDiv && state !== "submitted") {
        const listItems = checklistDiv.querySelectorAll("span.badge-status-pending");
        listItems.forEach(item => {
            item.className = "badge-status badge-status-approved";
            item.textContent = "Uploaded";
        });
    }

    // Update document checklists labels
    const docBank = document.getElementById("custDocStatusBank");
    const docProp = document.getElementById("custDocStatusProperty");
    if (docBank && docProp) {
        if (state === "submitted") {
            docBank.textContent = "Pending Verification";
            docBank.className = "badge bg-light text-secondary border px-3 py-1";
            docProp.textContent = "Pending Verification";
            docProp.className = "badge bg-light text-secondary border px-3 py-1";
        } else {
            docBank.textContent = "Verified by Staff";
            docBank.className = "badge bg-success bg-opacity-10 text-success border-0 px-3 py-1";
            docProp.textContent = "Verified by Staff";
            docProp.className = "badge bg-success bg-opacity-10 text-success border-0 px-3 py-1";
        }
    }

    // Dynamic Upload Document button visibility
    const uploadBtn = document.getElementById("custUploadDocBtn");
    if (uploadBtn) {
        if (state === "submitted") {
            uploadBtn.classList.remove("d-none");
        } else {
            uploadBtn.classList.add("d-none");
        }
    }

    // Render Notifications
    const notesContainer = document.getElementById("custNotificationContainer");
    if (notesContainer) {
        const notifications = [
            { title: "Application Registered", details: `Application #LOC-9844-32 recorded in submitted queue.`, date: "1 hr ago", icon: "fa-clipboard-list", color: "text-primary" },
            { title: "Identity Docs Submitted", details: "Aadhaar and PAN details parsed successfully.", date: "45 min ago", icon: "fa-id-card", color: "text-info" }
        ];

        if (state !== "submitted") {
            notifications.unshift({ title: "Documents Verified", details: "Loan Officer approved uploaded salary slips and statements.", date: "15 min ago", icon: "fa-file-circle-check", color: "text-success" });
        }
        if (state === "credit_scored" || state === "approved" || state === "disbursed") {
            notifications.unshift({ title: "Credit Score Computed", details: `Scoring rules calculated bureau score: ${localStorage.getItem("locps_credit_score_9844") || "785"}.`, date: "10 min ago", icon: "fa-gauge-high", color: "text-warning" });
        }
        if (state === "approved" || state === "disbursed") {
            notifications.unshift({ title: "Loan Sanction Approved", details: "Underwriter confirmed credit eligibility sanction.", date: "5 min ago", icon: "fa-check-circle", color: "text-success" });
        }
        if (state === "disbursed") {
            notifications.unshift({ title: "Ledger Funds Disbursed", details: "Disbursement transfer executed. Ref: DBR-20260624-9844.", date: "Just now", icon: "fa-money-bill-transfer", color: "text-success" });
        }

        notesContainer.innerHTML = notifications.map(n => `
            <div class="d-flex gap-3 p-3 border-bottom align-items-start">
                <div class="${n.color} mt-1"><i class="fa-solid ${n.icon} fs-5"></i></div>
                <div class="flex-grow-1">
                    <h6 class="fw-bold text-dark mb-0 small">${n.title}</h6>
                    <p class="text-muted mb-0" style="font-size: 0.75rem;">${n.details}</p>
                </div>
                <span class="text-muted small" style="font-size: 0.7rem;">${n.date}</span>
            </div>
        `).join("");
    }

    // Render History Ledger
    const ledgerTable = document.getElementById("custHistoryLedger");
    if (ledgerTable) {
        let statusBadge = `<span class="badge bg-warning text-dark px-3 py-1">Pending</span>`;
        if (state === "approved") statusBadge = `<span class="badge bg-success px-3 py-1">Approved</span>`;
        if (state === "disbursed") statusBadge = `<span class="badge bg-primary px-3 py-1">Disbursed</span>`;

        ledgerTable.innerHTML = `
            <tr>
                <td><span class="fw-bold text-dark">#LOC-9844-32</span></td>
                <td class="fw-semibold">${loanType}</td>
                <td>₹ ${loanAmount.toLocaleString('en-IN')}</td>
                <td>${loanRate.toFixed(1)}% p.a.</td>
                <td>${statusBadge}</td>
            </tr>
            <tr>
                <td><span class="fw-bold text-muted">#LOC-8212-09</span></td>
                <td class="fw-semibold text-muted">Car Purchase Loan</td>
                <td class="text-muted">₹ 15,00,000</td>
                <td class="text-muted">9.2% p.a.</td>
                <td><span class="badge bg-secondary px-3 py-1">Settled</span></td>
            </tr>
        `;
    }
}

// ================= LOAN OFFICER INIT =================
function initOfficerDashboard(state) {
    const docsQueue = document.getElementById("officerDocsQueue");
    const scoringQueue = document.getElementById("officerScoringQueue");
    const completedQueue = document.getElementById("officerCompletedQueue");

    const loanType = localStorage.getItem("locps_loan_type") || "Home Purchase Loan";
    const loanAmount = localStorage.getItem("locps_loan_amount") ? parseInt(localStorage.getItem("locps_loan_amount")) : 4500000;

    if (docsQueue) {
        if (state === "submitted") {
            docsQueue.innerHTML = `
                <tr>
                    <td><span class="fw-bold text-dark">#LOC-9844-32</span></td>
                    <td class="fw-semibold">Rajesh Kumar</td>
                    <td>₹ ${loanAmount.toLocaleString('en-IN')}</td>
                    <td>${loanType}</td>
                    <td><span class="badge bg-warning text-dark px-2">Awaiting Docs Review</span></td>
                    <td class="text-end">
                        <a href="/Document/Validate/9844" class="btn btn-sm btn-primary px-3 fw-semibold">Verify Documents</a>
                    </td>
                </tr>
            `;
        } else {
            docsQueue.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No pending document validations.</td></tr>`;
        }
    }

    if (scoringQueue) {
        if (state === "verified_docs") {
            scoringQueue.innerHTML = `
                <tr>
                    <td><span class="fw-bold text-dark">#LOC-9844-32</span></td>
                    <td class="fw-semibold">Rajesh Kumar</td>
                    <td>₹ ${loanAmount.toLocaleString('en-IN')}</td>
                    <td>${loanType}</td>
                    <td><span class="badge bg-success text-white px-2">All Verified</span></td>
                    <td class="text-end">
                        <a href="/Credit/Evaluate/9844" class="btn btn-sm btn-warning px-3 fw-semibold text-dark">Calculate Score</a>
                    </td>
                </tr>
            `;
        } else {
            scoringQueue.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No pending credit ratings.</td></tr>`;
        }
    }

    if (completedQueue) {
        if (state === "credit_scored" || state === "approved" || state === "disbursed") {
            const score = parseInt(localStorage.getItem("locps_credit_score_9844") || "785");
            let scoreColor = "text-success";
            if (score >= 750) scoreColor = "text-success";
            else if (score >= 700) scoreColor = "text-info";
            else if (score >= 600) scoreColor = "text-warning";
            else scoreColor = "text-danger";

            completedQueue.innerHTML = `
                <tr>
                    <td><span class="fw-bold text-dark">#LOC-9844-32</span></td>
                    <td class="fw-semibold">Rajesh Kumar</td>
                    <td>₹ ${loanAmount.toLocaleString('en-IN')}</td>
                    <td>${loanType}</td>
                    <td><span class="fw-bold ${scoreColor}">${score}</span></td>
                    <td><span class="badge bg-info text-white px-2">Forwarded to Underwriter</span></td>
                </tr>
            `;
        } else {
            completedQueue.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No applications processed yet.</td></tr>`;
        }
    }
}

// ================= UNDERWRITER INIT =================
function initUnderwriterDashboard(state) {
    const decisionsQueue = document.getElementById("underwriterDecisionsQueue");
    const disbursementsQueue = document.getElementById("underwriterDisbursementsQueue");
    const completedQueue = document.getElementById("underwriterCompletedQueue");

    const loanType = localStorage.getItem("locps_loan_type") || "Home Purchase Loan";
    const loanAmount = localStorage.getItem("locps_loan_amount") ? parseInt(localStorage.getItem("locps_loan_amount")) : 4500000;
    const fee = Math.round(loanAmount * 0.0025);
    const net = loanAmount - fee;

    if (decisionsQueue) {
        if (state === "credit_scored") {
            const score = parseInt(localStorage.getItem("locps_credit_score_9844") || "785");
            let scoreColor = "text-success";
            let riskBadge = '<span class="badge bg-success bg-opacity-10 text-success px-2 border-0">Low Risk</span>';
            if (score >= 750) {
                scoreColor = "text-success";
                riskBadge = '<span class="badge bg-success bg-opacity-10 text-success px-2 border-0">Low Risk</span>';
            } else if (score >= 700) {
                scoreColor = "text-info";
                riskBadge = '<span class="badge bg-info bg-opacity-10 text-info px-2 border-0">Medium-Low Risk</span>';
            } else if (score >= 600) {
                scoreColor = "text-warning";
                riskBadge = '<span class="badge bg-warning bg-opacity-10 text-warning px-2 border-0">Medium Risk</span>';
            } else {
                scoreColor = "text-danger";
                riskBadge = '<span class="badge bg-danger bg-opacity-10 text-danger px-2 border-0">High Risk</span>';
            }

            decisionsQueue.innerHTML = `
                <tr>
                    <td><span class="fw-bold text-dark">#LOC-9844-32</span></td>
                    <td class="fw-semibold">Rajesh Kumar</td>
                    <td>${loanType}</td>
                    <td>₹ ${loanAmount.toLocaleString('en-IN')}</td>
                    <td><span class="fw-bold ${scoreColor}">${score}</span></td>
                    <td>${riskBadge}</td>
                    <td class="text-end">
                        <a href="/Approval/Review/9844" class="btn btn-sm btn-primary px-3 fw-semibold">Review & Decide</a>
                    </td>
                </tr>
            `;
        } else {
            decisionsQueue.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No verified applications awaiting decision.</td></tr>`;
        }
    }

    if (disbursementsQueue) {
        if (state === "approved") {
            disbursementsQueue.innerHTML = `
                <tr>
                    <td><span class="fw-bold text-dark">#LOC-9844-32</span></td>
                    <td class="fw-semibold">Rajesh Kumar</td>
                    <td>${loanType}</td>
                    <td>₹ ${loanAmount.toLocaleString('en-IN')}</td>
                    <td>2026-06-24</td>
                    <td><span class="badge bg-warning text-dark px-2">Pending Transfer</span></td>
                    <td class="text-end">
                        <a href="/Disbursement/Create/9844" class="btn btn-sm btn-success px-3 fw-semibold">Disburse Funds</a>
                    </td>
                </tr>
            `;
        } else {
            disbursementsQueue.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No pending disbursements.</td></tr>`;
        }
    }

    if (completedQueue) {
        if (state === "disbursed") {
            completedQueue.innerHTML = `
                <tr>
                    <td><span class="fw-bold text-dark">#LOC-9844-32</span></td>
                    <td class="fw-semibold">Rajesh Kumar</td>
                    <td>${loanType}</td>
                    <td>₹ ${net.toLocaleString('en-IN')}</td>
                    <td>2026-06-24</td>
                    <td class="small text-muted">DBR-20260624-9844</td>
                    <td><span class="badge bg-success text-white px-2">Settled</span></td>
                </tr>
            `;
        } else {
            completedQueue.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No settled disbursements yet.</td></tr>`;
        }
    }
}

// ================= SYSTEM ADMIN INIT =================
function initAdminDashboard() {
    animateCounter("kpiTotal", 156);
    animateCounter("kpiPending", 23);
    animateCounter("kpiApproved", 89);
    animateCounterText("kpiDisbursed", 142500000, val => "₹ " + (val / 10000000).toFixed(1) + " Cr");

    // Charts
    createDoughnutChart("statusDoughnutChart",
        ["Approved", "Pending", "Under Review", "Rejected", "Disbursed"],
        [89, 23, 18, 12, 14],
        [chartColors.success, chartColors.warning, chartColors.info, chartColors.danger, chartColors.primary]
    );

    createBarChart("monthlyBarChart",
        ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        [
            {
                label: "Applications Received",
                data: [18, 22, 28, 34, 30, 24],
                backgroundColor: chartColors.primaryLight,
                borderColor: chartColors.primary,
                borderWidth: 2,
                borderRadius: 6
            },
            {
                label: "Approved",
                data: [12, 16, 20, 24, 22, 15],
                backgroundColor: chartColors.successLight,
                borderColor: chartColors.success,
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    );
}

// Counter functions
function animateCounter(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const duration = 1000;
    const step = target / (duration / 16);
    
    function tick() {
        current += step;
        if (current >= target) {
            el.textContent = target.toLocaleString("en-IN");
            return;
        }
        el.textContent = Math.floor(current).toLocaleString("en-IN");
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function animateCounterText(elementId, target, formatter) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const duration = 1000;
    const step = target / (duration / 16);
    
    function tick() {
        current += step;
        if (current >= target) {
            el.textContent = formatter(target);
            return;
        }
        el.textContent = formatter(Math.floor(current));
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
