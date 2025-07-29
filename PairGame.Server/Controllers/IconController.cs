using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PairGame.Server.models;
using System.Security.Claims;

namespace PairGame.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IconController : ControllerBase
    {
        private readonly IconService _iconService;
        private readonly UserManager<ApplicationUser> _userManager;

        public IconController(UserManager<ApplicationUser> userManager ,IconService iconService)
        {
            _userManager = userManager;
            _iconService = iconService;
        }

        [HttpPost("create")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> CreateIconSet([FromBody] string name)
        {
            var username = User.Identity?.Name;

            if (username == null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();
            var userId = user.Id;
            var iconSet = await _iconService.CreateEmptyIconSetAsync(name, userId);
            return Ok(iconSet);
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("rename")]
        public async Task<IActionResult> RenameIconSet([FromBody] RenameRequestModel request)
        {
            var username = User.Identity?.Name;

            if (username == null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();
            var userId = user.Id;

            await _iconService.RenameIconSetAsync(request.Id, request.NewName, userId);
            return NoContent();
        }


        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("allUser")]
        public async Task<IActionResult> GetAllUserIconSets()
        {
            var username = User.Identity?.Name;

            if (username == null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();
            var userId = user.Id;
            var iconSets = await _iconService.GetByUserIdAsync(userId);
            return Ok(iconSets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetIconSetById(int id)
        {
            var iconSet = await _iconService.GetByIdAsync(id);
            if (iconSet == null) return NotFound();
            return Ok(iconSet);
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("addImage")]
        public async Task<IActionResult> AddImage(AddRequestModel request)
        {
            var username = User.Identity?.Name;

            if (username == null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();
            var userId = user.Id;
            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

            if (request.Image == null || request.Image.Length == 0)
                return BadRequest("No file uploaded.");

            var newImage = await _iconService.AddImageAsync(request.IconSetId, request.Image , userId, uploadsRoot);
            if (newImage != null) return Ok(newImage);
            return Unauthorized();
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpDelete("removeImage")]
        public async Task<IActionResult> RemoveImage([FromBody]  RemoveRequestModel request)
        {
            var username = User.Identity?.Name;

            if (username == null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();
            var userId = user.Id;
            await _iconService.RemoveImageAsync(request.IconSetId, request.ImageId ,userId);
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