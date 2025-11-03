using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Domain.Entities
{
    public class VerificationCode : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }
        public string Purpose { get; set; } = string.Empty; // "PasswordReset", "EmailVerification"

        public bool IsValid => !IsUsed && DateTime.UtcNow < ExpiresAt;
    }
}
/***************************************************************
 *  VerificationCode Entity
 *
 * الكيان ده مسؤول عن تخزين أكواد التحقق (OTP Codes) الخاصة بالمستخدمين.
 *
 *  ليه موجود في الـ Domain؟
 * - علشان النظام محتاج يرسل أكواد تحقق سواء لتأكيد الإيميل أو استعادة كلمة المرور
 * - وعايزين ندير صلاحيتها، هل استخدمت؟ هل انتهت؟… إلخ
 *
 *  ايه اللي بنسجّله هنا؟
 * - Email → الإيميل اللي بُعت له الكود
 * - Code → قيمة كود التحقق نفسه
 * - ExpiresAt → تاريخ انتهاء الصلاحية
 * - IsUsed → هل تم استخدامه بالفعل ولا لا
 * - Purpose → نوع الاستخدام (EmailVerification / PasswordReset)
 *
 *  ليه عندنا Property IsValid؟
 * - علشان قبل ما نستخدم الكود نعرف إنه لسه شغّال (Valid) ومش منتهي
 * - ومش محتاجين نعيد كتابة نفس اللوجيك كل مرة
 ***************************************************************/