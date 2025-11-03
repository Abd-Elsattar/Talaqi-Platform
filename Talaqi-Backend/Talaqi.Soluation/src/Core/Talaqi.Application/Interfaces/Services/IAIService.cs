using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Application.DTOs.AI;

namespace Talaqi.Application.Interfaces.Services
{
    //The `IAIService` interface is a contract or blueprint for building a service related to artificial intelligence (AI) tasks. This interface defines methods that classes implementing the interface need to provide. Each method in the interface is asynchronous, indicated by the `Task` return type and the `Async` suffix in the method names. They return a `Task<AIAnalysisResult>`, meaning when the task is completed, it will produce an `AIAnalysisResult` object, which presumably contains the results of the analysis.
    //Let's break down each method:
    //1. **AnalyzeImageAsync(string imageUrl)**: This method takes a URL pointing to an image as a string parameter. The purpose of this method is to analyze the content of the image. The specifics of what "analyze" means here would depend on the implementation, but it could involve identifying objects, detecting themes, or interpreting image content.
    //2. **AnalyzeTextAsync(string description)**: This method is designed to perform analysis on a piece of text provided as the `description` string parameter. The analysis could include operations like sentiment analysis, language detection, entity recognition, summarization, or keyword extraction.
    //3. **AnalyzeLocationAsync(string Location)**: This method accepts a string that presumably represents a location. It could involve determining the geocode, finding relevant information about the place, or checking for certain geographic features or data about the location.
    //4. **AnalyzeLostItemAsync(string? imageUrl, string description, string location)**: This method seems targeted towards analyzing information related to a lost item. It considers up to three parameters: an image URL (which is nullable, indicated by the `string?`), a text description, and a location. The method might help in classifying the lost item, suggesting potential places where it might be found, or correlating it with known databases of lost properties.
    //5. **AnalyzeFoundItemAsync(string? imageUrl, string description, string location)**: Similar to `AnalyzeLostItemAsync`, this method deals with an item that has been found. It also takes three parameters, potentially to classify or identify the found item, verify its description with an existing report, or match it with an owner or database of found objects.
    //Overall, this interface suggests a set of AI-driven functionalities that focus on analyzing different types of input data (images, text, locations) possibly in the context of a lost and found application or service. The results from these methods are encapsulated in the `AIAnalysisResult` object, whose structure and capabilities would define what detailed information and insights the application can derive from the analyses.
    public interface IAIService
    {
        // Asynchronously analyzes an image from the provided URL
        Task<AIAnalysisResult> AnalyzeImageAsync(string imageUrl);

        // Asynchronously analyzes a text description
        Task<AIAnalysisResult> AnalyzeTextAsync(string description);

        // Asynchronously analyzes a location detail
        Task<AIAnalysisResult> AnalyzeLocationAsync(string Location);

        // Asynchronously analyzes a lost item using an optional image URL, description, and location
        Task<AIAnalysisResult> AnalyzeLostItemAsync(string? imageUrl, string description, string location);

        // Asynchronously analyzes a found item using an optional image URL, description, and location
        Task<AIAnalysisResult> AnalyzeFoundItemAsync(string? imageUrl, string description, string location);
    }
}
