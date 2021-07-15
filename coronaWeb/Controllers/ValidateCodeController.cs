using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Corona.Entities;
using Corona.Entities.Business;
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

        // GET: api/<GameController>
        [HttpGet("GetClient/{documentNumber}")]
        public Client GetClient(string documentNumber)
        {
            var repo = new Repository<Client>(_service);
            var client = repo.Get(Helper.DefaultAppName, documentNumber);

            return client;
        }

        // Post
        [HttpPost("SaveClient")]
        public IActionResult Post([FromBody] ClientWrapper wr)
        {
            var repoCode = new Repository<Code>(_service);
            var repoClient = new Repository<Client>(_service);
            var resultCode = repoCode.Get(Helper.DefaultAppName, wr.Code);
            var client = wr.Client;

            if (resultCode != null && !resultCode.IsUsed1 && !resultCode.IsUsed2 && client != null)
            {
                client.PartitionKey = Helper.DefaultAppName;

                repoClient.Save(client);
                wr.IsUsed = false;

                return Ok(wr);
            }
            else if (resultCode != null && (resultCode.IsUsed1 || resultCode.IsUsed2) && client != null)
            {
                wr.IsUsed = true;

                return Ok(wr);
            }
            else
            {
                return BadRequest("El codigo ingresado no es valido");
            }
        }
    }
}
