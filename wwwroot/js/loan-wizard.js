let currentStep = 1;
const totalSteps = 3;

document.addEventListener("DOMContentLoaded", function () {
    const amountSlider = document.getElementById("loanAmountSlider");
    const rateSlider = document.getElementById("loanRateSlider");
    const tenureSlider = document.getElementById("loanTenureSlider");
    const productSelect = document.getElementById("wizardProduct");
    const custSelect = document.getElementById("wizardCustId");

    // 1. Role-based Form State
    const role = localStorage.getItem("locps_demo_role") || "officer";
    if (role === "customer") {
        const selectContainer = document.getElementById("customerSelectContainer");
        const staticContainer = document.getElementById("customerStaticContainer");
        if (selectContainer) selectContainer.classList.add("d-none");
        if (staticContainer) staticContainer.classList.remove("d-none");
        if (custSelect) {
            custSelect.value = "CUST-9011"; // Prefill Rajesh Kumar
        }

        // Lock interest rate slider to prevent customer editing
        if (rateSlider) {
            rateSlider.disabled = true;
            rateSlider.style.opacity = "0.6";
            rateSlider.style.pointerEvents = "none";
            
            // Update labels
            const rateLabel = rateSlider.parentNode.querySelector("label span");
            if (rateLabel) {
                rateLabel.innerHTML = 'Interest Rate (% p.a.) <span class="badge bg-secondary ms-1">Bank Fixed</span>';
            }
        }
    }

    // 1.5. Edit page pre-fill
    const isEditPage = window.location.pathname.toLowerCase().includes("/loan/edit");
    if (isEditPage) {
        const savedProduct = localStorage.getItem("locps_loan_type");
        const savedAmount = localStorage.getItem("locps_loan_amount");
        const savedRate = localStorage.getItem("locps_loan_rate");
        const savedTenure = localStorage.getItem("locps_loan_tenure");

        if (savedProduct && productSelect) {
            productSelect.value = savedProduct;
        }
        if (savedAmount && amountSlider) {
            amountSlider.value = savedAmount;
        }
        if (savedRate && rateSlider) {
            rateSlider.value = savedRate;
        }
        if (savedTenure && tenureSlider) {
            tenureSlider.value = savedTenure;
        }
    }

    // 2. Query/Storage Pre-selection for Product Type
    const urlParams = new URLSearchParams(window.location.search);
    let productType = urlParams.get('type') || localStorage.getItem("locps_preselected_type");
    localStorage.removeItem("locps_preselected_type"); // Clear key

    if (productType && productSelect) {
        if (productType === "home") {
            productSelect.value = "Home Purchase Loan";
        } else if (productType === "car") {
            productSelect.value = "Car Purchase Loan";
        } else if (productType === "personal") {
            productSelect.value = "Personal Express Loan";
        }
        
        // Update rate slider from chosen product rate
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const baseRate = parseFloat(selectedOption.getAttribute("data-rate"));
        if (rateSlider && !isNaN(baseRate)) {
            rateSlider.value = baseRate;
        }
    }

    // Slider inputs listeners
    if (amountSlider) amountSlider.addEventListener("input", updateCalculations);
    if (rateSlider) rateSlider.addEventListener("input", updateCalculations);
    if (tenureSlider) tenureSlider.addEventListener("input", updateCalculations);
    
    if (productSelect) {
        productSelect.addEventListener("change", function () {
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            const baseRate = parseFloat(selectedOption.getAttribute("data-rate"));
            if (rateSlider && !isNaN(baseRate)) {
                rateSlider.value = baseRate;
                updateCalculations();
            }
        });
    }

    // Initial run
    updateCalculations();
});

