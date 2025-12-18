using System;
using System.Collections.Generic;
using Talaqi.Domain.Enums.Messaging;

namespace Talaqi.Application.DTOs.Messaging
{
    public class ConversationDto
    {
        public Guid Id { get; set; }
        public ConversationType Type { get; set; }
        public string? Title { get; set; }
        public string? ImageUrl { get; set; }
        public Guid? MatchId { get; set; }
        
        public MessageDto? LastMessage { get; set; }
        public int UnreadCount { get; set; }
        
        public List<ConversationParticipantDto> Participants { get; set; } = new();
    }

    public class ConversationParticipantDto
    {
        public Guid UserId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public bool IsOnline { get; set; } // Real-time status
        public DateTime? LastSeen { get; set; }
    }
}
