using PairGame.Server.models;

namespace PairGame.Server.Repositories.Interface
{
    public interface IIconRepository
    {
        Task<List<IconSet>> GetByUserIdAsync(string userId);
        Task<IconSet?> GetByIdAsync(int iconSetId);
        Task AddImagesAsync(int iconSetId, List<IconImage> images);
        Task DeleteImagesByIconSetIdAsync(int iconSetId);
        Task DeleteIconSetAsync(int iconSetId);
        Task CreateIconSetAsync(IconSet iconSet);
        Task RemoveImageAsync(int iconSetId, int imageId);
        Task<IconImage> GetImageByIdAsync(int imageId);
        Task<List<IconSet>> GetAllIconSetsAsync();
        Task SaveChangesAsync();
    }
}
