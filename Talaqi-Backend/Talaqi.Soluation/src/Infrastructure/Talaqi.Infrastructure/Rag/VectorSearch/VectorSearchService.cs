using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Rag.VectorSearch;
using Talaqi.Infrastructure.Data;
using Talaqi.Infrastructure.Rag.Common;

namespace Talaqi.Infrastructure.Rag.VectorSearch
{
    public class VectorSearchService : IVectorSearchService
    {
        private readonly ApplicationDbContext _db;
        public VectorSearchService(ApplicationDbContext db) { _db = db; }

        public async Task<List<VectorSearchResultItem>> SearchAsync(VectorSearchRequest request, CancellationToken ct)
        {
            var q = _db.ItemEmbeddings.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(request.Category)) q = q.Where(x => x.Category == request.Category);
            if (!string.IsNullOrWhiteSpace(request.City)) q = q.Where(x => x.City == request.City);
            if (!string.IsNullOrWhiteSpace(request.Governorate)) q = q.Where(x => x.Governorate == request.Governorate);
            if (!string.IsNullOrWhiteSpace(request.ItemType)) q = q.Where(x => x.ItemType == request.ItemType);

            var items = await q.ToListAsync(ct);
            var itemResults = items
                .Select(x => new VectorSearchResultItem
                {
                    ItemId = x.ItemId,
                    ItemType = x.ItemType,
                    NormalizedText = x.NormalizedText,
                    Category = x.Category,
                    City = x.City,
                    Governorate = x.Governorate,
                    Score = CosineSimilarityCalculator.Cosine(request.QueryEmbedding, x.Embedding)
                })
                .ToList();

            // Platform knowledge search
            var pk = await _db.PlatformKnowledgeEmbeddings.AsNoTracking().ToListAsync(ct);
            var pkResults = pk
                .Select(x => new VectorSearchResultItem
                {
                    ItemId = x.KnowledgeId,
                    ItemType = "Platform",
                    NormalizedText = x.NormalizedText,
                    Category = x.Category,
                    City = null,
                    Governorate = null,
                    Score = CosineSimilarityCalculator.Cosine(request.QueryEmbedding, x.Embedding)
                })
                .ToList();

            var results = itemResults
                .Concat(pkResults)
                .OrderByDescending(r => r.Score)
                .Take(request.TopK)
                .ToList();

            return results;
        }
    }
}
