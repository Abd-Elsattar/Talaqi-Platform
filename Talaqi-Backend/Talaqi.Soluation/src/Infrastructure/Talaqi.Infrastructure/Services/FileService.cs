using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<FileService> _logger;
        private readonly string _uploadPath;

        public FileService(IConfiguration configuration, ILogger<FileService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        public async Task<string?> UploadImageAsync(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return null;

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                {
                    _logger.LogWarning($"Invalid file extension: {extension}");
                    return null;
                }

                // Validate file size (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    _logger.LogWarning($"File too large: {file.Length} bytes");
                    return null;
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(_uploadPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // IMPORTANT: Return ONLY relative path
                return $"/uploads/{fileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image");
                return null;
            }
        }

        public async Task<bool> DeleteImageAsync(string imageUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(imageUrl))
                    return false;

                // Extract filename from URL
                var fileName = Path.GetFileName(new Uri(imageUrl).LocalPath);
                var filePath = Path.Combine(_uploadPath, fileName);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    _logger.LogInformation($"Deleted file: {fileName}");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image");
                return false;
            }
        }
    }
}
