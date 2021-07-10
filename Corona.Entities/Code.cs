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
        public bool IsUsed { get; set; }
    }
}
