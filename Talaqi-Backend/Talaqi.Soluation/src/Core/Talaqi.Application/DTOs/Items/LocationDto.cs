using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Items
{
    //The `LocationDto` class is a data transfer object (DTO) that is used to encapsulate information related to a specific location. Here is a breakdown of its structure and purpose:
    //1. **Public Class**: The class is declared as public, making it accessible from other classes outside its assembly. This is typical for DTOs, as they are often used to transfer data across different parts of an application or between services.
    //2. **Properties**:
    //   - `Address`: A string property that holds the address of the location. It is initialized with an empty string to ensure it never holds a null value, reducing the need for null checks when this property is accessed.
    //   - `Latitude`: A nullable double property that represents the latitude coordinate of the location. Latitude values are typically between -90.0 and 90.0. The use of `double?` (or `Nullable<double>`) indicates that this property can either hold a double value or be null, accounting for situations where the latitude might be unknown or optional.
    //   - `Longitude`: Similar to latitude, this is also a nullable double property. Longitude values range from -180.0 to 180.0. The nullability allows for cases where location data might be incomplete.
    //   - `City`: A nullable string property for the city in which the location is situated. It is nullable (`string?`) because a location might not always be associated with a specific city name.
    //   - `Governorate`: Another nullable string property that may represent a region, state, or province that the location belongs to. Its nullability reflects that this information is also optional or might not be applicable in all scenarios.
    //By using nullable types for some of the properties, `LocationDto` offers flexibility in scenarios where location data might be partially available. This is particularly useful when dealing with APIs or databases where some attributes of a location may not always be specified.
    //The primary purpose of this DTO is to serve as a simple and self-contained carrier of location-related data. It can be used for data serialization/deserialization, transferring data between layers of an application, or as a method parameter/return type in service-oriented architectures.
    public class LocationDto
    {
        public string Address { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? City { get; set; }
        public string? Governorate { get; set; }
    }
}
