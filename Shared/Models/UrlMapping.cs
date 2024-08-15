namespace V.NET.Shared.Models
{
    public class UrlMapping
    {
        public int Id { get; set; }
        public string OriginalUrl { get; set; } = default!;
        public string ShortCode { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
    }
}
