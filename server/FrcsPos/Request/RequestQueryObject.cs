using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class RequestQueryObject
    {

        private const int MaxPageSize = 100;
        private int _pageSize = 10;
        public int PageNumber { get; set; } = 1;
        public bool? IsAvailable { get; set; }
        public bool? IsDeleted { get; set; } = false;
        public ESortBy SortBy { get; set; } = ESortBy.ASC;

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