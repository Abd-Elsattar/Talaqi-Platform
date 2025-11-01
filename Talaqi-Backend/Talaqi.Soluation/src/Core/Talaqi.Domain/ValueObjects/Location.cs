using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Domain.ValueObjects
{
    public class Location
    {
        public string Address { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? City { get; set; }
        public string? Governorate { get; set; }

        public Location() { }

        public Location(string address, double? latitude = null, double? longitude = null,
                       string? city = null, string? governorate = null)
        {
            Address = address;
            Latitude = latitude;
            Longitude = longitude;
            City = city;
            Governorate = governorate;
        }

        public override bool Equals(object? obj)
        {
            if (obj is not Location other) return false;
            return Address == other.Address &&
                   Latitude == other.Latitude &&
                   Longitude == other.Longitude;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Address, Latitude, Longitude);
        }
    }
}
/***************************************************************
 *  Location ValueObject
 *
 * هنا يا معلم معمّلين Location كـ Value Object مش Entity.
 *  ليه مش Entity؟
 * - لأنه مالوش هوية مستقلة (No ID)
 * - قيمته بتتحدد عن طريق مجموعة خصائص مش مفتاح أساسي
 *
 *  ليه عاملينه كـ Value Object؟
 * - لأنه محتاج يكون جزء من الكيان نفسه، مش جدول منفصل
 * - ولأنه immutable conceptually (القيمة بتتغير ككل مش جزء منها)
 *
 *  ايه اللي بنسجله؟
 * - Address: العنوان النصّي
 * - Latitude / Longitude: احداثيات GPS لو موجودة
 * - City + Governorate: تفصيل أكتر حسب الحاجة
 *
 *  Override Equals & GetHashCode
 * - عشان الـ ValueObject بيقارن بالقيمة مش بالهوية (Reference)
 ***************************************************************/