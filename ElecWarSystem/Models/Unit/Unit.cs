using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElecWarSystem.Models
{
    [Table("Unit", Schema = "FileShare")]
    public class Unit
    {
        [Key]
        [Display(Name = "ID")]
        public int ID { get; set; }
        public int zoneID { get; set; }
        [ForeignKey("zoneID")]
        public Zone zone { get; set; }
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string UnitName { get; set; }
        public long AllowedStrogeSize { get; set; } = 5368709120;
        public long UsedStrogeSize { get; set; } = 0;
        public int Order { get; set; } = 0;
        public bool AltComExist { get; set; } = true;
        public long? UCID { get; set; }
        [ForeignKey("UCID")]
        public Person UnitCommandor { get; set; }
        public long? UOCHID { get; set; }
        [ForeignKey("UOCHID")]
        public Person UnitOperationsChief { get; set; }
        public List<SmallUnit> SmallUnits { get; set; }
    }
}