using System;
using GoMonke.Core.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace Corona.Entities
{
    /// <summary>
    /// PartitionKey: Corona
    /// RowKey: DocumentNumber
    /// </summary>
    [TableName("Clients")]
    public class Client : TableEntity
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Code { get; set; }
    }
}
