using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class RequestQueryObject
    {

        public RequestQueryObject()
        {

        }

        private const int MaxPageSize = 100;
        private int _pageSize = 10;
        public int PageNumber { get; set; } = 1;
        public bool? IsAvailable { get; set; }
        public string? CompanyName { get; set; } = null;
        public bool? IsDeleted { get; set; } = null;
        public ESortBy? SortBy { get; set; } = null;
        public string? Role { get; set; } = null;
        public string? UUID { get; set; } = null;
        public string? Search { get; set; } = string.Empty;



        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }

    public enum ESortBy
    {
        ASC, DSC
    }
}