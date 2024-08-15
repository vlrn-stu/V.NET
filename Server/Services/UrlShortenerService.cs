using Microsoft.EntityFrameworkCore;
using V.NET.Server.Database;
using V.NET.Shared.Models;

namespace V.NET.Server.Services
{

    public class UrlShortenerService(UrlShortenerContext context)
    {
        private readonly UrlShortenerContext _context = context;

        public async Task<string> ShortenUrl(string longUrl)
        {
            // Generate a short code (could be improved with custom logic)
            var shortCode = Guid.NewGuid().ToString().Substring(0, 6);

            // Save the mapping to the database
            var urlMapping = new UrlMapping
            {
                OriginalUrl = longUrl,
                ShortCode = shortCode,
                CreatedAt = DateTime.UtcNow
            };

            _context.UrlMappings.Add(urlMapping);
            await _context.SaveChangesAsync();

            return $"https://valrina.com/{shortCode}";
        }

        public async Task<string> GetLongUrl(string shortCode)
        {
            var urlMapping = await _context.UrlMappings
                .FirstOrDefaultAsync(u => u.ShortCode == shortCode);

            return urlMapping is null ? throw new Exception("Well shit...") : urlMapping.OriginalUrl;
        }
    }

}
