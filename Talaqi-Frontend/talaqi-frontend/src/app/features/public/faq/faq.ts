// FAQ component: renders and manages FAQ content.
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class FAQComponent {
  selectedCategory = 'all';

  private router = inject(Router);

  categories = [
    { id: 'all', label: 'الكل' },
    { id: 'account', label: 'الحساب والتسجيل' },
    { id: 'reporting', label: 'الإبلاغ عن العناصر' },
    { id: 'finding', label: 'البحث والعثور' },
    { id: 'communication', label: 'التواصل والأمان' },
    { id: 'general', label: 'أسئلة عامة' },
  ];

  faqs: FAQItem[] = [
    // Account & Registration
    {
      id: 1,
      question: 'كيف أنشئ حسابًا على منصة تلاقي؟',
      answer:
        'انتقل إلى صفحة التسجيل، أدخل بريدك الإلكتروني وأنشئ كلمة مرور. ستتلقى رسالة تحقق لتفعيل الحساب. بعد التفعيل يمكنك البدء بالإبلاغ والمتابعة.',
      category: 'account',
      isOpen: false,
    },
    {
      id: 2,
      question: 'هل يمكنني استخدام منصة تلاقي بدون حساب؟',
      answer:
        'يمكنك تصفح والبحث عن العناصر بدون حساب. لكن الإبلاغ عن عنصر والرد على الرسائل أو متابعة البلاغات يتطلب تسجيل الدخول.',
      category: 'account',
      isOpen: false,
    },
    {
      id: 3,
      question: 'كيف أعيد تعيين كلمة المرور الخاصة بي؟',
      answer:
        'انقر على "نسيت كلمة المرور" في صفحة تسجيل الدخول. أدخل بريدك الإلكتروني وستتلقى رابط إعادة تعيين على بريدك. انقر على الرابط وأدخل كلمة المرور الجديدة.',
      category: 'account',
      isOpen: false,
    },
    {
      id: 4,
      question: 'هل بيانات حسابي آمنة؟',
      answer:
        'نعم، نستخدم أحدث تقنيات التشفير لحماية بيانات حسابك. جميع البيانات الشخصية مشفرة وآمنة. نتبع معايير الأمان العالمية.',
      category: 'account',
      isOpen: false,
    },

    // Reporting Items
    {
      id: 5,
      question: 'كيف أبلغ عن عنصر مفقود؟',
      answer:
        'بعد تسجيل الدخول، افتح صفحة الإبلاغ واملأ النموذج. أضف وصفاً مفصلاً، الموقع، التاريخ، وارفق صورة واضحة إن أمكن. يمكنك التبليغ مباشرة عبر <a href="/report-lost-item">إبلاغ عن عنصر مفقود</a>.',
      category: 'reporting',
      isOpen: false,
    },
    {
      id: 6,
      question: 'هل يمكنني تعديل بلاغي بعد إرساله؟',
      answer:
        'نعم، يمكنك تعديل بلاغك من صفحة "بلاغاتي"—تعديل الوصف، إضافة أو حذف صور، وتحديث الموقع أو التاريخ.',
      category: 'reporting',
      isOpen: false,
    },
    {
      id: 7,
      question: 'كم عدد الصور التي يمكنني رفعها؟',
      answer:
        'الواجهة الحالية تدعم صورة واحدة لكل بلاغ. تُعالَج الصورة محلياً لتناسب إطار 4:3 قبل الرفع، والحد الأقصى لحجم الملف هو 5 ميجابايت. إذا رغبت برفع صور متعددة، يمكنك تحرير البلاغ لاحقاً حسب خيارات المنصة المستقبلية.',
      category: 'reporting',
      isOpen: false,
    },
    {
      id: 8,
      question: 'كم من الوقت سيبقى بلاغي نشطاً؟',
      answer:
        'تظل البلاغات نشطة لفترة محددة (مثلاً 90 يوماً) حسب سياسة المنصة. يمكنك إعادة تنشيط أو إعادة نشر البلاغ من حسابك عند الحاجة.',
      category: 'reporting',
      isOpen: false,
    },

    // Finding Items
    {
      id: 9,
      question: 'كيف أبحث عن عنصر معين؟',
      answer:
        'استخدم شريط البحث وأدخل الكلمات الرئيسية. يمكنك أيضاً استخدام الفلاتر المتقدمة لتحديد نوع العنصر والموقع والتاريخ. تصفح النتائج وانقر على أي عنصر للحصول على مزيد من التفاصيل.',
      category: 'finding',
      isOpen: false,
    },
    {
      id: 10,
      question: 'ما هي متطابقات الذكاء الاصطناعي؟',
      answer:
        'النظام يقترح مطابقات محتملة بالاعتماد على الوصف، الفئة، والموقع، ويستخدم تقنيات تشابه الصور لترتيب النتائج. هذه اقتراحات لمساعدتك — تأكد من مراجعتها والتواصل فقط مع من تثق به.',
      category: 'finding',
      isOpen: false,
    },
    {
      id: 11,
      question: 'هل يمكنني البحث عن عناصر في مدن أخرى؟',
      answer:
        'نعم، يمكنك البحث عن عناصر في أي مكان على المنصة. لكن يُنصح بالبحث في نطاق جغرافي قريب أولاً لأن احتمالية الحصول على نتائج دقيقة أعلى.',
      category: 'finding',
      isOpen: false,
    },

    // Communication & Safety
    {
      id: 12,
      question: 'هل يمكن للآخرين رؤية معلوماتي الشخصية؟',
      answer:
        'لا يتم كشف معلوماتك الحساسة للعموم. فقط بيانات الملف الظاهرة (الاسم وصورة ملفك) مرئية، والتواصل يتم عبر نظام رسائل داخل المنصة للحفاظ على الخصوصية.',
      category: 'communication',
      isOpen: false,
    },
    {
      id: 13,
      question: 'كيف أتواصل مع شخص وجد عنصري؟',
      answer:
        'استخدم زر "المراسلة" على البلاغ أو صفحة المستخدم لفتح محادثة آمنة داخل المنصة. لا تشارك معلومات حساسة قبل التأكد من هوية الشخص.',
      category: 'communication',
      isOpen: false,
    },
    {
      id: 14,
      question: 'ماذا أفعل إذا واجهت تواصلاً مريباً؟',
      answer:
        'اضغط زر "إبلاغ" على الرسالة أو صفحة المستخدم، أو تواصل مع فريق الدعم عبر صفحة المساعدة. سنراجع البلاغات ونتخذ إجراءات إذا لزم الأمر.',
      category: 'communication',
      isOpen: false,
    },

    // General Questions
    {
      id: 15,
      question: 'هل منصة تلاقي مجانية؟',
      answer:
        'نعم، الاستخدام الأساسي لمنصة تلاقي مجاني: إنشاء حساب، الإبلاغ، والبحث. قد تتوفر ميزات إضافية لاحقاً حسب سياسة المنصة.',
      category: 'general',
      isOpen: false,
    },
    {
      id: 16,
      question: 'كيف يعمل نظام المطابقة الذكية؟',
      answer:
        'يعتمد النظام على خوارزميات تقارن الصور والوصف وتراعي الموقع والفئة. يستخدم النظام صورك بعد معالجتها (إطار 4:3) مع وصف البلاغ لتوليد اقتراحات مرتبة حسب التشابه والملاءمة. هذه اقتراحات لمساعدة المستخدم وليست قراراً تلقائياً.',
      category: 'general',
      isOpen: false,
    },
    {
      id: 17,
      question: 'هل هناك تطبيق جوال لتلاقي؟',
      answer:
        'حالياً المنصة متاحة كموقع ويب متجاوب يعمل على الموبايل. نعمل على تطبيقات مخصصة لنظامي iOS وAndroid وسيتم الإعلان عنها عند الإطلاق.',
      category: 'general',
      isOpen: false,
    },
    {
      id: 18,
      question: 'كيف يمكنني حذف حسابي؟',
      answer:
        'من إعدادات الحساب اختر "حذف الحساب". سيُطلب منك تأكيد العملية. احرص على تنزيل أي بيانات تريد الاحتفاظ بها قبل الحذف، فهذه العملية قد تكون نهائية.',
      category: 'general',
      isOpen: false,
    },
  ];

  toggleFAQ(faq: FAQItem): void {
    faq.isOpen = !faq.isOpen;
  }

  getFilteredFAQs(): FAQItem[] {
    if (this.selectedCategory === 'all') {
      return this.faqs;
    }
    return this.faqs.filter((faq) => faq.category === this.selectedCategory);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  goToContact(): void {
    this.router.navigate(['/contact-us']);
  }
}
