// Chart.js global defaults for LOCPS theme consistency
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = "#6B7280";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 16;

const chartColors = {
    primary: "#1A56DB",
    primaryLight: "rgba(26, 86, 219, 0.15)",
    success: "#10B981",
    successLight: "rgba(16, 185, 129, 0.15)",
    warning: "#F59E0B",
    warningLight: "rgba(245, 158, 11, 0.15)",
    danger: "#EF4444",
    dangerLight: "rgba(239, 68, 68, 0.15)",
    info: "#06B6D4",
    infoLight: "rgba(6, 182, 212, 0.15)",
    navy: "#0B2447",
    navyLight: "rgba(11, 36, 71, 0.15)",
    gray: "#9CA3AF"
};

function createDoughnutChart(canvasId, labels, data, colors) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: "65%",
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

function createBarChart(canvasId, labels, datasets) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
        type: "bar",
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: "rgba(0,0,0,0.04)" },
                    ticks: { stepSize: 10 }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { position: "top" }
            }
        }
    });
}

function createLineChart(canvasId, labels, datasets) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
        type: "line",
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: "rgba(0,0,0,0.04)" },
                    ticks: { callback: val => val + "%" }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { position: "top" }
            }
        }
    });
}
