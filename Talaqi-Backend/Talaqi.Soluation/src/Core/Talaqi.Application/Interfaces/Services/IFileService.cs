using Microsoft.AspNetCore.Http;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IFileService
    {
        Task<string?> UploadImageAsync(IFormFile file);
        Task<bool> DeleteImageAsync(string imageUrl);
    }
}
