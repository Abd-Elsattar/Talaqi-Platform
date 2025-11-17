using AutoMapper;
using Talaqi.Application.DTOs.Auth;
using Talaqi.Application.DTOs.Items;
using Talaqi.Application.DTOs.Users;
using Talaqi.Domain.Entities;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>();
            CreateMap<User, UserProfileDto>();

            // Location mappings
            CreateMap<Location, LocationDto>().ReverseMap();

            // Lost Item mappings
            CreateMap<LostItem, LostItemDto>()
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Category.ToString()))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
                .ForMember(d => d.UserName, o => o.Ignore())
                .ForMember(d => d.UserProfilePicture, o => o.Ignore())
                .ForMember(d => d.MatchCount, o => o.Ignore());

            // Found Item mappings
            CreateMap<FoundItem, FoundItemDto>()
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Category.ToString()))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
                .ForMember(d => d.UserName, o => o.Ignore());

            // Match mappings
            CreateMap<Match, MatchDto>()
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
                .ForMember(d => d.LostItem, o => o.MapFrom(s => s.LostItem))
                .ForMember(d => d.FoundItem, o => o.MapFrom(s => s.FoundItem));
        }
    }
}