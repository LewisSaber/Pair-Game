using Microsoft.EntityFrameworkCore;
using PairGame.Server.models;
using PairGame.Server.Repositories.Interface;

namespace PairGame.Server.Repositories.Implementation
{
    public class IconRepository : IIconRepository
    {
        private readonly AppDbContext _context;

        public IconRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<IconSet>> GetByUserIdAsync(string userId)
        {
            return await _context.IconSets
                .Where(i => i.UserId == userId)
                .Include(i => i.Images)
                .ToListAsync();
        }

        public async Task<IconSet?> GetByIdAsync(int iconSetId)
        {
            return await _context.IconSets
                .Include(i => i.Images)
                .FirstOrDefaultAsync(i => i.Id == iconSetId);
        }

        public async Task AddImagesAsync(int iconSetId, List<IconImage> images)
        {
            foreach (var image in images)
            {
                image.IconSetId = iconSetId;
                _context.IconImages.Add(image);
            }
            await Task.CompletedTask;
        }

        public async Task DeleteImagesByIconSetIdAsync(int iconSetId)
        {
            var images = _context.IconImages.Where(img => img.IconSetId == iconSetId);
            _context.IconImages.RemoveRange(images);
            await Task.CompletedTask;
        }

        public async Task DeleteIconSetAsync(int iconSetId)
        {
            var iconSet = await _context.IconSets.FindAsync(iconSetId);
            if (iconSet != null)
            {
                _context.IconSets.Remove(iconSet);
            }
        }

        public async Task CreateIconSetAsync(IconSet iconSet)
        {
            _context.IconSets.Add(iconSet);
            await Task.CompletedTask;
        }

        public async Task RemoveImageAsync(int iconSetId, int imageId)
        {
            var image = await _context.IconImages
                .FirstOrDefaultAsync(i => i.IconSetId == iconSetId && i.Id == imageId);
            if (image != null)
            {
                _context.IconImages.Remove(image);
            }
        }

        public async Task<IconImage?> GetImageByIdAsync(int imageId)
        {
            return await _context.IconImages
                
                .FirstOrDefaultAsync(i => i.Id == imageId);
        }

        public async Task<List<IconSet>> GetAllIconSetsAsync()
        {
            return await _context.IconSets
                .Include(s => s.Images) 
                .ToListAsync();
        }


        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
