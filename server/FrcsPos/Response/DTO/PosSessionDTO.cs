using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class PosSessionDTO : BaseDTO
    {
        public int PosTerminalId { get; set; }
        public PosTerminalDTO PosTerminal { get; set; } = default!;

        [Required] public string ConnectionUUID { get; set; } = default!;
        public DateTime ConnectionTimeOut { get; set; } = default!;
        public List<ProductDTO> Products { get; set; } = [];
        public List<SaleDTO> Sales { get; set; } = [];

        public UserDTO PosUser { get; set; } = default!;
        public string PosUserId { get; set; } = default!;
        public bool IsActive { get; set; } = default!;

    }

    public class PosSessionWithProducts
    {
        public PosSessionDTO PosSession { get; set; } = default!;
        public List<ProductDTO> Products { get; set; } = default!;


    }

}