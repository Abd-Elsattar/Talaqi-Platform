using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Auth
{
    
    public class ResetPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
//The `ResetPasswordDto` class is a Data Transfer Object (DTO) used in programming to encapsulate the information
//necessary for a password reset process. This class contains four properties:
//1. **Email**: A `string` property that holds the email address associated
//with the user account requesting a password reset. It's initialized to an empty string by default
//to ensure it starts with a non-null value.
//2. **Code**: A `string` property that likely stores a reset code or token.
//This code is typically generated during the password reset request process and is used to verify the authenticity
//of the request. It is also initialized to an empty string.
//3. **NewPassword**: A `string` property that represents the new password the user wishes to set.
//This is also initialized to an empty string to avoid null values.
//4. **ConfirmPassword**: Another `string` property where the user is expected
//to re-enter the new password as a confirmation step. Ensuring this matches `NewPassword`
//can help prevent typos and increase password setting accuracy. It's initialized to an empty string as well.
//In the context of application development, particularly in APIs or server-side logic,
//this DTO would typically be used to collect and validate data when a user initiates a password reset on their account.
//The class provides basic structure and ensures that necessary information is captured
//and used for further processing or validation as part of the password reset functionality.