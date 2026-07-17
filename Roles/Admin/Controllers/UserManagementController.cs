using LOCPS.Models;
using LOCPS.Services.Interfaces;

using Microsoft.AspNetCore.Mvc;
using LOCPS.Enums;

namespace LOCPS.Controllers
{
    public class UserManagementController : Controller
    {
        private readonly IUserServices _userServices;

        public UserManagementController(IUserServices userServices)
        {
            _userServices = userServices;
        }

        public IActionResult Index() => View();

        public IActionResult Create() => View();

        [HttpPost]
        public async Task<IActionResult> Create(User user, string assignedRole)
        {
            if (!ModelState.IsValid)
                return View(user);

            // Admin can only create Loan Officer (2) or Underwriter (3) accounts
            // Map string role to Roles enum value
            user.RoleId = assignedRole switch
            {
                "officer" => 3,      // LoanOfficer = 3
                "underwriter" => 4,  // UnderWriter = 4
                "admin" => 2,        // Admin = 2
                _ => 3            // Default to Loan Officer
            };

            await _userServices.RegisterUserAsync(user);
            return RedirectToAction("Index");
        }

        public IActionResult Edit(int id) => View();
    }
}
