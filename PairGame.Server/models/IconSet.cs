using System.ComponentModel.DataAnnotations;

namespace PairGame.Server.models
{
    public class IconSet
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public string UserId { get; set; }

        public List<IconImage> Images { get; set; } = new();
    }
}
