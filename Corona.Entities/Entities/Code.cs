using System;
using GoMonke.Core.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace Corona.Entities
{
    /// <summary>
    /// PartitionKey: Corona
    /// RowKey: Code (alfanumerico aleatorio 6 caracteres)
    /// </summary>
    [TableName("Codes")]
    public class Code : TableEntity
    {
        public string PrizeId1 { get; set; }
        public string PrizeId2 { get; set; }
        public string PrizeName1 { get; set; }
        public string PrizeName2 { get; set; }
        public bool IsUsed1 { get; set; }
        public bool IsUsed2 { get; set; }
        public int LevelPrize1 { get; set; }
        public int LevelPrize2 { get; set; }
        public double PrizeValue1 { get; set; }
        public double PrizeValue2 { get; set; }
        //-------------Log info-------------------
        /// <summary>
        /// Fecha de creación
        /// </summary>
        public DateTime? UsedDate { get; set; }
    }
}
