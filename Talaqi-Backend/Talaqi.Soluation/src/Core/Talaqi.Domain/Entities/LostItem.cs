using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Enums;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Domain.Entities
{
    /// <summary>
    /// Represents an item that has been reported as lost. Inherits from BaseEntity class, which provides common properties and methods for entities.
    /// </summary>
    public class LostItem : BaseEntity
    {
        /// <summary>
            /// Gets or sets the unique identifier for the user.
            /// </summary>
        public Guid UserId { get; set; }
        /// <summary>
        /// Gets or sets the category associated with the item. This property indicates the specific category 
        /// to which the item belongs, allowing for better classification and organization of items.
        /// </summary>
        public ItemCategory Category { get; set; }
        /// <summary>
        ﻿/// Represents the title of an object, initialized to an empty string by default.
        ﻿/// </summary>
        public string Title { get; set; } = string.Empty;
        /// <summary>
            /// Gets or sets the description, which is a text representation.
            /// It defaults to an empty string.
            /// </summary>
        public string Description { get; set; } = string.Empty;
        /// <summary>
        ///
        /// Gets or sets the URL of the image. This property can hold a null value if no image URL is provided.
        /// </summary>
        public string? ImageUrl { get; set; }
        /// <summary>
        /// Gets or sets the location value.
        /// </summary>
        /// <returns>
        /// A Location object initialized to a new instance.
        /// </returns>
        public Location Location { get; set; } = new();
        /// <summary>
        /// Gets or sets the date when an item was lost.
        /// </summary>
        public DateTime DateLost { get; set; }
        /// <summary>
        ///
        /// </summary>
        public string ContactInfo { get; set; } = string.Empty;
        /// <summary>
        /// Gets or sets the current status of an item. 
        /// The default status is set to 'Active'.
        /// </summary>
        public ItemStatus Status { get; set; } = ItemStatus.Active;
        /// <summary>
            /// Gets or sets a JSON string that contains the AI analysis data.
            /// This property can be null if no data has been assigned.
            /// </summary>
        public string? AIAnalysisData { get; set; } // JSON string

        // Navigation Properties
        /// <summary>
        /// Represents a navigation property that links to the related User entity.
        /// This enables loading, updating, and managing the association with the User entity.
        /// </summary>
        public virtual User User { get; set; } = null!;
        /// <summary>
        /// Gets or sets the collection of Match objects associated with this instance.
        /// </summary>
        /// <returns>
        /// A collection of Match objects which is initialized to an empty list by default.
        /// </returns>
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