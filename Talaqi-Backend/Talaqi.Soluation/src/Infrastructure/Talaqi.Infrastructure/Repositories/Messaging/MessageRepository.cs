using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories.Messaging;
using Talaqi.Domain.Entities.Messaging;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories.Messaging
{
    public class MessageRepository : BaseRepository<Message>, IMessageRepository
    {
        public MessageRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Message>> GetConversationMessagesAsync(Guid conversationId, int page, int pageSize)
        {
            return await _dbSet
                .Where(m => m.ConversationId == conversationId)
                .Include(m => m.Attachments)
                .Include(m => m.Sender)
                .Include(m => m.ReplyToMessage)
                .OrderByDescending(m => m.CreatedAt) // Latest first for chat history (usually)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetUnreadCountAsync(Guid conversationId, Guid userId, Guid? lastReadMessageId)
        {
            if (lastReadMessageId == null)
            {
                // If never read, count all messages not sent by self
                return await _dbSet
                    .Where(m => m.ConversationId == conversationId && m.SenderId != userId)
                    .CountAsync();
            }

            // Count messages sent AFTER the last read message
            // We need the timestamp of the last read message
            var lastMsg = await _dbSet.FindAsync(lastReadMessageId);
            if (lastMsg == null) return 0;

            return await _dbSet
                .Where(m => m.ConversationId == conversationId && m.SenderId != userId && m.CreatedAt > lastMsg.CreatedAt)
                .CountAsync();
        }

        public async Task MarkMessagesAsReadAsync(Guid conversationId, Guid userId, Guid messageId)
        {
            // This logic is usually complex if tracking per-message delivery.
            // For now, we update the Participant's LastReadMessageId in the Service, not here.
            // But if we have MessageDelivery entity, we update it here.
            
            var msg = await _dbSet.FindAsync(messageId);
            if (msg == null) return;

            // Find all pending deliveries for this user in this conversation up to this message
            // This requires joining with Conversation or knowing the messages.
            
            var pendingDeliveries = await _context.Set<MessageDelivery>()
                .Include(md => md.Message)
                .Where(md => md.UserId == userId && 
                             md.Message.ConversationId == conversationId &&
                             md.Message.CreatedAt <= msg.CreatedAt &&
                             md.Status != Domain.Enums.Messaging.MessageDeliveryStatus.Seen)
                .ToListAsync();

            foreach (var delivery in pendingDeliveries)
            {
                delivery.Status = Domain.Enums.Messaging.MessageDeliveryStatus.Seen;
                delivery.SeenAt = DateTime.UtcNow;
            }
            
            // Note: SaveChanges is called by UnitOfWork usually
        }
    }
}
