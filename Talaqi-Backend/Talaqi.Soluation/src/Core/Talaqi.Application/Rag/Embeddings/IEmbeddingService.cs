using Talaqi.Domain.Entities;
using Talaqi.Domain.Rag.Embeddings;

namespace Talaqi.Application.Rag.Embeddings
{
    public interface IEmbeddingService
    {
        Task<float[]> GenerateEmbeddingAsync(string text);
        Task UpsertItemEmbeddingAsync(ItemBase item, string itemType);
        Task BulkRefreshAsync(CancellationToken ct);
        Task RemoveItemEmbeddingAsync(Guid itemId, string itemType);
    }
}
