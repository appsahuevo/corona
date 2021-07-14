using Corona.Entities;
using Corona.Entities.Entities;
using GoMonke.Core.Storage;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace coronaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private IServiceProvider _service;
        public GameController(IServiceProvider service)
        {
            _service = service;
        }

        // GET: api/<GameController>
        [HttpGet("GetPrizes")]
        public List<Prize> Get()
        {
            var repo = new Repository<Prize>(_service);
            var prizes = repo.Get(Helper.DefaultAppName).Result.ToList();

            return prizes;
        }

        // Post
        [HttpPost("SaveGame")]
        public IActionResult SaveGame([FromBody] Client client)
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
