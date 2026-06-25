document.addEventListener("DOMContentLoaded", function () {
    // Sync localStorage role to cookie locps_demo_role
    let role = localStorage.getItem("locps_demo_role");
    if (!role) {
        // Fallback to cookie
        const cookieValue = document.cookie.split("; ").find(row => row.startsWith("locps_demo_role="));
        role = cookieValue ? cookieValue.split("=")[1] : "officer";
        localStorage.setItem("locps_demo_role", role);
    }
    // Set cookie
    document.cookie = "locps_demo_role=" + role + "; path=/; max-age=31536000; SameSite=Lax";

    const path = window.location.pathname.toLowerCase();

    // Route restriction validator
    function isAllowed(role, path) {
        // Public/Anonymous paths
        if (path === "/" || 
            path.startsWith("/account/login") || 
            path.startsWith("/account/register") || 
            path.startsWith("/account/logout") || 
            path.startsWith("/home") || 
            path.includes("favicon")) {
            return true;
        }

        // 1. Admin Restrictions
        if (role === "admin") {
            // Cannot apply for loans or upload documents
            if (path.startsWith("/loan/create") || path.startsWith("/document/upload")) {
                return false;
            }
            const allowed = [
                "/dashboard", "/product", "/usermanagement", "/settings", "/disbursement/history", "/reports", "/notification"
            ];
            return allowed.some(p => path === p || path.startsWith(p + "/"));
        }

        // 2. Customer Restrictions
        if (role === "customer") {
            // Must not access staff controls
            if (path.startsWith("/customer") || 
                path.startsWith("/kyc") || 
                path.startsWith("/credit") || 
                path.startsWith("/document/validate") || 
                path.startsWith("/approval") || 
                path.startsWith("/disbursement") || 
                path.startsWith("/product") || 
                path.startsWith("/usermanagement") || 
                path.startsWith("/reports")) {
                return false;
            }
            if (path.startsWith("/settings/scoringrules") || path.startsWith("/settings/auditlogs")) {
                return false;
            }
            const allowed = [
                "/dashboard", "/loan/create", "/document/upload", "/notification", "/settings"
            ];
            return allowed.some(p => path === p || path.startsWith(p + "/"));
        }

        // 3. Loan Officer Restrictions
        if (role === "officer") {
            // Must not register customers, apply for loans, approve, reject, or disburse
            if (path.startsWith("/customer/create") || 
                path.startsWith("/loan/create") || 
                path.startsWith("/approval") || 
                path.startsWith("/disbursement")) {
                return false;
            }
            if (path.startsWith("/settings/scoringrules") || path.startsWith("/settings/auditlogs")) {
                return false;
            }
            const allowed = [
                "/dashboard", "/customer", "/loan", "/kyc/verify", "/credit/evaluate", "/document/validate", "/document/upload", "/notification", "/settings"
            ];
            return allowed.some(p => path === p || path.startsWith(p + "/"));
        }

        // 4. Underwriter Restrictions
        if (role === "underwriter") {
            // Must not verify documents, calculate credit scores, register customers, apply for loans
            if (path.startsWith("/customer") || 
                path.startsWith("/loan/create") || 
                path.startsWith("/kyc") || 
                path.startsWith("/credit") || 
                path.startsWith("/document/validate") || 
                path.startsWith("/document/upload")) {
                return false;
            }
            if (path.startsWith("/settings/scoringrules") || path.startsWith("/settings/auditlogs")) {
                return false;
            }
            const allowed = [
                "/dashboard", "/approval", "/disbursement", "/notification", "/settings"
            ];
            return allowed.some(p => path === p || path.startsWith(p + "/"));
        }

        return false;
    }

    if (!isAllowed(role, path)) {
        // Prevent layout content flash
        const pageWrapper = document.querySelector(".page-wrapper") || document.body;
        
        // Show premium Access Denied template view
        document.body.innerHTML = `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #F8FAFC; font-family: 'Inter', sans-serif; padding: 20px;">
                <div style="text-align: center; max-width: 480px; width: 100%; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #E2E8F0;">
                    <div style="width: 64px; height: 64px; background-color: #FEE2E2; color: #EF4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 24px;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h3 style="font-weight: 700; color: #1E293B; margin-bottom: 8px;">Access Denied</h3>
                    <p style="color: #64748B; font-size: 14px; margin-bottom: 24px;">Your current role <strong>(${role.toUpperCase()})</strong> is not authorized to access this module.</p>
                    <a href="/Dashboard" style="display: inline-block; background-color: #1A56DB; color: white; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 24px; border-radius: 6px; transition: background-color 0.2s;">
                        Back to Dashboard
                    </a>
                </div>
            </div>
        `;

        // Redirect user to dashboard
        setTimeout(() => {
            window.location.href = "/Dashboard";
        }, 2200);
    }
});

function getActiveUserName() {
    const role = localStorage.getItem("locps_demo_role") || "officer";
    if (role === "customer") return "Rajesh Kumar";
    if (role === "officer") return "Likhith Kumar";
    if (role === "underwriter") return "Anjali Sharma";
    if (role === "admin") return "System Administrator";
    return "Unknown User";
}

function logWorkflowAction(action, resource, status = "Success") {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const formattedTs = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const user = getActiveUserName();
    
    if (!localStorage.getItem("locps_workflow_logs")) {
        const defaultLogs = [
            { ts: "2026-06-24 23:45:12", user: "Anjali Sharma", action: "Loan Approved", resource: "LOC-9844-32", status: "Success" },
            { ts: "2026-06-24 23:40:08", user: "Likhith Kumar", action: "KYC Verified", resource: "CUST-9011", status: "Success" },
            { ts: "2026-06-24 23:35:55", user: "Likhith Kumar", action: "Document Upload", resource: "LOC-9844-32", status: "Success" },
            { ts: "2026-06-24 23:22:40", user: "Likhith Kumar", action: "Loan Application Created", resource: "LOC-9844-32", status: "Success" },
            { ts: "2026-06-24 23:18:10", user: "Likhith Kumar", action: "Customer Registered", resource: "CUST-9011", status: "Success" },
            { ts: "2026-06-24 23:00:05", user: "System Administrator", action: "Scoring Rules Updated", resource: "Engine Config v2.1", status: "Success" },
            { ts: "2026-06-24 22:55:30", user: "System Administrator", action: "User Account Created", resource: "anjali.s@locps.in", status: "Success" }
        ];
        localStorage.setItem("locps_workflow_logs", JSON.stringify(defaultLogs));
    }
    
    const logs = JSON.parse(localStorage.getItem("locps_workflow_logs"));
    logs.unshift({ ts: formattedTs, user, action, resource, status });
    localStorage.setItem("locps_workflow_logs", JSON.stringify(logs));
}

window.getActiveUserName = getActiveUserName;
window.logWorkflowAction = logWorkflowAction;

