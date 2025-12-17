using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IMessageRepository : IBaseRepository<Message>
    {
        Task<IEnumerable<Message>> GetConversationAsync(Guid userA, Guid userB, int take = 100);
        Task<IEnumerable<Message>> GetRecentMessagesForUserAsync(Guid userId, int take = 50);
    }
}
