using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Auth
{
    
    public class RegisterDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
//The `RegisterDto` class is a Data Transfer Object (DTO) typically used in programming to
//encapsulate and transfer data between processes or to/from a storage or service layer.
//This particular class is likely used within a registration feature of an application.
//Here's a breakdown of its properties and their purposes:
//1. **FirstName**: This property stores the user's first name as a string.
//It is intended to capture the individual's personal identification information.
//2. **LastName**: This string property holds the user's last name,
//complementing the first name to complete personal identification.
//3. **Email**: This property stores the user's email address in string format.
//It is often used as a unique identifier for the user and is essential for communication and verification purposes.
//4. **PhoneNumber**: This property captures the user's phone number in string format.
//It can be used for verification, communication, or as an additional identifier.
//5. **Password**: This is a string property that contains the user's password.
//It is critical for account security and authentication purposes. Password handling must be done securely,
//usually involving hashing and never storing plain text passwords.
//6. **ConfirmPassword**: This string property is used to ensure that the user has entered their password correctly
//by requiring them to input it twice. It is a common practice in registration forms to minimize errors in password entry.
//Overall, the `RegisterDto` class is designed to collect all necessary information from a user
//during the registration process in a structured way.
//This object can then be used by the business logic or service layer to process and store the user's information,
//perform validations, and ensure proper flow of data within the application.