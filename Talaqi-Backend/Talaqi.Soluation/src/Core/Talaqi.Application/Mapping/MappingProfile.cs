using AutoMapper;
using Talaqi.Application.DTOs.Auth;
using Talaqi.Application.DTOs.Items;
using Talaqi.Application.DTOs.Users;
using Talaqi.Domain.Entities;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Application.Mapping
{
    /// <summary>
    /// A custom mapping profile used for configuring mapping between different object models.
    /// This class inherits from the AutoMapper Profile class, allowing customized mapping configuration.
    /// Define mapping rules and transformations within the constructor to convert objects between different shapes.
    /// </summary>
    public class MappingProfile : Profile
    {
        /// <summary>
        /// Configures mapping profiles for different models and their corresponding DTOs (Data Transfer Objects).
        /// This includes setting up specific mappings for User, Location, LostItem, FoundItem, and Match entities.
        /// Some properties are explicitly mapped from their original types, while others are ignored or renamed according to specific logic.
        /// </summary>
        public MappingProfile()
        {
            // User mappings: Maps User entity to its corresponding DTOs
            CreateMap<User, UserDto>();
            CreateMap<User, UserProfileDto>();

            // Location mappings: Maps Location entity to LocationDto
            CreateMap<Location, LocationDto>();

            // LostItem mappings
            CreateMap<LostItem, LostItemDto>()
                // Convert Category enum to string representation
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Category.ToString()))
                // Convert Status enum to string representation
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
                // Specify properties to be ignored during mapping
                .ForMember(d => d.UserName, o => o.Ignore())
                .ForMember(d => d.UserProfilePicture, o => o.Ignore())
                .ForMember(d => d.MatchCount, o => o.Ignore());

            // FoundItem mappings
            CreateMap<FoundItem, FoundItemDto>()
                // Convert Category enum to string representation
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Category.ToString()))
                // Convert Status enum to string representation
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
                // Specify a property to be ignored during mapping
                .ForMember(d => d.UserName, o => o.Ignore());

            // Match Mapping
            CreateMap<Match, MatchDto>()
                // Convert Status enum to string representation
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
                // Directly map associated LostItem
                .ForMember(d => d.LostItem, o => o.MapFrom(s => s.LostItem))
                // Directly map associated FoundItem
                .ForMember(d => d.FoundItem, o => o.MapFrom(s => s.FoundItem));
        }
    }
}