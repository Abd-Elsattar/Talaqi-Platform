using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Domain.Enums
{
    public enum MatchStatus
    {
        Pending = 1,
        Confirmed = 2,
        Rejected = 3,
        Resolved = 4
    }
}
/***************************************************************
 *  MatchStatus Enum
 *
 * ده بيوضح حالة المطابقة بين LostItem & FoundItem.
 ***************************************************************/