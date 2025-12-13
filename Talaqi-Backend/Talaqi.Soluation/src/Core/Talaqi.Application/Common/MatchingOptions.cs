using Talaqi.Domain.Enums;

namespace Talaqi.Application.Common
{
    public class MatchingOptions
    {
        public int TopNExpose { get; set; } = 5;
        public int MaxCandidatesPerItem { get; set; } = 50;
        public int MaxDateWindowDays { get; set; } = 60;
        public Dictionary<ItemCategory, decimal> CandidateThresholds { get; set; } = new()
        {
            { ItemCategory.People, 30m },
            { ItemCategory.Pets, 28m },
            { ItemCategory.PersonalBelongings, 25m }
        };
        public Dictionary<ItemCategory, decimal> PromotionThresholds { get; set; } = new()
        {
            { ItemCategory.People, 55m },
            { ItemCategory.Pets, 50m },
            { ItemCategory.PersonalBelongings, 52m }
        };
        public Dictionary<ItemCategory, (decimal Keywords, decimal Location, decimal Date)> Weights { get; set; } = new()
        {
            { ItemCategory.People, (0.45m, 0.35m, 0.20m) },
            { ItemCategory.Pets, (0.50m, 0.40m, 0.10m) },
            { ItemCategory.PersonalBelongings, (0.55m, 0.30m, 0.15m) }
        };
        public bool StrictLocationCountry { get; set; } = false;
        public bool StrictLocationGovernorate { get; set; } = true;
    }
}
