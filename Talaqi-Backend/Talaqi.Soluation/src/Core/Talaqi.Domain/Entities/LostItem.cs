using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Enums;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Domain.Entities
{
    public class LostItem
    {
        public Guid UserId { get; set; }
        public ItemCategory Category { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public Location Location { get; set; } = new();
        public DateTime DateLost { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
        public ItemStatus Status { get; set; } = ItemStatus.Active;
        public string? AIAnalysisData { get; set; } // JSON string

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Match> Matches { get; set; } = new List<Match>();
    }
}
/***************************************************************
 *  LostItem Entity
 *
 * هنا يا معلم ده الـ Model اللي بنسجّل فيه أي غرض ضايع (Lost Report).
 * يعني المستخدم يبلغ إن حاجة منه ضاعت، فبنخزن التفاصيل هنا.
 *
 *  ليه الكيان ده موجود؟
 * - علشان نقدر نعمل سيرش على الحاجات الضايعة ونربطها بالحاجات اللي اتلاقت
 * - ده جزء أساسي من فكرة التطبيق (Matching System)
 *
 *  ايه أهم الحاجات اللي بنخزنها هنا؟
 * - Category: نوع الحاجة (People / Pets / Personal Belongings)
 * - Location: مكان الضياع (ValueObject علشان يكون structured)
 * - DateLost: تاريخ حدوث حالة الضياع
 * - ContactInfo: ازاي نتواصل مع المبلّغ
 *
 *  ليه في علاقة مع User؟
 * - علشان نعرف مين اللي بلّغ عن الضياع (Foreign Key -> UserId)
 *
 *  ليه في AIAnalysisData؟
 * - ده JSON هنخزن فيه تحليل الـ AI (مثلاً: لون، شكل، احتمالات المطابقة)
 * - ده هيساعدنا في الـ Smart Matching Search
 *
 *  ليه Status Enum؟
 * - علشان في المستقبل نعرف الحاجة رجعت ولا لسه مفقودة (Active, Found, Closed, Expired)
 *
 *  ليه فيه ICollection<Match>؟
 * - لأن الـ LostItem ممكن يطلع له أكتر من تطابق (Matches) مع FoundItems
 ***************************************************************/
