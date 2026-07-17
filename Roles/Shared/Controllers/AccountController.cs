using LOCPS.Models;
using LOCPS.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LOCPS.Controllers
{
    public class AccountController : Controller
    {
        public readonly IUserServices _userServices;
        public AccountController(IUserServices userServices)
        {
            _userServices = userServices;
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            try
            {
                var user = await _userServices.LoginAsync(email, password);

                // Set role-based cookie based on user's RoleId
                SetRoleCookie(user.RoleId);

                // Redirect to role-specific dashboard
                return RedirectToRoleBasedDashboard(user.RoleId);
            }
            catch(Exception e)
            {
                ViewBag.Error = e.Message;
                return View();
            }
        }

        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        public async Task<IActionResult> Register(User user)
        {
            if (!ModelState.IsValid) return View(user);
            await _userServices.RegisterUserAsync(user);

            return RedirectToAction("Login");
        } 

        public IActionResult Logout()
        {
            Response.Cookies.Delete("locps_demo_role");
            return RedirectToAction("Login");
        }

        private void SetRoleCookie(int roleId)
        {
            // Map RoleId to role string
            // RoleId: 1=Customer, 2=Admin, 3=LoanOfficer, 4=UnderWriter
            string roleString = roleId switch
            {
                1 => "customer",
                2 => "admin",
                3 => "officer",
                4 => "underwriter",
                _ => "customer"
            };

            Response.Cookies.Append("locps_user_role", roleString, new CookieOptions
            {
                Path = "/",
                MaxAge = TimeSpan.FromDays(365),
                SameSite = SameSiteMode.Lax
            });
        }

        private IActionResult RedirectToRoleBasedDashboard(int roleId)
        {
            // Redirect based on RoleId
            // The RoleBasedViewLocationExpander will use the cookie to find the correct view
            // RoleId: 1=Customer, 2=Admin, 3=LoanOfficer, 4=UnderWriter
            return RedirectToAction("Index", "Dashboard");
        }
    }
}
