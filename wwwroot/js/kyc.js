let panPassed = false;
let aadhaarPassed = false;
let addressPassed = false;

function verifyPanCard() {
    const btn = document.getElementById("btnVerifyPan");
    const badge = document.getElementById("panBadge");
    const circle = document.getElementById("panStatusCircle");
    const icon = document.getElementById("panIcon");

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    
    badge.className = "badge-status badge-status-processing";
    badge.textContent = "Verifying";

    setTimeout(() => {
        btn.style.display = "none";
        badge.className = "badge-status badge-status-approved";
        badge.textContent = "Verified";
        
        circle.className = "rounded-circle d-flex align-items-center justify-content-center border-3 border-success bg-success text-white";
        icon.className = "fa-solid fa-check";
        
        panPassed = true;
        if (window.logWorkflowAction) {
            window.logWorkflowAction("PAN Card Check Passed", "Rajesh Kumar (BKDPK7849D)");
        }
        showToast("PAN Card Match", "Database check matched with PAN registry for Rajesh Kumar.", "success");
        checkAllPassed();
    }, 1200);
}

function sendAadhaarOtp() {
    const actionsContainer = document.getElementById("aadhaarActions");
    const btn = document.getElementById("btnSendOtp");

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...`;

    setTimeout(() => {
        showToast("OTP Sent", "A 6-digit OTP code has been sent to +91 ******3210.", "info");
        
        // Replace actions container with OTP inputs
        actionsContainer.innerHTML = `
            <div class="d-flex align-items-center gap-1">
                <input type="text" id="otpInput" class="form-control form-control-sm text-center shadow-none" placeholder="123456" style="width: 80px;" maxlength="6" />
                <button class="btn btn-sm btn-success" id="btnVerifyOtp" onclick="verifyAadhaarOtp()">Verify</button>
            </div>
        `;
    }, 1000);
}

function verifyAadhaarOtp() {
    const otpInput = document.getElementById("otpInput");
    const btn = document.getElementById("btnVerifyOtp");
    const badge = document.getElementById("aadhaarBadge");
    const circle = document.getElementById("aadhaarStatusCircle");
    const icon = document.getElementById("aadhaarIcon");

    if (!otpInput.value.trim() || otpInput.value.length < 4) {
        showToast("Invalid Input", "Please enter the verification OTP.", "warning");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    
    badge.className = "badge-status badge-status-processing";
    badge.textContent = "Validating";

    setTimeout(() => {
        document.getElementById("aadhaarActions").innerHTML = ""; // Remove inputs
        badge.className = "badge-status badge-status-approved";
        badge.textContent = "Verified";
        
        circle.className = "rounded-circle d-flex align-items-center justify-content-center border-3 border-success bg-success text-white";
        icon.className = "fa-solid fa-check";
        
        aadhaarPassed = true;
        if (window.logWorkflowAction) {
            window.logWorkflowAction("Aadhaar Biometric Check Passed", "Rajesh Kumar");
        }
        showToast("Aadhaar OTP Verified", "UIDAI Biometric authentication completed successfully.", "success");
        checkAllPassed();
    }, 1200);
}

function verifyAddress() {
    const btn = document.getElementById("btnVerifyAddr");
    const badge = document.getElementById("addrBadge");
    const circle = document.getElementById("addrStatusCircle");
    const icon = document.getElementById("addrIcon");

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    
    badge.className = "badge-status badge-status-processing";
    badge.textContent = "Matching";

    setTimeout(() => {
        btn.style.display = "none";
        badge.className = "badge-status badge-status-approved";
        badge.textContent = "Verified";
        
        circle.className = "rounded-circle d-flex align-items-center justify-content-center border-3 border-success bg-success text-white";
        icon.className = "fa-solid fa-check";
        
        addressPassed = true;
        if (window.logWorkflowAction) {
            window.logWorkflowAction("Address Match Check Passed", "Rajesh Kumar Address");
        }
        showToast("Address Match Passed", "Geographical checks and utility bills match index registered.", "success");
        checkAllPassed();
    }, 1200);
}

function checkAllPassed() {
    if (panPassed && aadhaarPassed && addressPassed) {
        const wrapper = document.getElementById("submitKycWrapper");
        if (wrapper) {
            wrapper.classList.remove("d-none");
            wrapper.classList.add("animate__animated", "animate__fadeInUp"); // Simple fade in animation
        }
    }
}

function submitKycCompliance() {
    const btn = document.getElementById("btnSubmitKyc");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving Results...`;

    setTimeout(() => {
        if (window.logWorkflowAction) {
            window.logWorkflowAction("KYC Submission", "CUST-9011");
        }
        showToast("KYC Compliance Completed", "Customer has been marked as fully KYC compliant.", "success");
        setTimeout(() => {
            // Proceed to next logical workflow step: Credit Evaluation
            window.location.href = "/Credit/Evaluate/9844";
        }, 1200);
    }, 1000);
}
