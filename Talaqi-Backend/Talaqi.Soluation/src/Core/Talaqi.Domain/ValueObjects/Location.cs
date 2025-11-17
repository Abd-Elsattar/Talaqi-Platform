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