using Microsoft.EntityFrameworkCore;
using V.NET.Shared.Models;

namespace V.NET.Server.Database
{
    public class UrlShortenerContext(DbContextOptions<UrlShortenerContext> options) : DbContext(options)
    {
        public DbSet<UrlMapping> UrlMappings { get; set; }
    }

}
