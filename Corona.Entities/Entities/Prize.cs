using GoMonke.Core.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace Corona.Entities.Entities
{
    /// <summary>
    /// PartitionKey= Corona
    /// RowKey= Consecutivo
    /// </summary>
    [TableName("Prizes")]
    public class Prize: TableEntity
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        /// <summary>
        /// Cantidad inicial
        /// </summary>
        public int Quantity { get; set; }
        /// <summary>
        /// Cantidad disponible
        /// </summary>
        public int Available { get; set; }
        /// <summary>
        /// Nivel de premio 1 -> Ganador, 2 -> Premio consolación
        /// </summary>
        public int Level { get; set; }
        public double Value { get; set; }
        public bool IsUsed { get; set; }
        public DateTime? UsedDate { get; set; }

    }
}
