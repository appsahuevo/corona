using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Corona.Entities;
using GoMonke.Core.Storage;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace coronaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValidateCodeController : ControllerBase
    {
        // GET: /<controller>/
        private IServiceProvider _service;
        public ValidateCodeController(IServiceProvider service)
        {
            _service = service;
        }

        // Post
        [HttpPost]
        public IActionResult Post([FromBody]Client client)
        {
            var repoCode = new Repository<Code>(_service);
            var repoClient = new Repository<Client>(_service);

            var resultCode = repoCode.Get(Helper.DefaultAppName, client.Code);

            if (resultCode != null && !resultCode.IsUsed)
            {
                client.PartitionKey = Helper.DefaultAppName;
                client.RowKey = Guid.NewGuid().ToString();

                repoClient.Save(client);

                resultCode.IsUsed = true;
                repoCode.Save(resultCode);

                return Ok("");
            }
            else
            {
                return BadRequest("El codigo ingresado no es valido");
            }
        }
    }
}
