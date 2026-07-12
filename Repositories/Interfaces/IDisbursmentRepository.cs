using LOCPS.Models;

namespace LOCPS.Repositories.Interfaces
{
    public interface IDisbursmentRepository : IGenericRepository<Disbursment>
    {
        Task<Disbursment> CreateDisbursmentAsync(Disbursment disbursment);
        Task<Disbursment?> GetDisbursmentByApplicationIdAsync(int applicationId);
        Task<Disbursment> UpdateDisbursmentAsync(Disbursment disbursment);
        Task<IEnumerable<Disbursment>> GetPendingDisbursmentsAsync(DisbursmentStatus status);

    }
}