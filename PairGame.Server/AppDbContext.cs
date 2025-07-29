using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PairGame.Server.models;

namespace PairGame.Server
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<IconSet> IconSets { get; set; }
        public DbSet<IconImage> IconImages { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
            
        }
    }
}
