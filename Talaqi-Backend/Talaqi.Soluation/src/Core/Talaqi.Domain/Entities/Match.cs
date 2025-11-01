using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Enums;

namespace Talaqi.Domain.Entities
{
    public class Match : BaseEntity
    {
        public Guid LostItemId { get; set; }
        public Guid FoundItemId { get; set; }
        public decimal ConfidenceScore { get; set; } // 0.0 to 100.0
        public MatchStatus Status { get; set; } = MatchStatus.Pending;
        public bool NotificationSent { get; set; }
        public DateTime? NotificationSentAt { get; set; }
        public string? MatchDetails { get; set; } // JSON with matching criteria

        // Navigation Properties
        public virtual LostItem LostItem { get; set; } = null!;
        public virtual FoundItem FoundItem { get; set; } = null!;
    }
}
/***************************************************************
 *  Match Entity
 *
 * هنا يا معلم ده الكيان اللي بيربط بين LostItem و FoundItem.
 * بمعنى: النظام أو الـ AI أو حتى الأدمن بيقول "الغرض اللي اتلاقي ده شبه الغرض اللي ضاع".
 *
 *  ليه الكيان ده مهم؟
 * - لأنه هو اللي بيمثل عملية الـ Matching نفسها في الدومين
 * - بيخلينا نسجّل نتيجة كل محاولة مطابقة بين Lost & Found
 *
 *  ايه اللي بنسجّله هنا؟
 * - LostItemId + FoundItemId → الربط بين الاتنين
 * - ConfidenceScore → نسبة التطابق (من 0% لحد 100%)
 * - Status → Pending / Confirmed / Rejected / Resolved
 * - NotificationSent → هل بعتنا إشعار للمستخدم ولا لأ
 * - MatchDetails → JSON فيه معلومات إضافية (مثال: "ColorMatch=82%")
 *
 *  ليه محتاج DateTime NotificationSentAt؟
 * - علشان لو حصل Spam أو إعادة إرسال نعرف امتى آخر مرة اتبعت إشعار
 *
 *  نقطة مهمة:
 * - مش كل Match بيبقى صح، فالـ User أو Admin ممكن يرفضه → لذلك في Status Enum
 ***************************************************************/