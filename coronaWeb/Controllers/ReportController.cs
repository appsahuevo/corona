using Corona.Entities;
using Corona.Entities.Entities;
using GoMonke.Core.Storage;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace coronaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private IServiceProvider _service;
        public ReportController(IServiceProvider service)
        {
            _service = service;
        }        

        //// GET: api/<GameController>
        [HttpGet("Login/{user}/{pwd}")]
        public bool Login(string user, string pwd)
        {
            if (user.Equals("Admin") && pwd.Equals("Corona123*"))
            {
                return true;
            }

            return false;
        }

        //// GET: api/<GameController>
        [HttpGet("GetReport")]
        public List<Game> GetReport()
        {            
            var repoGame = new Repository<Game>(_service);

            var result = repoGame.Get(Helper.DefaultAppName).Result;

            return result;
        }     
    }
}
