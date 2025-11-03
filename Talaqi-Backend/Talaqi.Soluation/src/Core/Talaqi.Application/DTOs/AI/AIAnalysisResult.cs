using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.AI
{
    //The `AIAnalysisResult` class is a data structure designed to hold the results of an AI-driven analysis, possibly involving image processing or similar tasks. It includes several properties intended to capture various aspects of the analysis outcome:
    //1. **Success (bool)**: This property indicates whether the analysis was successful or not. It serves as a basic status flag for the outcome of the operation.
    //2. **ImageFeatures (string?)**: This optional property (indicated by the nullable type `string?`) is likely intended to store a serialized representation of features identified from an image. This could be anything from descriptions of objects detected within the image to color patterns or other attributes recognized by the AI.
    //3. **Keywords (List<string>)**: This property is a list that holds keywords related to the analysis result. These keywords could be derived from the content being analyzed, such as important themes or topics identified within textual data or key elements found in an image. The list is initialized as empty by default, ensuring it is ready to store elements even if no specific initialization logic is provided.
    //4. **AdditionalData (Dictionary<string, object>)**: This dictionary is a flexible structure for storing additional arbitrary data that doesn't neatly fit into the other properties. The key is a string, while the value is an object, allowing for a wide variety of data types to be stored. It's particularly useful for extending the class to include custom attributes that might be specific to certain use cases.
    //5. **Error (string?)**: This optional property is intended to hold error messages in case the analysis fails. It provides more detailed information about what went wrong during the analysis, facilitating debugging or user feedback.
    //The class design allows for the results of AI analyses to be organized and accessed in a structured manner, enabling users to interpret the outcome and make decisions based on both successful results and any errors encountered.
    public class AIAnalysisResult
    {
        // Indicates if the analysis was successful
        public bool Success { get; set; }

        // Stores features extracted from the image as a string
        public string? ImageFeatures { get; set; }

        // A list of keywords extracted from the analysis
        public List<string> Keywords { get; set; } = new();

        // Contains additional data related to the analysis, stored as key-value pairs
        public Dictionary<string, object> AdditionalData { get; set; } = new();

        // Any error message if the analysis failed or encountered issues
        public string? Error { get; set; }
    }
}
