using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Domain.Entities
{
    public class BaseEntity
    {
        public Guid Id { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public DateTime? UdateAt { get; set; }
        public bool IsDeletet { get; set; }
    }
}
/***************************************************************
 * BaseEntity
 * 
 * هنا يا معلم عملنا كلاس أساسي كل الـ Entities في السيستم هتورّث منه
 * وده بدل ما نكرّر نفس الخصائص في كل كيان لوحده.
 *
 *  ليه استخدمناه؟
 * - علشان نوحّد الـ Id + CreatedAt + UpdatedAt + IsDeleted في مكان واحد
 * - يقلل تكرار الكود ويخلّي الـ Models أنضف وأسهل في الصيانة
 *
 *  ليه استخدمنا GUID بدل int AutoIncrement؟
 * - علشان IDs تكون Unique عبر أي سيرفر أو DB بدون ما نعتمد على Identity
 * - بيسهّل العمل لو هنستخدم Microservices أو Replication
 *
 *  ليه عملنا Soft Delete؟
 * - عشان منمسحش البيانات نهائيًا (بنعلّمها Deleted بس)
 * - نقدر نرجعها لو اتحذفت بالغلط
 * - نحافظ على علاقات FK وما نكسرش الـ Data Integrity
 *
 * المهم: أي Entity في النظام هيورّث من BaseEntity، ومش محتاج تكرار نفس خصائص الإدارة.
 ***************************************************************/