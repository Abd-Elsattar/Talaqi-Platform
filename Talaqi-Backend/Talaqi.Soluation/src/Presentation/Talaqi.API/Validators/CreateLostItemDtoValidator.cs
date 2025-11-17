using FluentValidation;
using Talaqi.Application.DTOs.Items;

namespace Talaqi.API.Validators
{
    public class CreateLostItemDtoValidator : AbstractValidator<CreateLostItemDto>
    {
        public CreateLostItemDtoValidator()
        {
            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required")
                .Must(c => new[] { "PersonalBelongings", "People", "Pets" }.Contains(c))
                .WithMessage("Invalid category. Must be PersonalBelongings, People, or Pets");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required")
                .MinimumLength(10).WithMessage("Description must be at least 10 characters")
                .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");

            RuleFor(x => x.Location)
                .NotNull().WithMessage("Location is required");

            RuleFor(x => x.Location.Address)
                .NotEmpty().WithMessage("Location address is required")
                .When(x => x.Location != null);

            RuleFor(x => x.DateLost)
                .NotEmpty().WithMessage("Date lost is required")
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Date lost cannot be in the future");

            RuleFor(x => x.ContactInfo)
                .NotEmpty().WithMessage("Contact information is required")
                .MaximumLength(500).WithMessage("Contact info must not exceed 500 characters");
        }
    }

}
