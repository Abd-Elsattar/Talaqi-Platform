using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class MessageRepository : BaseRepository<Message>, IMessageRepository
    {
        public MessageRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Message>> GetConversationAsync(Guid userA, Guid userB, int take = 100)
        {
            return await _dbSet
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => (m.SenderId == userA && m.ReceiverId == userB) ||
                            (m.SenderId == userB && m.ReceiverId == userA))
                .OrderBy(m => m.Timestamp)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Message>> GetRecentMessagesForUserAsync(Guid userId, int take = 50)
        {
            return await _dbSet
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderByDescending(m => m.Timestamp)
                .Take(take)
                .ToListAsync();
        }
    }
}
