using Microsoft.AspNetCore.Mvc;
using V.NET.Server.Services;

namespace V.NET.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ShortenController : ControllerBase
    {
        private readonly UrlShortenerService _urlShortenerService;

        public ShortenController(UrlShortenerService urlShortenerService)
        {
            _urlShortenerService = urlShortenerService;
        }

        [HttpPost]
        public async Task<IActionResult> ShortenUrl([FromBody] UrlRequest request)
        {
            if (string.IsNullOrEmpty(request.Url))
            {
                return BadRequest("Invalid URL.");
            }

            var shortUrl = await _urlShortenerService.ShortenUrl(request.Url);
            return Ok(new { ShortUrl = shortUrl });
        }

        [HttpGet("{shortCode}")]
        public async Task<IActionResult> RedirectToLongUrl(string shortCode)
        {
            var longUrl = await _urlShortenerService.GetLongUrl(shortCode);
            if (longUrl != null)
            {
                return Redirect(longUrl);
            }
            return NotFound();
        }
    }

    public class UrlRequest
    {
        public string Url { get; set; }
    }

}
