using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PairGame.Server.models;
using PairGame.Server.Services;
using System.Security.Claims;

namespace PairGame.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IconController : ControllerBase
    {
        private readonly IIconService _iconService;
        private readonly UserManager<ApplicationUser> _userManager;

        public IconController(UserManager<ApplicationUser> userManager, IIconService iconService)
        {
            _userManager = userManager;
            _iconService = iconService;
        }

        private string? GetCurrentUserName()
        {
            return User?.Identity?.IsAuthenticated == true ? User.Identity?.Name : null;
        }

        [HttpPost("create")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> CreateIconSet([FromBody] string name)
        {
            var username = GetCurrentUserName();
            if (username == null) return Unauthorized();
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();
            var iconSet = await _iconService.CreateEmptyIconSetAsync(name, user.Id);
            return Ok(iconSet);
        }

        [HttpPost("rename")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> RenameIconSet([FromBody] RenameRequestModel request)
        {
            var username = GetCurrentUserName();
            if (username == null) return Unauthorized();
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();
            await _iconService.RenameIconSetAsync(request.Id, request.NewName, user.Id);
            return NoContent();
        }

        [HttpGet("allUser")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetAllUserIconSets()
        {
            var username = GetCurrentUserName();
            if (username == null) return Unauthorized();
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();
            var iconSets = await _iconService.GetByUserIdAsync(user.Id);
            return Ok(iconSets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetIconSetById(int id)
        {
            var iconSet = await _iconService.GetByIdAsync(id);
            if (iconSet == null) return NotFound();
            return Ok(iconSet);
        }

        [HttpPost("addImage")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> AddImage(AddRequestModel request)
        {
            var username = GetCurrentUserName();
            if (username == null) return Unauthorized();
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();
            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            if (request.Image == null || request.Image.Length == 0) return BadRequest("No file uploaded.");
            var newImage = await _iconService.AddImageAsync(request.IconSetId, request.Image, user.Id, uploadsRoot);
            if (newImage != null) return Ok(newImage);
            return Unauthorized();
        }

        [HttpDelete("removeImage")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> RemoveImage([FromBody] RemoveRequestModel request)
        {
            var username = GetCurrentUserName();
            if (username == null) return Unauthorized();
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();
            await _iconService.RemoveImageAsync(request.IconSetId, request.ImageId, user.Id);
            return NoContent();
        }

        [HttpGet("allIcons")]
        public async Task<IActionResult> GetAllIconSets()
        {
            var iconSets = await _iconService.GetAllIconSetsAsync();
            return Ok(iconSets);
        }
    }
}

public class RenameRequestModel
{
    public int Id { get; set; }
    public string NewName { get; set; }
}

public class AddRequestModel
{
    public int IconSetId { get; set; }
    public IFormFile Image { get; set; }
}

public class RemoveRequestModel
{
    public int IconSetId { get; set; }
    public int ImageId { get; set; }
}
