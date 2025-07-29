using Microsoft.EntityFrameworkCore;
using PairGame.Server.models;
using PairGame.Server.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using System.IO;

public class IconService
{
    private readonly IIconRepository _iconRepository;

    public IconService(IIconRepository iconRepository)
    {
        _iconRepository = iconRepository;
    }

    public async Task<IconSet> CreateEmptyIconSetAsync(string name, string userId)
    {
        var iconSet = new IconSet { Name = name, UserId = userId, Images = new List<IconImage>() };
        await _iconRepository.CreateIconSetAsync(iconSet);
        await _iconRepository.SaveChangesAsync();
        return iconSet;
    }

    public async Task RenameIconSetAsync(int iconSetId, string newName, string userId)
    {
        var iconSet = await _iconRepository.GetByIdAsync(iconSetId);
        if (iconSet != null && iconSet.UserId == userId)
        {
            iconSet.Name = newName;
            await _iconRepository.SaveChangesAsync();
        }
    }

    public async Task RemoveImageAsync(int iconSetId, int imageId, string userId)
    {
        var iconSet = await _iconRepository.GetByIdAsync(iconSetId);
        if (iconSet == null || iconSet.UserId != userId)
            return;

        var iconImage = await _iconRepository.GetImageByIdAsync(imageId);
        if (iconImage == null)
            return;

        var absoluteFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", iconImage.FilePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(absoluteFilePath))
        {
            File.Delete(absoluteFilePath);
        }

        await _iconRepository.RemoveImageAsync(iconSetId, imageId);
        await _iconRepository.SaveChangesAsync();
    }

    public async Task<IconImage?> AddImageAsync(int iconSetId, IFormFile file, string userId, string uploadsRoot)
    {
        var iconSet = await _iconRepository.GetByIdAsync(iconSetId);
        if (iconSet == null || iconSet.UserId != userId)
        {
            return null;
        }

        var folder = Path.Combine(uploadsRoot, userId, "iconsets", iconSetId.ToString());
        Directory.CreateDirectory(folder);

        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(folder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativeFilePath = Path.Combine("uploads", userId, "iconsets", iconSetId.ToString(), uniqueFileName)
            .Replace(Path.DirectorySeparatorChar, '/');

        var iconImage = new IconImage
        {
            FilePath = "/" + relativeFilePath
        };
        Console.WriteLine(relativeFilePath);
        await _iconRepository.AddImagesAsync(iconSetId, new List<IconImage> { iconImage });
        await _iconRepository.SaveChangesAsync();
        return iconImage;
    }

    public async Task<List<IconSet>> GetByUserIdAsync(string userId) => await _iconRepository.GetByUserIdAsync(userId);
    public async Task<List<IconSet>> GetAllIconSetsAsync() => await _iconRepository.GetAllIconSetsAsync();

    public async Task<IconSet?> GetByIdAsync(int iconSetId) => await _iconRepository.GetByIdAsync(iconSetId);
}