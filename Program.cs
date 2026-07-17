using LOCPS.Data;
using LOCPS.Models;
using LOCPS.Repositories.Implementation;
using LOCPS.Repositories.Interfaces;
using LOCPS.Services.Implementations;
using LOCPS.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<LOCPS.LocpsRoleAuthorizeFilter>();
})
.AddRazorOptions(options =>
{
    options.ViewLocationExpanders.Add(new LOCPS.RoleBasedViewLocationExpander());
});

builder.Services.AddDbContext<LOCPS.Data.AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConn")));

//Repository Layer Dependecy Injection registration

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILoanApplicationRepository, LoanApplicationRepository>();
builder.Services.AddScoped<IApprovalRepository, ApprovalRepository>();
builder.Services.AddScoped<ICreditEvaluationRepository, CreditEvaluationRepository>();
builder.Services.AddScoped<IDisbursmentRepository, DisbursmentRepository>();
builder.Services.AddScoped<IKycRepository, KycRepository>();
builder.Services.AddScoped<ILoanProductRepository, LoanProductRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

//Service Layer Dependecy Injection registration
builder.Services.AddScoped<IUserServices, UserServices>();


var app = builder.Build();

using(var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!context.Role.Any())
    {
        context.Role.AddRange(
                new Role
                {
                    RoleId = 1,
                    Roles = LOCPS.Enums.Roles.Customer
                },
                new Role
                {
                    RoleId = 2,
                    Roles = LOCPS.Enums.Roles.LoanOfficer
                },new Role
                {
                    RoleId = 3,
                    Roles = LOCPS.Enums.Roles.UnderWriter
                },
                new Role
                {
                    RoleId = 4,
                    Roles = LOCPS.Enums.Roles.Admin
                }
            );
    }
}
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
