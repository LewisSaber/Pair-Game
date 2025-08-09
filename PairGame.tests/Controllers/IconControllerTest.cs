using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using PairGame.Server.Controllers;
using PairGame.Server.models;
using PairGame.Server.Services;

public class IconControllerTests
{
    private Mock<IIconService> _iconServiceMock;
    private Mock<UserManager<ApplicationUser>> _userManagerMock;

    public IconControllerTests()
    {
        _iconServiceMock = new Mock<IIconService>();
        _userManagerMock = MockUserManager();
    }

    private Mock<UserManager<ApplicationUser>> MockUserManager()
    {
        return new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(), null, null, null, null, null, null, null, null
        );
    }

    private IconController CreateControllerWithUser(string username = null, ApplicationUser user = null)
    {
        var controller = new IconController(_userManagerMock.Object, _iconServiceMock.Object);

        var claims = new List<Claim>();
        if (username != null)
            claims.Add(new Claim(ClaimTypes.Name, username));

        var identity = new ClaimsIdentity(claims, username != null ? "TestAuth" : "");
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
        };

        if (username != null && user != null)
        {
            _userManagerMock
                .Setup(um => um.FindByNameAsync(username))
                .ReturnsAsync(user);
        }

        return controller;
    }

    [Fact]
    public async Task CreateIconSet_ReturnsUnauthorized_IfNotAuthenticated()
    {
        var controller = CreateControllerWithUser();
        var result = await controller.CreateIconSet("TestSet");
        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task CreateIconSet_ReturnsNotFound_IfUserNotFound()
    {
        var controller = CreateControllerWithUser("bob");
        _userManagerMock.Setup(um => um.FindByNameAsync("bob")).ReturnsAsync((ApplicationUser)null);

        var result = await controller.CreateIconSet("TestSet");

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task CreateIconSet_ReturnsOk_WithIconSet()
    {
        var user = new ApplicationUser { Id = "u1", UserName = "bob" };
        var iconSet = new IconSet { Id = 1, Name = "TestSet" };
        _iconServiceMock.Setup(s => s.CreateEmptyIconSetAsync("TestSet", "u1")).ReturnsAsync(iconSet);

        var controller = CreateControllerWithUser("bob", user);

        var result = await controller.CreateIconSet("TestSet") as OkObjectResult;

        Assert.NotNull(result);
        Assert.Equal(iconSet, result.Value);
    }

    [Fact]
    public async Task GetIconSetById_ReturnsNotFound_IfNull()
    {
        _iconServiceMock.Setup(s => s.GetByIdAsync(5)).ReturnsAsync((IconSet)null);

        var controller = CreateControllerWithUser();

        var result = await controller.GetIconSetById(5);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetIconSetById_ReturnsOk_IfFound()
    {
        var iconSet = new IconSet { Id = 5, Name = "Found" };
        _iconServiceMock.Setup(s => s.GetByIdAsync(5)).ReturnsAsync(iconSet);

        var controller = CreateControllerWithUser();

        var result = await controller.GetIconSetById(5) as OkObjectResult;

        Assert.NotNull(result);
        Assert.Equal(iconSet, result.Value);
    }

    [Fact]
    public async Task GetAllIconSets_ReturnsOk()
    {
        var sets = new List<IconSet> { new IconSet { Id = 1, Name = "Set1" } };
        _iconServiceMock.Setup(s => s.GetAllIconSetsAsync()).ReturnsAsync(sets);

        var controller = CreateControllerWithUser();

        var result = await controller.GetAllIconSets() as OkObjectResult;

        Assert.NotNull(result);
        Assert.Equal(sets, result.Value);
    }
}
