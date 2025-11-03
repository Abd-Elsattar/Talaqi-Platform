using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.Common
{
    
    public class PaginatedList<T>
    {
        // List of items of generic type T that are to be paginated
        public List<T> Items { get; set; }

        // Current page number
        public int PageNumber { get; set; }

        // Number of items per page
        public int PageSize { get; set; }

        // Total number of items across all pages
        public int TotalCount { get; set; }

        // Calculate total number of pages required for pagination
        // Math.Ceiling is used to round up to the nearest whole number
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);

        // Check if there is a previous page
        public bool HasPreviousPage => PageNumber > 1;

        // Check if there is a next page
        public bool HasNextPage => PageNumber < TotalPages;

        // Constructor to initialize the paginated list with items, total count of items, current page number, and page size
        public PaginatedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            Items = items;           // Assign the list of items
            TotalCount = count;      // Set the total count of items
            PageNumber = pageNumber; // Set the current page number
            PageSize = pageSize;     // Set the number of items per page
        }
    }
}
