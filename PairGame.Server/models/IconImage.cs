using System.ComponentModel.DataAnnotations;

namespace PairGame.Server.models
{
    public class IconImage
    {
        public int Id { get; set; }

 
        public string FilePath { get; set; }
        [Required]
        public int IconSetId { get; set; }

    }
}
