document.addEventListener("DOMContentLoaded", function () {
    // 1. Client-Side Route Guard
    const role = localStorage.getItem("locps_demo_role") || "officer";
    const path = window.location.pathname.toLowerCase();

    // Skip check for login page, public landing page, and favicon
    if (path === "/" || path.startsWith("/account/login") || path.startsWith("/home") || path.includes("favicon")) {
        return;
    }

    // Role allowed routing prefixes
    const permissions = {
        customer: [
            "/dashboard",
            "/loan/create",
            "/document/upload",
            "/notification"
        ],
        officer: [
            "/dashboard",
            "/customer",
            "/loan",
            "/kyc/verify",
            "/credit/evaluate",
            "/document/validate",
            "/document/upload",
            "/notification"
        ],
        underwriter: [
            "/dashboard",
            "/approval",
            "/disbursement/create",
            "/disbursement/history",
            "/notification"
        ],
        admin: [
            "/dashboard",
            "/product",
            "/usermanagement",
            "/settings",
            "/disbursement/history",
            "/reports",
            "/notification"
        ]
    };

    const allowedPaths = permissions[role] || [];
    let isAuthorized = false;

    // Validate path matching or subpage prefix matching
    for (const allowed of allowedPaths) {
        if (path === allowed || path.startsWith(allowed + "/")) {
            isAuthorized = true;
            break;
        }
    }

    if (!isAuthorized) {
        // Prevent display of page layout elements
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
                    <a href="/Dashboard" style="display: inline-block; background-color: #0D6EFD; color: white; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 24px; border-radius: 6px; transition: background-color 0.2s;">
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
