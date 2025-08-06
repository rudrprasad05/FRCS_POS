using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Models
{
    
    [Index(nameof(UUID), IsUnique = true)]
    public class BaseModel
    {
        [Key][Required] public int Id { get; set; }
        [Required] public string UUID { get; set; } = Guid.NewGuid().ToString();
        [Required] public DateTime CreatedOn { get; set; } = DateTime.Now;
        [Required] public DateTime UpdatedOn { get; set; } = DateTime.Now;
        [Required] public bool IsDeleted { get; set; } = false;
    }
}