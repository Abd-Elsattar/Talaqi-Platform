using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Enums;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Domain.Entities
{
    public class FoundItem : BaseEntity
    {
        public Guid UserId { get; set; }
        public ItemCategory Category { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public Location Location { get; set; } = new();
        public DateTime DateFound { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
        public ItemStatus Status { get; set; } = ItemStatus.Active;
        public string? AIAnalysisData { get; set; } // JSON string

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Match> Matches { get; set; } = new List<Match>();
    }
}
/***************************************************************
 *  FoundItem Entity
 *
 * هنا يا معلم ده الـ Model اللي بيمثل بلاغ "لقينا حاجة" في النظام.
 * يعني المستخدم يلاقي غرض أو شخص أو حيوان وعايز يبلّغ عنه عشان صاحبها يوصل له.
 *
 *  الفرق بين LostItem و FoundItem؟
 * - LostItem = المستخدم خسر حاجة وعايز حد يلاقيها
 * - FoundItem = المستخدم لقى حاجة وعايز يسلمها لصاحبها
 *
 *  ليه نفس خصائص LostItem تقريبًا؟
 * - لأن الاتنين بيمثلوا Objects في نفس الـ Domain لكن من وجهة نظر مختلفة
 * - في Lost بنسجل "DateLost" وفي Found بنسجل "DateFound"
 *
 *  ليه فيه علاقة مع User؟
 * - علشان نعرف مين الشخص اللي بلّغ إنه لقى الحاجة (UserId)
 *
 *  ليه فيه ICollection<Match>؟
 * - لأن الحاجة اللي اتلاقت ممكن تطابق أكتر من LostItem، ومحتاجين نخزن الـ Match Results
 *
 *  ليه AIAnalysisData؟
 * - نفس استخدام LostItem: هنخزن فيه بيانات الـ AI اللي بتحلل الصورة/البيانات
 * - مثلاً: نوع، خصائص، Matching Scores... إلخ
 *
 *  ليه Status Enum؟
 * - عشان نعرف هل الحاجة لسه موجودة ولا اتسلمت ولا اتقفل البلاغ (Active, Closed... إلخ)
 ***************************************************************/