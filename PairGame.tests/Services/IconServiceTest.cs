using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Moq;
using PairGame.Server.models;
using PairGame.Server.Repositories.Interface;
using PairGame.Server.Services;
using Xunit;

public class IconServiceTests
{
    private readonly Mock<IIconRepository> _mockRepo;
    private readonly IconService _service;

    public IconServiceTests()
    {
        _mockRepo = new Mock<IIconRepository>();
        _service = new IconService(_mockRepo.Object);
    }

    [Fact]
    public async Task CreateEmptyIconSetAsync_ShouldCreateIconSetAndSave()
    {
      
        IconSet createdIconSet = null!;
        _mockRepo.Setup(r => r.CreateIconSetAsync(It.IsAny<IconSet>()))
            .Callback<IconSet>(set => createdIconSet = set)
            .Returns(Task.CompletedTask);
        _mockRepo.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var name = "TestSet";
        var userId = "user1";

     
        var result = await _service.CreateEmptyIconSetAsync(name, userId);

   
        Assert.NotNull(result);
        Assert.Equal(name, result.Name);
        Assert.Equal(userId, result.UserId);
        Assert.Empty(result.Images);
        _mockRepo.Verify(r => r.CreateIconSetAsync(It.IsAny<IconSet>()), Times.Once);
        _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        Assert.Same(createdIconSet, result);
    }

    [Fact]
    public async Task RenameIconSetAsync_UpdatesName_WhenIconSetExistsAndUserMatches()
    {
       
        var iconSet = new IconSet { Id = 1, Name = "OldName", UserId = "user1" };
        _mockRepo.Setup(r => r.GetByIdAsync(iconSet.Id)).ReturnsAsync(iconSet);
        _mockRepo.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var newName = "NewName";

     
        await _service.RenameIconSetAsync(iconSet.Id, newName, "user1");

       
        Assert.Equal(newName, iconSet.Name);
        _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task RenameIconSetAsync_DoesNothing_WhenUserMismatch()
    {
      
        var iconSet = new IconSet { Id = 1, Name = "OldName", UserId = "user1" };
        _mockRepo.Setup(r => r.GetByIdAsync(iconSet.Id)).ReturnsAsync(iconSet);

    
        await _service.RenameIconSetAsync(iconSet.Id, "NewName", "wrongUser");

      
        Assert.Equal("OldName", iconSet.Name);
        _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task RemoveImageAsync_DeletesFileAndRemovesImage_WhenConditionsMet()
    {
        var iconSetId = 1;
        var imageId = 10;
        var userId = "user1";

        var iconSet = new IconSet { Id = iconSetId, UserId = userId };
        var iconImage = new IconImage { Id = imageId, FilePath = "/uploads/user1/iconsets/1/file.png" };

        _mockRepo.Setup(r => r.GetByIdAsync(iconSetId)).ReturnsAsync(iconSet);
        _mockRepo.Setup(r => r.GetImageByIdAsync(imageId)).ReturnsAsync(iconImage);
        _mockRepo.Setup(r => r.RemoveImageAsync(iconSetId, imageId)).Returns(Task.CompletedTask);
        _mockRepo.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "user1", "iconsets", "1");
        Directory.CreateDirectory(directoryPath);  

        var fileFullPath = Path.Combine(directoryPath, "file.png");
        File.WriteAllText(fileFullPath, "test"); 
        Assert.True(File.Exists(fileFullPath));

      
        await _service.RemoveImageAsync(iconSetId, imageId, userId);

     
        Assert.False(File.Exists(fileFullPath));
        _mockRepo.Verify(r => r.RemoveImageAsync(iconSetId, imageId), Times.Once);
        _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task AddImageAsync_ReturnsNull_WhenIconSetNotFoundOrUserMismatch()
    {
       
        _mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((IconSet)null);

        var fileMock = new Mock<IFormFile>();
        var userId = "user1";
        var uploadsRoot = Path.GetTempPath();

      
        var result = await _service.AddImageAsync(1, fileMock.Object, userId, uploadsRoot);

        Assert.Null(result);
    }

    [Fact]
    public async Task AddImageAsync_CreatesFileAndAddsImage_WhenValid()
    {
    
        var iconSetId = 1;
        var userId = "user1";
        var iconSet = new IconSet { Id = iconSetId, UserId = userId };
        _mockRepo.Setup(r => r.GetByIdAsync(iconSetId)).ReturnsAsync(iconSet);
        _mockRepo.Setup(r => r.AddImagesAsync(iconSetId, It.IsAny<List<IconImage>>())).Returns(Task.CompletedTask);
        _mockRepo.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var uploadsRoot = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(uploadsRoot);

        var content = "Fake image content";
        var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(content));
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.FileName).Returns("test.png");
        fileMock.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), default)).Returns<Stream, System.Threading.CancellationToken>((s, _) =>
        {
            stream.Position = 0;
            return stream.CopyToAsync(s);
        });

        var result = await _service.AddImageAsync(iconSetId, fileMock.Object, userId, uploadsRoot);

     
        Assert.NotNull(result);
        Assert.StartsWith("/uploads/", result.FilePath);
        Assert.True(Directory.Exists(Path.Combine(uploadsRoot, userId, "iconsets", iconSetId.ToString())));

      
        Directory.Delete(uploadsRoot, true);
    }
}
