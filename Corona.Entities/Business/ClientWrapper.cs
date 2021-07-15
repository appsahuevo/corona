using System;
using System.Collections.Generic;
using System.Text;

namespace Corona.Entities.Business
{
   public class ClientWrapper
    {
        public string Code { get; set; }
        public bool IsUsed { get; set; }
        public Client Client { get; set; }
    }
}
