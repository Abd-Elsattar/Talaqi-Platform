using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Embeddings;
using Talaqi.Application.Rag.Embeddings;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;
using Talaqi.Domain.Rag.Embeddings;
using Talaqi.Infrastructure.Data;
using Talaqi.Infrastructure.Rag.Common;
using Microsoft.EntityFrameworkCore;

namespace Talaqi.Infrastructure.Rag.Embeddings
{
    /// <summary>
    /// Embedding service using OpenAI text-embedding-3-small.
    /// </summary>
    public class EmbeddingService : IEmbeddingService
    {
        private readonly EmbeddingClient _client;
        private readonly ApplicationDbContext _db;
        private readonly ILogger<EmbeddingService> _logger;

        public EmbeddingService(IConfiguration config, ApplicationDbContext db, ILogger<EmbeddingService> logger)
        {
            _db = db;
            _logger = logger;
            var apiKey = config["OpenAI:ApiKey"] ?? throw new InvalidOperationException("Missing OpenAI API Key");
            _client = new EmbeddingClient(model: "text-embedding-3-small", apiKey: apiKey);
        }

        public async Task<float[]> GenerateEmbeddingAsync(string text)
        {
            var response = await _client.GenerateEmbeddingAsync(TextNormalizer.Normalize(text));
            return response.Value.ToFloats().ToArray();
        }

        public async Task UpsertItemEmbeddingAsync(ItemBase item, string itemType)
        {
            var category = item.Category.ToString();
            var city = item.Location.City;
            var governorate = item.Location.Governorate;
            var normalizedText = TextNormalizer.BuildItemText(item.Title, item.Description, category, city, governorate);
            var vector = await GenerateEmbeddingAsync(normalizedText);

            var existing = await _db.ItemEmbeddings.FirstOrDefaultAsync(x => x.ItemId == item.Id && x.ItemType == itemType);
            if (existing == null)
            {
                existing = new ItemEmbedding
                {
                    Id = Guid.NewGuid(),
                    ItemId = item.Id,
                    ItemType = itemType,
                };
                _db.ItemEmbeddings.Add(existing);
            }

            existing.Category = category;
            existing.City = city;
            existing.Governorate = governorate;
            existing.NormalizedText = normalizedText;
            existing.Embedding = vector;
            existing.LastUpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
        }

        public async Task BulkRefreshAsync(CancellationToken ct)
        {
            // Refresh Lost items
            await foreach (var lost in _db.LostItems.AsNoTracking().Where(x => !x.IsDeleted).AsAsyncEnumerable().WithCancellation(ct))
            {
                try { await UpsertItemEmbeddingAsync(lost, "Lost"); }
                catch (Exception ex) { _logger.LogError(ex, "Failed to refresh LostItem {Id}", lost.Id); }
            }

            // Refresh Found items
            await foreach (var found in _db.FoundItems.AsNoTracking().Where(x => !x.IsDeleted).AsAsyncEnumerable().WithCancellation(ct))
            {
                try { await UpsertItemEmbeddingAsync(found, "Found"); }
                catch (Exception ex) { _logger.LogError(ex, "Failed to refresh FoundItem {Id}", found.Id); }
            }

            // Refresh Platform Knowledge entries
            await foreach (var doc in _db.PlatformKnowledge.AsNoTracking().Where(x => !x.IsDeleted).AsAsyncEnumerable().WithCancellation(ct))
            {
                try
                {
                    var normalized = TextNormalizer.Normalize(doc.Title + "\n" + doc.Content + "\n" + doc.Category);
                    var vector = await GenerateEmbeddingAsync(normalized);
                    var existing = await _db.PlatformKnowledgeEmbeddings.FirstOrDefaultAsync(x => x.KnowledgeId == doc.Id, ct);
                    if (existing == null)
                    {
                        existing = new PlatformKnowledgeEmbedding
                        {
                            Id = Guid.NewGuid(),
                            KnowledgeId = doc.Id
                        };
                        _db.PlatformKnowledgeEmbeddings.Add(existing);
                    }
                    existing.Category = doc.Category;
                    existing.NormalizedText = normalized;
                    existing.Embedding = vector;
                    existing.LastUpdatedAt = DateTime.UtcNow;
                    await _db.SaveChangesAsync(ct);
                }
                catch (Exception ex) { _logger.LogError(ex, "Failed to refresh PlatformKnowledge {Id}", doc.Id); }
            }
        }

        public async Task RemoveItemEmbeddingAsync(Guid itemId, string itemType)
        {
            var existing = await _db.ItemEmbeddings.FirstOrDefaultAsync(x => x.ItemId == itemId && x.ItemType == itemType);
            if (existing != null)
            {
                _db.ItemEmbeddings.Remove(existing);
                await _db.SaveChangesAsync();
            }
        }
    }
}
