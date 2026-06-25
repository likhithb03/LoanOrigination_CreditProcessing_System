document.addEventListener("DOMContentLoaded", function () {
    animateCreditScoreGauge();
});

function animateCreditScoreGauge() {
    const scoreValEl = document.getElementById("scoreValue");
    const arcEl = document.getElementById("gaugeProgressArc");
    const riskRatingText = document.getElementById("riskRatingText");

    if (!scoreValEl || !arcEl) return;

    const pathParts = window.location.pathname.split('/');
    const appId = pathParts[pathParts.length - 1] || "9844";
    const storageKey = `locps_credit_score_${appId}`;
    let targetScore = localStorage.getItem(storageKey);
    if (!targetScore) {
        targetScore = Math.floor(Math.random() * (830 - 620 + 1)) + 620;
        localStorage.setItem(storageKey, targetScore);
    } else {
        targetScore = parseInt(targetScore);
    }

    const startScore = 300;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    // Semicircle arc length stroke-dasharray is 282.7
    const dashArrayLength = 282.7;
    
    // Convert score (300 - 900) to percentage (0 - 1)
    const percentage = (targetScore - 300) / (900 - 300); // 80.83%
    const targetOffset = dashArrayLength * (1 - percentage); // 54.2

    function updateGauge(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        
        // Update CIBIL score number text
        const currentScore = Math.floor(startScore + (targetScore - startScore) * easeProgress);
        scoreValEl.textContent = currentScore;
        
        // Update SVG stroke-dashoffset
        const currentOffset = dashArrayLength - (dashArrayLength - targetOffset) * easeProgress;
        arcEl.style.strokeDashoffset = currentOffset;

        if (progress < 1) {
            requestAnimationFrame(updateGauge);
        } else {
            // Animation finished
            scoreValEl.textContent = targetScore;
            arcEl.style.strokeDashoffset = targetOffset;
            
            // Set risk rating label
            let rating = "Fair Risk Profile";
            let colorClass = "text-warning";
            if (targetScore >= 750) {
                rating = "Excellent Risk Profile";
                colorClass = "text-success";
            } else if (targetScore >= 700) {
                rating = "Good Risk Profile";
                colorClass = "text-info";
            } else if (targetScore >= 600) {
                rating = "Fair Risk Profile";
                colorClass = "text-warning";
            } else {
                rating = "Poor Risk Profile";
                colorClass = "text-danger";
            }
            riskRatingText.textContent = rating;
            riskRatingText.className = `score-gauge-lbl ${colorClass} fw-bold fs-6`;
        }
    }

    // Set initial layout values
    arcEl.style.strokeDashoffset = dashArrayLength;
    requestAnimationFrame(updateGauge);
}

function runRulesEngine() {
    const btn = document.getElementById("btnRunRules");
    const badge = document.getElementById("ruleEngineStatus");
    const details = document.getElementById("ruleEngineDetails");

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Validating...`;
    
    badge.className = "badge bg-warning text-dark";
    badge.textContent = "Verifying...";
    details.textContent = "Analyzing DTI boundaries, repayment track index, and collateral valuation limits...";

    const pathParts = window.location.pathname.split('/');
    const appId = pathParts[pathParts.length - 1] || "9844";
    const targetScore = parseInt(localStorage.getItem(`locps_credit_score_${appId}`) || "785");
    
    let tier = "Tier B (Standard Pricing)";
    if (targetScore >= 750) {
        tier = "Tier A (Prime Pricing)";
    } else if (targetScore >= 700) {
        tier = "Tier B (Preferred Pricing)";
    } else if (targetScore >= 600) {
        tier = "Tier C (Standard Pricing)";
    } else {
        tier = "Tier D (Subprime Pricing)";
    }

    setTimeout(() => {
        btn.classList.add("d-none");
        document.getElementById("btnContinueCredit").classList.remove("d-none");
        
        badge.className = "badge bg-success text-white";
        badge.textContent = "Passed";
        
        details.innerHTML = `
            <div class="text-success fw-bold mb-1"><i class="fa-solid fa-circle-check me-1"></i> Engine Analysis: PASSED</div>
            <ul class="mb-0 ps-3 small text-muted">
                <li>DTI ratio (32.4%) is within maximum boundary limit (40.0%).</li>
                <li>Bureau credit rank (${targetScore}) qualifies for ${tier}.</li>
                <li>Audit check matches complete. No default alerts recorded.</li>
            </ul>
        `;
        
        if (window.logWorkflowAction) {
            window.logWorkflowAction("Credit Score Calculation", "LOC-9844-32");
        }
        showToast("Scoring Validation Passed", "Application #LOC-9844-32 has passed automated credit rules.", "success");
    }, 1500);
}

function continueWorkflow() {
    const btn = document.getElementById("btnContinueCredit");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...`;

    setTimeout(() => {
        localStorage.setItem("locps_application_state", "credit_scored");
        if (window.logWorkflowAction) {
            window.logWorkflowAction("Application Forwarded to Underwriter", "LOC-9844-32");
        }
        showToast("Application Scored & Forwarded", "Credit analysis records saved. Application forwarded to Underwriter decision queue.", "success");
        setTimeout(() => {
            window.location.href = "/Dashboard";
        }, 1200);
    }, 1000);
}
