using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Messaging;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities.Messaging;
using Talaqi.Domain.Enums.Messaging;

namespace Talaqi.Application.Services
{
    public class MessagingService : IMessagingService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IChatNotifier _notifier;

        public MessagingService(IUnitOfWork uow, IMapper mapper, IChatNotifier notifier)
        {
            _uow = uow;
            _mapper = mapper;
            _notifier = notifier;
        }

        public async Task<Result<IEnumerable<ConversationDto>>> GetUserConversationsAsync(Guid userId, int page = 1, int pageSize = 20)
        {
            var conversations = await _uow.Conversations.GetUserConversationsAsync(userId, page, pageSize);
            
            // Map to DTO
            var dtos = new List<ConversationDto>();
            foreach (var conv in conversations)
            {
                var dto = _mapper.Map<ConversationDto>(conv);
                
                // Populate unread count
                var participant = conv.Participants.FirstOrDefault(p => p.UserId == userId);
                if (participant != null)
                {
                    dto.UnreadCount = await _uow.Messages.GetUnreadCountAsync(conv.Id, userId, participant.LastReadMessageId);
                }
                
                // Populate LastMessage if exists (usually optimized by query or mapped)
                // For now, assuming Mapping handles basic fields, but LastMessage might need explicit fetch if not eager loaded properly or if we want the actual message content.
                // Assuming Conversation.LastMessageId is used.
                
                dtos.Add(dto);
            }

            return Result<IEnumerable<ConversationDto>>.Success(dtos);
        }

        public async Task<Result<ConversationDto>> GetConversationAsync(Guid conversationId, Guid userId)
        {
            var conv = await _uow.Conversations.GetByIdWithParticipantsAsync(conversationId);
            if (conv == null) return Result<ConversationDto>.Failure("Conversation not found");

            if (!conv.Participants.Any(p => p.UserId == userId))
                return Result<ConversationDto>.Failure("Access denied");

            return Result<ConversationDto>.Success(_mapper.Map<ConversationDto>(conv));
        }

        public async Task<Result<ConversationDto>> StartPrivateConversationAsync(Guid senderId, Guid receiverId, Guid? matchId = null)
        {
            if (senderId == receiverId) return Result<ConversationDto>.Failure("Cannot chat with yourself");

            // Check if exists
            var existing = await _uow.Conversations.GetPrivateConversationAsync(senderId, receiverId);
            if (existing != null)
            {
                // If matchId is provided and different, maybe update metadata? For now just return existing.
                return Result<ConversationDto>.Success(_mapper.Map<ConversationDto>(existing));
            }

            // Create new
            var conv = new Conversation
            {
                Type = ConversationType.Private,
                MatchId = matchId,
                Participants = new List<ConversationParticipant>
                {
                    new() { UserId = senderId },
                    new() { UserId = receiverId }
                }
            };

            await _uow.Conversations.AddAsync(conv);
            await _uow.SaveChangesAsync();

            return Result<ConversationDto>.Success(_mapper.Map<ConversationDto>(conv));
        }

        public async Task<Result<MessageDto>> SendMessageAsync(Guid senderId, SendMessageDto request)
        {
            Conversation? conv = null;

            if (request.ConversationId.HasValue)
            {
                conv = await _uow.Conversations.GetByIdWithParticipantsAsync(request.ConversationId.Value);
                if (conv == null) return Result<MessageDto>.Failure("Conversation not found");
                if (!conv.Participants.Any(p => p.UserId == senderId)) return Result<MessageDto>.Failure("Access denied");
            }
            else if (request.ReceiverId.HasValue)
            {
                var result = await StartPrivateConversationAsync(senderId, request.ReceiverId.Value, request.MatchId);
                if (!result.IsSuccess) return Result<MessageDto>.Failure(result.Message ?? "Failed to start conversation");
                if (result.Data == null) return Result<MessageDto>.Failure("Failed to retrieve conversation data");
                conv = await _uow.Conversations.GetByIdAsync(result.Data.Id); // Reload entity
            }
            else
            {
                return Result<MessageDto>.Failure("ConversationId or ReceiverId required");
            }

            var message = new Message
            {
                ConversationId = conv.Id,
                SenderId = senderId,
                Content = request.Content,
                Type = request.Type,
                ReplyToMessageId = request.ReplyToMessageId
            };

            await _uow.Messages.AddAsync(message);
            
            // Update conversation last message
            conv.LastMessageAt = message.CreatedAt;
            // conv.LastMessageId = message.Id; // Will be set after save
            
            await _uow.SaveChangesAsync();
            
            // Set ID after save
            conv.LastMessageId = message.Id;
            await _uow.SaveChangesAsync();

            var dto = _mapper.Map<MessageDto>(message);
            
            // Notify participants
            foreach (var p in conv.Participants)
            {
                if (p.UserId != senderId)
                {
                    await _notifier.NotifyMessageReceivedAsync(p.UserId, dto);
                }
            }

            return Result<MessageDto>.Success(dto);
        }

        public async Task<Result<IEnumerable<MessageDto>>> GetMessagesAsync(Guid conversationId, Guid userId, int page = 1, int pageSize = 50)
        {
            var conv = await _uow.Conversations.GetByIdAsync(conversationId); // Simple check
            // Need to verify participation
             var isParticipant = await _uow.Conversations.GetQueryable()
                 .AnyAsync(c => c.Id == conversationId && c.Participants.Any(p => p.UserId == userId));
                 
            if (!isParticipant) return Result<IEnumerable<MessageDto>>.Failure("Access denied");

            var messages = await _uow.Messages.GetConversationMessagesAsync(conversationId, page, pageSize);
            var dtos = _mapper.Map<IEnumerable<MessageDto>>(messages);
            
            return Result<IEnumerable<MessageDto>>.Success(dtos);
        }

        public async Task<Result> MarkAsReadAsync(Guid conversationId, Guid userId, Guid messageId)
        {
             var conv = await _uow.Conversations.GetByIdWithParticipantsAsync(conversationId);
             if (conv == null) return Result.Failure("Not found");
             
             var participant = conv.Participants.FirstOrDefault(p => p.UserId == userId);
             if (participant == null) return Result.Failure("Access denied");
             
             participant.LastReadMessageId = messageId;
             
             // Also update individual message deliveries if using MessageDelivery table
             await _uow.Messages.MarkMessagesAsReadAsync(conversationId, userId, messageId);
             
             await _uow.SaveChangesAsync();
             
             // Notify others
             // await _notifier.NotifyReadAsync(...)
             
             return Result.Success();
        }

        public async Task<Result> DeleteMessageAsync(Guid messageId, Guid userId)
        {
             var message = await _uow.Messages.GetByIdAsync(messageId);
             if (message == null) return Result.Failure("Message not found");

             if (message.SenderId != userId)
                 return Result.Failure("You can only delete your own messages");

             message.IsDeleted = true;
             message.DeletedForEveryoneAt = DateTime.UtcNow;
             
             await _uow.SaveChangesAsync();
             
             // Notify participants (optional, but good for real-time)
             // We can rely on client refresh or implement real-time delete event later
             
             return Result.Success();
        }
    }
}
