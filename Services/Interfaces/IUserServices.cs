using LOCPS.Repositories.Interfaces;
using LOCPS.Models;
using LOCPS.Enums;
namespace LOCPS.Services.Interfaces
{
    public interface IUserServices
    {
        Task<User> RegisterUserAsync(User user);
        Task<User?> LoginAsync(string email, string password);
        Task<User?> GetUserByIdAsync(int userId);

        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<IEnumerable<User>> GetUserByRoleAsync(Roles Role);
        Task<User> UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(int userId);
        Task<bool> ChangePasswordAsync(int userId, string OldPassord, string newPassword);
        Task<bool> AssignRoleAsync(int userId, int roleId);
     }
}