function updateCalculations() {
    const amountSlider = document.getElementById("loanAmountSlider");
    const rateSlider = document.getElementById("loanRateSlider");
    const tenureSlider = document.getElementById("loanTenureSlider");

    if (!amountSlider || !rateSlider || !tenureSlider) return;

    const principal = parseInt(amountSlider.value);
    const annualRate = parseFloat(rateSlider.value);
    const tenure = parseInt(tenureSlider.value);

    // Update slider displays
    document.getElementById("amountValDisplay").textContent = `₹ ${principal.toLocaleString('en-IN')}`;
    document.getElementById("rateValDisplay").textContent = `${annualRate.toFixed(1)}%`;
    document.getElementById("tenureValDisplay").textContent = `${tenure} Months`;

    // Compute EMI metrics
    const results = computeEMI(principal, annualRate, tenure);

    // Update display card
    document.getElementById("emiVal").textContent = `₹ ${results.emi.toLocaleString('en-IN')}`;
    document.getElementById("emiPrincipal").textContent = `₹ ${principal.toLocaleString('en-IN')}`;
    document.getElementById("emiInterest").textContent = `₹ ${results.totalInterest.toLocaleString('en-IN')}`;
    document.getElementById("emiTotal").textContent = `₹ ${results.totalPayable.toLocaleString('en-IN')}`;

    // Update Summary variables for Step 3 preview
    const custSelect = document.getElementById("wizardCustId");
    const productSelect = document.getElementById("wizardProduct");
    const purposeInput = document.getElementById("wizardPurpose");

    if (custSelect && productSelect) {
        document.getElementById("sumCustomer").textContent = custSelect.options[custSelect.selectedIndex].text;
        document.getElementById("sumProduct").textContent = productSelect.value + (purposeInput.value ? ` (${purposeInput.value})` : "");
        document.getElementById("sumAmount").textContent = `₹ ${principal.toLocaleString('en-IN')}`;
        document.getElementById("sumRateTenure").textContent = `${annualRate.toFixed(1)}% for ${tenure} Months (Est. EMI: ₹ ${results.emi.toLocaleString('en-IN')}/mo)`;
    }
}

function navigateStep(direction) {
    // Basic Form validation before moving forward
    if (direction === 1) {
        if (currentStep === 1) {
            const custSelect = document.getElementById("wizardCustId");
            const purposeInput = document.getElementById("wizardPurpose");
            if (!custSelect.value || !purposeInput.value.trim()) {
                showToast("Required Fields", "Please select a customer and provide the loan purpose.", "warning");
                return;
            }
        }
    }

    // Update step index
    currentStep += direction;
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;

    // Toggle View Sections
    document.querySelectorAll(".wizard-step").forEach((el, index) => {
        if (index + 1 === currentStep) {
            el.classList.remove("d-none");
        } else {
            el.classList.add("d-none");
        }
    });

    // Update Headers & Steppers
    const stepTitles = [
        "Step 1: Select Customer & Product",
        "Step 2: Financial Terms & Amortization",
        "Step 3: Verification & Submission"
    ];
    
    document.getElementById("wizardTitle").textContent = stepTitles[currentStep - 1];
    document.getElementById("wizardStepBadge").textContent = `Step ${currentStep} of ${totalSteps}`;
    
    const progressPercent = (currentStep / totalSteps) * 100;
    const progBar = document.getElementById("wizardProgressBar");
    progBar.style.width = `${progressPercent}%`;
    progBar.setAttribute("aria-valuenow", progressPercent);

    // Update Button states
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    if (currentStep === 1) {
        btnPrev.classList.add("d-none");
        btnNext.innerHTML = `Next <i class="fa-solid fa-arrow-right ms-2"></i>`;
        btnNext.type = "button";
    } else if (currentStep === totalSteps) {
        btnPrev.classList.remove("d-none");
        btnNext.innerHTML = `<i class="fa-solid fa-cloud-arrow-up me-2"></i> Submit Application`;
        btnNext.type = "submit";
    } else {
        btnPrev.classList.remove("d-none");
        btnNext.innerHTML = `Next <i class="fa-solid fa-arrow-right ms-2"></i>`;
        btnNext.type = "button";
    }
}

function handleWizardSubmit(e) {
    e.preventDefault();
    const btnNext = document.getElementById("btnNext");
    const declCheck = document.getElementById("declarationCheck");

    if (!declCheck.checked) {
        showToast("Agreement Required", "Please review and check the declaration statement.", "warning");
        return;
    }

    // Save wizard details
    const productSelect = document.getElementById("wizardProduct");
    const amountSlider = document.getElementById("loanAmountSlider");
    const rateSlider = document.getElementById("loanRateSlider");
    const tenureSlider = document.getElementById("loanTenureSlider");

    if (productSelect) localStorage.setItem("locps_loan_type", productSelect.value);
    if (amountSlider) localStorage.setItem("locps_loan_amount", amountSlider.value);
    if (rateSlider) localStorage.setItem("locps_loan_rate", rateSlider.value);
    if (tenureSlider) localStorage.setItem("locps_loan_tenure", tenureSlider.value);
    // Reset state to submitted
    localStorage.setItem("locps_application_state", "submitted");
    if (window.logWorkflowAction) {
        window.logWorkflowAction("Loan Application Submission", "LOC-9844-32");
    }

    btnNext.disabled = true;
    btnNext.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Submitting...`;

    setTimeout(() => {
        showToast("Application Created", "Application #LOC-9844-32 has been recorded in pending state.", "success");
        setTimeout(() => {
            // Forward user directly to the Document Upload page for this new application
            window.location.href = "/Document/Upload/9844";
        }, 1200);
    }, 1000);
}
