document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem("locps_demo_role") || "officer";
    const staffPanel = document.getElementById("staffDashboard");
    const customerPanel = document.getElementById("customerDashboard");

    if (role === "customer") {
        if (customerPanel) customerPanel.classList.remove("d-none");
        if (staffPanel) staffPanel.classList.add("d-none");
        return; // Skip loading staff metrics & charts
    }

    if (staffPanel) staffPanel.classList.remove("d-none");
    if (customerPanel) customerPanel.classList.add("d-none");

    // ===== KPI Animated Counters =====
    animateCounter("kpiTotal", 156);
    animateCounter("kpiPending", 23);
    animateCounter("kpiApproved", 89);
    animateCounterText("kpiDisbursed", 142500000, val => "₹ " + (val / 10000000).toFixed(1) + " Cr");

    // ===== Status Distribution Doughnut =====
    createDoughnutChart("statusDoughnutChart",
        ["Approved", "Pending", "Under Review", "Rejected", "Disbursed"],
        [89, 23, 18, 12, 14],
        [chartColors.success, chartColors.warning, chartColors.info, chartColors.danger, chartColors.primary]
    );

    // ===== Monthly Applications Bar Chart =====
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

    // ===== Approval Rate Trend Line =====
    createLineChart("approvalTrendChart",
        ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        [
            {
                label: "Approval Rate (%)",
                data: [66.7, 72.7, 71.4, 70.6, 73.3, 62.5],
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primaryLight,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: "#FFFFFF",
                pointBorderWidth: 2.5
            }
        ]
    );

    // ===== Recent Activity Table =====
    const recentActivity = [
        { appId: "LOC-9844-32", customer: "Rajesh Kumar", amount: "₹ 45,00,000", status: "Under Review", statusClass: "badge-status-processing", updated: "2 min ago" },
        { appId: "LOC-7788-12", customer: "Sunitha Rao", amount: "₹ 5,00,000", status: "Approved", statusClass: "badge-status-approved", updated: "15 min ago" },
        { appId: "LOC-4412-99", customer: "Amit Sharma", amount: "₹ 12,00,000", status: "Pending", statusClass: "badge-status-pending", updated: "1 hr ago" },
        { appId: "LOC-2231-08", customer: "Priya Nair", amount: "₹ 2,50,000", status: "Rejected", statusClass: "badge-status-rejected", updated: "3 hrs ago" },
        { appId: "LOC-1155-77", customer: "Vikram Singh", amount: "₹ 60,00,000", status: "Disbursed", statusClass: "badge-status-approved", updated: "Yesterday" }
    ];

    const tbody = document.getElementById("recentActivityBody");
    if (tbody) {
        tbody.innerHTML = recentActivity.map(r => `
            <tr>
                <td><a href="/Loan/Details/${r.appId.split('-')[1]}" class="fw-bold text-primary text-decoration-none">${r.appId}</a></td>
                <td class="fw-semibold">${r.customer}</td>
                <td>${r.amount}</td>
                <td><span class="badge-status ${r.statusClass}">${r.status}</span></td>
                <td class="text-muted small">${r.updated}</td>
            </tr>
        `).join("");
    }
});

// ===== Animated Number Counter Utility =====
function animateCounter(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const duration = 1500;
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
    const duration = 1500;
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
