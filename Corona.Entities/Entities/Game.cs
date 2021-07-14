using GoMonke.Core.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace Corona.Entities.Entities
{
    /// <summary>
    /// PartitionKey= Corona,ClientId
    /// RowKey= Guid
    /// </summary>
    [TableName("Games")]
    public class Game: TableEntity
    {
        public string ClientId { get; set; }
        public string ClientName { get; set; }
        public string ClientPhoneNumber { get; set; }
        public string ClientEmail { get; set; }
        public string Code { get; set; }
        /// <summary>
        /// Nombre del juego= Ruleta,Concéntrese
        /// </summary>
        public string GameName { get; set; }
        public string PrizeId { get; set; }
        public string PrizeName { get; set; }
        public string PrizeValue { get; set; }

        //-------------Log info-------------------
        /// <summary>
        /// Fecha de creación
        /// </summary>
        public DateTime CreationDate { get; set; }
    }
}
