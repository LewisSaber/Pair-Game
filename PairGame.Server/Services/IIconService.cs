using PairGame.Server.models;

namespace PairGame.Server.Services
{
    public interface IIconService
    {
        Task<IconSet> CreateEmptyIconSetAsync(string name, string userId);
        Task RenameIconSetAsync(int iconSetId, string newName, string userId);
        Task RemoveImageAsync(int iconSetId, int imageId, string userId);
        Task<IconImage?> AddImageAsync(int iconSetId, IFormFile file, string userId, string uploadsRoot);
        Task<List<IconSet>> GetByUserIdAsync(string userId);
        Task<List<IconSet>> GetAllIconSetsAsync();
        Task<IconSet?> GetByIdAsync(int iconSetId);
    }

}
