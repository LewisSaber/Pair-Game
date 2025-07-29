using Microsoft.AspNetCore.Identity;


namespace PairGame.Server.models
{
    public class ApplicationUser : IdentityUser
    {
        public int Coins { get; set; } = 0;

    }
}
