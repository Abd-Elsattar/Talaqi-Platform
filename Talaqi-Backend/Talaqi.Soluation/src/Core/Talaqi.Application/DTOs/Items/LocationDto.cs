namespace Talaqi.Application.DTOs.Items
{
    public class LocationDto
    {
        public string Address { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? City { get; set; }
        public string? Governorate { get; set; }
    }

}
