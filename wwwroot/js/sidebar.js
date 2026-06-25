document.addEventListener("DOMContentLoaded", function () {
    // 1. Collapsible Sidebar Logic
    const toggleSidebarBtn = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    
    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            sidebar.classList.toggle("show");
        });
        
        // Close sidebar if clicking outside on mobile
        document.addEventListener("click", function (e) {
            if (window.innerWidth < 992 && sidebar.classList.contains("show") && !sidebar.contains(e.target) && e.target !== toggleSidebarBtn) {
                sidebar.classList.remove("show");
            }
        });
    }

    // 2. Role Selector Switcher Logic
    const roleSelector = document.getElementById("roleSelector");
    const navSections = document.querySelectorAll(".nav-section");
    const profileName = document.getElementById("userProfileName");
    const profileRole = document.getElementById("userProfileRole");
    const profileInitials = document.getElementById("userProfileInitials");

    // Profile Mock DB
    const roleProfiles = {
        customer: { name: "Rajesh Kumar", role: "Portal Customer", initials: "RK" },
        officer: { name: "Likhith Kumar", role: "Loan Officer", initials: "LO" },
        underwriter: { name: "Anjali Sharma", role: "Senior Underwriter", initials: "UW" },
        admin: { name: "System Administrator", role: "Super Admin", initials: "SA" }
    };

    function applyRoleSettings(role) {
        if (!role) role = "officer";
        
        // Show/hide menu items based on role
        navSections.forEach(section => {
            const allowedRole = section.getAttribute("data-role");
            if (allowedRole === "all") {
                section.style.display = "block";
            } else if (allowedRole === role) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });

        // Update profile labels
        const prof = roleProfiles[role];
        if (prof) {
            if (profileName) profileName.textContent = prof.name;
            if (profileRole) profileRole.textContent = prof.role;
            if (profileInitials) profileInitials.textContent = prof.initials;
        }

        // Hide Audit Trails option in topbar profile menu if not admin
        const auditTrailLink = document.querySelector('a[href="/Settings/AuditLogs"]');
        if (auditTrailLink) {
            if (role === "admin") {
                auditTrailLink.parentNode.style.display = "block";
            } else {
                auditTrailLink.parentNode.style.display = "none";
            }
        }

        // Highlight active link matching the current route
        highlightActiveLink();
    }

    function highlightActiveLink() {
        const path = window.location.pathname.toLowerCase();
        const links = document.querySelectorAll("#sidebar .nav-link-item");
        
        links.forEach(link => {
            link.classList.remove("active");
            const href = link.getAttribute("href").toLowerCase();
            
            // Check exact match or subpage prefix match
            if (path === href || (href !== "/dashboard" && href !== "/" && path.startsWith(href))) {
                link.classList.add("active");
            }
        });
    }

    function syncCookie(role) {
        document.cookie = "locps_demo_role=" + role + "; path=/; max-age=31536000; SameSite=Lax";
    }

    if (roleSelector) {
        // Load initial role from localStorage
        const savedRole = localStorage.getItem("locps_demo_role") || "officer";
        roleSelector.value = savedRole;
        applyRoleSettings(savedRole);
        syncCookie(savedRole);

        roleSelector.addEventListener("change", function () {
            const chosenRole = roleSelector.value;
            localStorage.setItem("locps_demo_role", chosenRole);
            syncCookie(chosenRole);
            applyRoleSettings(chosenRole);
            showToast("System Role Switched", `Switched to ${roleSelector.options[roleSelector.selectedIndex].text}. Refreshing context...`, "info");
            setTimeout(() => {
                window.location.href = "/Dashboard";
            }, 1000);
        });
    } else {
        // Fallback for page without selector
        const savedRole = localStorage.getItem("locps_demo_role") || "officer";
        applyRoleSettings(savedRole);
        syncCookie(savedRole);
    }
});
