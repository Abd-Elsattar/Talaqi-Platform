using AutoMapper;
using System.Text.Json;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs;
using Talaqi.Application.DTOs.AI;
using Talaqi.Application.DTOs.Items;
using Talaqi.Application.Interfaces;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.Services
{
    public class MatchingService : IMatchingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        // Threshold for match acceptance
        private const decimal MATCH_THRESHOLD = 70.0m;

        public MatchingService(IUnitOfWork unitOfWork, IEmailService emailService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<Result<List<MatchDto>>> FindMatchesForFoundItemAsync(Guid foundItemId)
        {
            var foundItem = await _unitOfWork.FoundItems.GetByIdAsync(foundItemId);
            if (foundItem == null)
                return Result<List<MatchDto>>.Failure("Found item not found.");

            var foundAnalysis = JsonSerializer.Deserialize<AIAnalysisResult>(foundItem.AIAnalysisData ?? "{}");
            if (foundAnalysis == null)
                return Result<List<MatchDto>>.Failure("Found item has no AI data.");

            var lostItems = await _unitOfWork.LostItems.GetByCategoryAsync(foundItem.Category);
            var matches = new List<Match>();

            foreach (var lostItem in lostItems.Where(x => x.Status == ItemStatus.Active && !x.IsDeleted))
            {
                var lostAnalysis = JsonSerializer.Deserialize<AIAnalysisResult>(lostItem.AIAnalysisData ?? "{}");
                if (lostAnalysis == null)
                    continue;

                var score = CalculateMatchScore(foundAnalysis, lostAnalysis, foundItem, lostItem);

                if (score >= MATCH_THRESHOLD)
                {
                    var existingMatch = await _unitOfWork.Matches.GetMatchByItemAsync(lostItem.Id, foundItem.Id);
                    if (existingMatch != null) continue;

                    var match = new Match
                    {
                        LostItemId = lostItem.Id,
                        FoundItemId = foundItem.Id,
                        ConfidenceScore = score,
                        Status = MatchStatus.Pending,
                        CreateAt = DateTime.UtcNow
                    };

                    await _unitOfWork.Matches.AddAsync(match);
                    matches.Add(match);

                    await _emailService.SendMatchNotificationAsync(
                        lostItem.User.Email,
                        $"A potential match found for your lost item: {lostItem.Title}"
                    );

                    match.NotificationSent = true;
                    match.NotificationSentAt = DateTime.UtcNow;
                }
            }

            await _unitOfWork.SaveChangesAsync();
            var matchDtos = matches.Select(x => _mapper.Map<MatchDto>(x)).ToList();

            return Result<List<MatchDto>>.Success(matchDtos);
        }

        // ================================================
        // ============ NEW SMART MATCHING LOGIC ===========
        // ================================================
        private decimal CalculateMatchScore(AIAnalysisResult? foundAnalysis, AIAnalysisResult? lostAnalysis,
            FoundItem foundItem, LostItem lostItem)
        {
            decimal score = 0;
            int factors = 0;

            // 🧠 1. Text Semantic Similarity (50%)
            var textEmbedding1 = ExtractEmbedding(foundAnalysis);
            var textEmbedding2 = ExtractEmbedding(lostAnalysis);
            if (textEmbedding1.Count > 0 && textEmbedding2.Count > 0)
            {
                var cosine = CalculateCosineSimilarity(textEmbedding1, textEmbedding2);
                score += (decimal)(cosine * 50);
                factors++;
            }

            // 📍 2. Location proximity (30%)
            if (foundItem.Location.Latitude.HasValue && lostItem.Location.Latitude.HasValue)
            {
                var distance = CalculateDistance(
                    foundItem.Location.Latitude.Value, foundItem.Location.Longitude!.Value,
                    lostItem.Location.Latitude.Value, lostItem.Location.Longitude!.Value);

                var locationScore = Math.Max(0, 30 - (distance / 5 * 30)); // within 5km = full score
                score += (decimal)locationScore;
                factors++;
            }

            // 🕓 3. Date proximity (20%)
            var daysDifference = Math.Abs((foundItem.DateFound - lostItem.DateLost).TotalDays);
            var dateScore = Math.Max(0, 20 - (daysDifference / 30 * 20)); // within 30 days = full score
            score += (decimal)dateScore;
            factors++;

            return factors > 0 ? Math.Min(score, 100) : 0;
        }

        // Helper to extract embedding vector
        private List<float> ExtractEmbedding(AIAnalysisResult? analysis)
        {
            if (analysis?.AdditionalData == null) return new List<float>();
            if (!analysis.AdditionalData.TryGetValue("embedding", out var embeddingObj)) return new List<float>();

            try
            {
                if (embeddingObj is JsonElement jsonEl && jsonEl.ValueKind == JsonValueKind.Array)
                    return jsonEl.EnumerateArray().Select(x => x.GetSingle()).ToList();

                if (embeddingObj is List<float> list)
                    return list;
            }
            catch { }

            return new List<float>();
        }

        // Cosine Similarity between two embedding vectors
        private double CalculateCosineSimilarity(List<float> v1, List<float> v2)
        {
            int len = Math.Min(v1.Count, v2.Count);
            if (len == 0) return 0;

            double dot = 0, mag1 = 0, mag2 = 0;
            for (int i = 0; i < len; i++)
            {
                dot += v1[i] * v2[i];
                mag1 += v1[i] * v1[i];
                mag2 += v2[i] * v2[i];
            }
            return dot / (Math.Sqrt(mag1) * Math.Sqrt(mag2) + 1e-8);
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371;
            var dLat = ToRadians(lat2 - lat1);
            var dLong = ToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLong / 2) * Math.Sin(dLong / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private double ToRadians(double degrees) => degrees * Math.PI / 180;

        /// <summary>
        /// Asynchronously retrieves the list of matches for a specified user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user for whom to retrieve matches.</param>
        /// <returns>
        /// A task that represents the asynchronous operation, containing a result with a list of match DTOs if successful.
        /// </returns>
        public async Task<Result<List<MatchDto>>> GetUserMatchesAsync(Guid userId)
        {
            // Retrieve matches for the given user
            var matches = await _unitOfWork.Matches.GetMatchesForUserAsync(userId);

            // Map matches to DTOs
            var dtos = matches.Select(match => _mapper.Map<MatchDto>(match)).ToList();

            // Return the result
            return Result<List<MatchDto>>.Success(dtos);
        }

        /// <summary>
        /// Asynchronously retrieves a match by its unique identifier.
        /// </summary>
        /// <param name="matchId">The unique identifier of the match.</param>
        /// <returns>
        /// A task representing the asynchronous operation, containing a result with the mapped MatchDto if successful, or a failure message if not found.
        /// </returns>
        public async Task<Result<MatchDto>> GetMatchByIdAsync(Guid matchId)
        {
            // Retrieve match by ID
            var match = await _unitOfWork.Matches.GetByIdAsync(matchId);

            // Check if match does not exist
            if (match == null)
                return Result<MatchDto>.Failure("Match not found.");

            // Map match to DTO
            var matchDto = _mapper.Map<MatchDto>(match);
            return Result<MatchDto>.Success(matchDto);
        }

        public async Task<Result> UpdateMatchStatusAsync(Guid matchId, string status, Guid userId)
        {
            // Retrieve match by ID
            var match = await _unitOfWork.Matches.GetByIdAsync(matchId);

            // Check if match does not exist
            if (match == null)
                return Result.Failure("Match not found.");

            // Verify user owns the lost item
            if (match.LostItem.UserId != userId)
                return Result.Failure("Unauthorized");

            // Parse and update status if valid
            if (Enum.TryParse<MatchStatus>(status, out var matchStatus))
            {
                match.Status = matchStatus;
                match.UpdatedAt = DateTime.UtcNow;

                // Save changes to the database
                await _unitOfWork.SaveChangesAsync();
                return Result.Success("Match status updated");
            }

            // Return failure if status is invalid
            return Result.Failure("Invalid status");
        }

    }
}

//using AutoMapper;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Text.Json;
//using System.Threading.Tasks;
//using Talaqi.Application.Common;
//using Talaqi.Application.DTOs.AI;
//using Talaqi.Application.DTOs.Items;
//using Talaqi.Application.Interfaces.Repositories;
//using Talaqi.Application.Interfaces.Services;
//using Talaqi.Domain.Entities;
//using Talaqi.Domain.Enums;

//namespace Talaqi.Application.Services
//{
//    /// <summary>
//    /// Represents a service responsible for implementing the logic and operations related to matching tasks or entities.
//    /// This class likely provides functionalities required to match items or data sets based on pre-defined criteria.
//    /// </summary>
//    public class MatchingService : IMatchingService
//    {
//        // Dependency injections for various services and unit of work
//        private readonly IUnitOfWork _unitOfWork;
//        private readonly IEmailService _emailService;
//        private readonly IMapper _mapper;

//        // Constant threshold value for determining a match
//        private const decimal MATCH_THRESHOLD = 60.0m;

//        /// <summary>
//        /// Initializes a new instance of the MatchingService class.
//        /// </summary>
//        /// <param name="unitOfWork">The unit of work for managing database transactions.</param>
//        /// <param name="emailService">The email service for sending notifications.</param>
//        /// <param name="mapper">The mapper for mapping between different object models.</param>
//        /// <returns>
//        /// A new instance of the MatchingService class.
//        /// </returns>
//        public MatchingService(IUnitOfWork unitOfWork, IEmailService emailService, IMapper mapper)
//        {
//            _unitOfWork = unitOfWork;
//            _emailService = emailService;
//            _mapper = mapper;
//        }

//        /// <summary>
//        /// Asynchronously finds potential matches for a found item by comparing it with active lost items of the same category.
//        /// If a match is above a certain confidence threshold, it is recorded and a notification is sent to the owner of the lost item.
//        /// </summary>
//        /// <param name="foundItemId">The unique identifier of the found item for which matches are to be found.</param>
//        /// <returns>
//        /// A Result containing a list of MatchDto objects representing potential matches if successful, or a failure message if the found item is not found.
//        /// </returns>
//        public async Task<Result<List<MatchDto>>> FindMatchesForFoundItemAsync(Guid foundItemId)
//        {
//            // Retrieve the found item by ID
//            var foundItem = await _unitOfWork.FoundItems.GetByIdAsync(foundItemId);

//            // Check if found item does not exist
//            if (foundItem == null)
//                return Result<List<MatchDto>>.Failure("Found item not found.");

//            // Deserialize AI analysis data for the found item
//            var foundAnalysis = JsonSerializer.Deserialize<AIAnalysisResult>(foundItem.AIAnalysisData ?? "{}");

//            // Get all active lost items of the same category
//            var lostItems = await _unitOfWork.LostItems.GetByCategoryAsync(foundItem.Category);
//            var matches = new List<Match>();

//            // Iterate over each lost item and calculate match score
//            foreach (var lostItem in lostItems.Where(x => x.Status == ItemStatus.Active && !x.IsDeleted))
//            {
//                // Deserialize AI analysis data for each lost item
//                var lostAnalysis = JsonSerializer.Deserialize<AIAnalysisResult>(lostItem.AIAnalysisData ?? "{}");
//                var score = CalculateMatchScore(foundAnalysis, lostAnalysis, foundItem, lostItem);

//                // If match score is above the threshold
//                if (score >= MATCH_THRESHOLD)
//                {
//                    // Check if match already exists
//                    var existingMatch = await _unitOfWork.Matches
//                        .GetMatchByItemAsync(lostItem.Id, foundItem.Id);

//                    // If no existing match, create a new match
//                    if (existingMatch == null)
//                    {
//                        var match = new Match
//                        {
//                            LostItemId = lostItem.Id,
//                            FoundItemId = foundItem.Id,
//                            ConfidenceScore = score,
//                            Status = MatchStatus.Pending,
//                            CreateAt = DateTime.UtcNow
//                        };

//                        // Add new match to the database
//                        await _unitOfWork.Matches.AddAsync(match);
//                        matches.Add(match);

//                        // Send notification email
//                        await _emailService.SendMatchNotificationAsync(
//                            lostItem.User.Email,
//                            $"A potential match found for your lost item: {lostItem.Title}");

//                        // Update match notification details
//                        match.NotificationSent = true;
//                        match.NotificationSentAt = DateTime.UtcNow;
//                    }
//                }
//            }

//            // Save changes to the database
//            await _unitOfWork.SaveChangesAsync();

//            // Map matches to DTOs and return results
//            var matchDtos = matches.Select(x => _mapper.Map<MatchDto>(x)).ToList();
//            return Result<List<MatchDto>>.Success(matchDtos);
//        }

//        /// <summary>
//        /// Asynchronously retrieves the list of matches for a specified user.
//        /// </summary>
//        /// <param name="userId">The unique identifier of the user for whom to retrieve matches.</param>
//        /// <returns>
//        /// A task that represents the asynchronous operation, containing a result with a list of match DTOs if successful.
//        /// </returns>
//        public async Task<Result<List<MatchDto>>> GetUserMatchesAsync(Guid userId)
//        {
//            // Retrieve matches for the given user
//            var matches = await _unitOfWork.Matches.GetMatchesForUserAsync(userId);

//            // Map matches to DTOs
//            var dtos = matches.Select(match => _mapper.Map<MatchDto>(match)).ToList();

//            // Return the result
//            return Result<List<MatchDto>>.Success(dtos);
//        }

//        /// <summary>
//        /// Asynchronously retrieves a match by its unique identifier.
//        /// </summary>
//        /// <param name="matchId">The unique identifier of the match.</param>
//        /// <returns>
//        /// A task representing the asynchronous operation, containing a result with the mapped MatchDto if successful, or a failure message if not found.
//        /// </returns>
//        public async Task<Result<MatchDto>> GetMatchByIdAsync(Guid matchId)
//        {
//            // Retrieve match by ID
//            var match = await _unitOfWork.Matches.GetByIdAsync(matchId);

//            // Check if match does not exist
//            if (match == null)
//                return Result<MatchDto>.Failure("Match not found.");

//            // Map match to DTO
//            var matchDto = _mapper.Map<MatchDto>(match);
//            return Result<MatchDto>.Success(matchDto);
//        }

//        /// <summary>
//        /// Updates the status of a match identified by its GUID. This method ensures that the user requesting
//        /// the update is the owner of the lost item related to the match. The status is parsed and updated if valid.
//        /// </summary>
//        /// <param name="matchId">The unique identifier of the match.</param>
//        /// <param name="status">The new status to be set for the match.</param>
//        /// <param name="userId">The unique identifier of the user making the request.</param>
//        /// <returns>
//        /// A <c>Result</c> indicating success if the match status was updated successfully or failure with an appropriate
//        /// message if the match was not found, the user is unauthorized, or the status is invalid.
//        /// </returns>
//        public async Task<Result> UpdateMatchStatusAsync(Guid matchId, string status, Guid userId)
//        {
//            // Retrieve match by ID
//            var match = await _unitOfWork.Matches.GetByIdAsync(matchId);

//            // Check if match does not exist
//            if (match == null)
//                return Result.Failure("Match not found.");

//            // Verify user owns the lost item
//            if (match.LostItem.UserId != userId)
//                return Result.Failure("Unauthorized");

//            // Parse and update status if valid
//            if (Enum.TryParse<MatchStatus>(status, out var matchStatus))
//            {
//                match.Status = matchStatus;
//                match.UpdatedAt = DateTime.UtcNow;

//                // Save changes to the database
//                await _unitOfWork.SaveChangesAsync();
//                return Result.Success("Match status updated");
//            }

//            // Return failure if status is invalid
//            return Result.Failure("Invalid status");
//        }

//        /// <summary>
//        /// Calculates the match score between a found item and a lost item by evaluating their keyword similarity,
//        /// geographic proximity, and date proximity. The score is determined by the sum of contributions from each
//        /// of these factors, which are weighted differently. If none of the factors are applicable, the score is zero.
//        /// </summary>
//        /// <param name="foundAnalysis">The AI analysis result containing keywords for the found item.</param>
//        /// <param name="lostAnalysis">The AI analysis result containing keywords for the lost item.</param>
//        /// <param name="foundItem">The found item with location and date information.</param>
//        /// <param name="lostItem">The lost item with location and date information.</param>
//        /// <returns>
//        /// A decimal value representing the calculated match score. The score reflects the degree of similarity between the
//        /// found and lost items, considering keywords, location, and dates.
//        /// </returns>
//        private decimal CalculateMatchScore(AIAnalysisResult? foundAnalysis, AIAnalysisResult? lostAnalysis,
//            FoundItem foundItem, LostItem lostItem)
//        {
//            decimal score = 0;
//            int factors = 0;

//            // Keyword matching (40%)
//            if (foundAnalysis?.Keywords != null && lostAnalysis?.Keywords != null)
//            {
//                // Calculate common keywords
//                var commonKeyWords = foundAnalysis.Keywords
//                    .Intersect(lostAnalysis.Keywords, StringComparer.OrdinalIgnoreCase).Count();
//                var totalKeywords = Math.Max(foundAnalysis.Keywords.Count, lostAnalysis.Keywords.Count);

//                // Add score for keyword match
//                if (totalKeywords > 0)
//                {
//                    score += (commonKeyWords / (decimal)totalKeywords) * 40;
//                    factors++;
//                }
//            }

//            // Location proximity (30%)
//            if (foundItem.Location.Latitude.HasValue && lostItem.Location.Latitude.HasValue)
//            {
//                // Calculate distance between locations
//                var distance = CalculateDistance(
//                    foundItem.Location.Latitude.Value, foundItem.Location.Longitude!.Value,
//                    lostItem.Location.Latitude.Value, lostItem.Location.Longitude!.Value);

//                // Within 5km = 30 points, reduces linearly
//                var locationScore = Math.Max(0, 30 - (distance / 5 * 30));
//                score += (decimal)locationScore;
//                factors++;
//            }

//            // Date proximity (30%)
//            // Calculate date difference
//            var daysDifference = Math.Abs((foundItem.DateFound - lostItem.DateLost).TotalDays);
//            var dateScore = Math.Max(0, 30 - (daysDifference / 30 * 30));

//            // Add score for date match
//            score += (decimal)dateScore;
//            factors++;

//            // Return final calculated score
//            return factors > 0 ? score : 0;
//        }

//        /// <summary>
//        /// Calculates the distance between two geographical points specified by latitude and longitude using the Haversine formula.
//        /// </summary>
//        /// <param name="lat1">The latitude of the first point in degrees.</param>
//        /// <param name="lon1">The longitude of the first point in degrees.</param>
//        /// <param name="lat2">The latitude of the second point in degrees.</param>
//        /// <param name="lon2">The longitude of the second point in degrees.</param>
//        /// <returns>
//        /// The distance between the two points in kilometers.
//        /// </returns>
//        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
//        {
//            const double R = 6371; // Radius of the Earth in kilometers
//            var dLat = ToRadians(lat2 - lat1);
//            var dLong = ToRadians(lon2 - lon1);
//            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
//                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
//                    Math.Sin(dLong / 2) * Math.Sin(dLong / 2);
//            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
//            return R * c;
//        }

//        /// <summary>
//        /// Converts an angle measured in degrees to an equivalent angle measured in radians.
//        /// </summary>
//        /// <param name="degrees">The angle in degrees.</param>
//        /// <returns>The angle in radians.</returns>
//        private double ToRadians(double degrees) => degrees * Math.PI / 180;
//    }
//}
////The provided C# code defines a service class named `MatchingService`, which is part of the application architecture for a system that deals with matching found items to lost ones. This class implements the `IMatchingService` interface, and its purpose is to facilitate the logic and operations related to identifying potential matches between found and lost items. Let's break down the key components and functionalities of the `MatchingService` class:
////### Dependencies
////1. **`IUnitOfWork`**: This is a common design pattern for managing database transactions and operations in a single cohesive manner. It will typically include repositories for accessing different entities, such as found and lost items, as well as their matches.
////2. **`IEmailService`**: This service is used to send email notifications. In this context, it is used to notify users when a match is found for their lost item.
////3. **`IMapper`**: Part of the AutoMapper library, this is used for mapping between different object models, such as entities and Data Transfer Objects (DTOs).
////### Constants and Fields
////- **`MATCH_THRESHOLD`**: A constant defining the minimum match score required for an item to be considered a potential match. In this case, the threshold is set at 60.0.
////### Key Methods
////1. **`FindMatchesForFoundItemAsync`**: This async method takes the ID of a found item and identifies potential matches by comparing it with lost items of the same category. If a match's score meets or exceeds the threshold, it's acknowledged, a match entry is saved, and a notification email is sent to the owner of the lost item.
////   - **AI Analysis**: The method utilizes AI analysis results, likely containing keywords or attributes, to help determine the similarity between found and lost items.
////   - **Match Score Calculation**: Utilizes a private method `CalculateMatchScore` to determine how well a found item matches a lost item based on keyword similarity, geographic proximity, and date proximity.
////2. **`GetUserMatchesAsync`**: Retrieves a list of matches for a specific user. This allows users to see all current potential matches for items they have reported as lost.
////3. **`GetMatchByIdAsync`**: Fetches a specific match by its ID, useful for checking the details of a particular match.
////4. **`UpdateMatchStatusAsync`**: Allows a user to update the status of a match. It ensures that only the user who owns the lost item can change the match status.
////### Matching Logic
////- **`CalculateMatchScore`**: This method computes a match score by evaluating:
////  - **Keywords**: Compares keywords from AI analysis of both found and lost items.
////  - **Location**: Calculates proximity of the geographical locations of the found and lost items using the Haversine formula.
////  - **Date**: Assesses the time difference between when the item was lost and when the item was found.
////### Helper Functions
////- **`CalculateDistance`**: Uses the Haversine formula to compute distance between two sets of latitude and longitude coordinates.
////- **`ToRadians`**: Converts degrees to radians, useful for geographic calculations.
////### Overall Architecture
////The `MatchingService` class follows a clean and structured architecture, adhering to principles like Single Responsibility and Separation of Concerns, making it a maintainable and scalable component of the larger application ecosystem. The use of dependency injection facilitates testability and modularity. Overall, the class is an integral part of a system designed to automate and enhance the process of matching found items with their lost counterparts.