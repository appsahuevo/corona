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
    public class GameController : ControllerBase
    {
        private IServiceProvider _service;
        public GameController(IServiceProvider service)
        {
            _service = service;
        }

        //// GET: api/<GameController>
        [HttpGet("GetGame/{gameId}")]
        public Game GetGame(string gameId)
        {
            var repoGame = new Repository<Game>(_service);
            var game = repoGame.Get(Helper.DefaultAppName, gameId);

            return game;
        }

        //// GET: api/<GameController>
        [HttpGet("GetPrizeRoulette/{clientId}/{code}")]
        public IActionResult GetPrizeRoulette(string clientId, string code)
        {
            var repo = new Repository<Prize>(_service);
            var repoCode = new Repository<Code>(_service);
            var repoGame = new Repository<Game>(_service);
            var repoClient = new Repository<Client>(_service);
            var codeEntity = repoCode.Get(Helper.DefaultAppName, code);
            var client = repoClient.Get(Helper.DefaultAppName, clientId);

            try
            {
                if (client != null && codeEntity != null && !codeEntity.IsUsed1 && !codeEntity.IsUsed2)
                {
                    var prizeId = codeEntity.PrizeId1.Split("-");
                    var prize1 = repo.Get(prizeId[0], codeEntity.PrizeId1);

                    if (prize1.IsUsed == false)
                    {
                        var game = new Game()
                        {
                            PartitionKey = Helper.DefaultAppName,
                            RowKey = code,
                            ClientId = client.RowKey,
                            ClientEmail = client.Email,
                            ClientName = client.Name,
                            ClientPhoneNumber = client.PhoneNumber,
                            CreationDate = DateTime.Now,
                            GameName = "Ruleta",
                            PrizeId = prize1.RowKey,
                            PrizeName = prize1.Name,
                            PrizeLevel = prize1.Level,
                            PrizeImageUrl = prize1.ImageUrl,
                            PrizeValue = prize1.Value

                        };

                        repoGame.Save(game);
                        game.PartitionKey = client.RowKey;
                        repoGame.Save(game);

                        prize1.IsUsed = true;
                        prize1.UsedDate = game.CreationDate;

                        repo.Save(prize1);

                        codeEntity.IsUsed1 = true;
                        codeEntity.UsedDate = game.CreationDate;

                        repoCode.Save(codeEntity);

                        return Ok(game);
                    }

                    var prizeId2 = codeEntity.PrizeId2.Split("-");
                    var prize2 = repo.Get(prizeId2[0], codeEntity.PrizeId2);

                    if (prize2.IsUsed == false)
                    {
                        var game = new Game()
                        {
                            PartitionKey = Helper.DefaultAppName,
                            RowKey = code,
                            ClientId = client.RowKey,
                            ClientEmail = client.Email,
                            ClientName = client.Name,
                            ClientPhoneNumber = client.PhoneNumber,
                            CreationDate = DateTime.Now,
                            GameName = "Ruleta",
                            PrizeId = prize2.RowKey,
                            PrizeName = prize2.Name,
                            PrizeLevel = prize2.Level,
                            PrizeImageUrl = prize2.ImageUrl,
                            PrizeValue = prize2.Value

                        };

                        repoGame.Save(game);
                        game.PartitionKey = client.RowKey;
                        repoGame.Save(game);

                        prize2.IsUsed = true;
                        prize2.UsedDate = game.CreationDate;

                        repo.Save(prize1);

                        codeEntity.IsUsed2 = true;
                        codeEntity.UsedDate = game.CreationDate;

                        repoCode.Save(codeEntity);

                        return Ok(game);
                    }
                }

            }
            catch (Exception)
            {
            }

            return BadRequest("El codigo ingresado no es valido");
        }

        //// GET: api/<GameController>
        [HttpGet("GetPrizeMemory/{clientId}/{code}")]
        public IActionResult GetPrizeMemory(string clientId, string code)
        {
            var repo = new Repository<Prize>(_service);
            var repoCode = new Repository<Code>(_service);
            var repoGame = new Repository<Game>(_service);
            var repoClient = new Repository<Client>(_service);
            var codeEntity = repoCode.Get(Helper.DefaultAppName, code);
            var client = repoClient.Get(Helper.DefaultAppName, clientId);

            try
            {
                if (client != null && codeEntity != null && !codeEntity.IsUsed1 && !codeEntity.IsUsed2)
                {
                    var prizeId = codeEntity.PrizeId1.Split("-");
                    var prize1 = repo.Get(prizeId[0], codeEntity.PrizeId1);
                    var prizeId2 = codeEntity.PrizeId2.Split("-");
                    var prize2 = repo.Get(prizeId2[0], codeEntity.PrizeId2);

                    if (prize1.IsUsed == false && (prize1.Level == 2 || prize2.IsUsed))
                    {
                        var game = new Game()
                        {
                            PartitionKey = Helper.DefaultAppName,
                            RowKey = code,
                            ClientId = client.RowKey,
                            ClientEmail = client.Email,
                            ClientName = client.Name,
                            ClientPhoneNumber = client.PhoneNumber,
                            CreationDate = DateTime.Now,
                            GameName = "Concéntrese",
                            PrizeId = prize1.RowKey,
                            PrizeName = prize1.Name,
                            PrizeLevel = prize1.Level,
                            PrizeImageUrl = prize1.ImageUrl,
                            PrizeValue = prize1.Value
                        };

                        repoGame.Save(game);
                        game.PartitionKey = client.RowKey;
                        repoGame.Save(game);

                        prize1.IsUsed = true;
                        prize1.UsedDate = game.CreationDate;

                        repo.Save(prize1);

                        codeEntity.IsUsed1 = true;
                        codeEntity.UsedDate = game.CreationDate;

                        repoCode.Save(codeEntity);

                        return Ok(game);
                    }
                    if (prize2.IsUsed == false)
                    {
                        var game = new Game()
                        {
                            PartitionKey = Helper.DefaultAppName,
                            RowKey = code,
                            ClientId = client.RowKey,
                            ClientEmail = client.Email,
                            ClientName = client.Name,
                            ClientPhoneNumber = client.PhoneNumber,
                            CreationDate = DateTime.Now,
                            GameName = "Concéntrese",
                            PrizeId = prize2.RowKey,
                            PrizeName = prize2.Name,
                            PrizeLevel = prize2.Level,
                            PrizeImageUrl = prize2.ImageUrl,
                            PrizeValue = prize2.Value

                        };

                        repoGame.Save(game);
                        game.PartitionKey = client.RowKey;
                        repoGame.Save(game);

                        prize2.IsUsed = true;
                        prize2.UsedDate = game.CreationDate;

                        repo.Save(prize1);

                        codeEntity.IsUsed2 = true;
                        codeEntity.UsedDate = game.CreationDate;

                        repoCode.Save(codeEntity);

                        return Ok(game);
                    }
                }

            }
            catch (Exception)
            {
            }

            return BadRequest("El codigo ingresado no es valido");
        }

        //// GET: api/<GameController>
        [HttpGet("GetPrizeLevel1/{gameId}")]
        public IActionResult GetPrizeLevel1(string gameId)
        {
            var repo = new Repository<Prize>(_service);
            var repoGame = new Repository<Game>(_service);
            var repoCode = new Repository<Code>(_service);

            try
            {
                var game = repoGame.Get(Helper.DefaultAppName, gameId);

                if (game != null)
                {
                    var code = repoCode.Get(Helper.DefaultAppName, game.RowKey);
                    var prizeId = code.PrizeId1.Split("-");
                    var prize1 = repo.Get(prizeId[0], code.PrizeId1);
                    var prizeId2 = code.PrizeId2.Split("-");
                    var prize2 = repo.Get(prizeId2[0], code.PrizeId2);

                    if (code.IsUsed1 && !prize2.IsUsed && prize2.Level == 1)
                    {
                        game.PrizeId = prize2.RowKey;
                        game.PrizeImageUrl = prize2.ImageUrl;
                        game.PrizeLevel = prize2.Level;
                        game.PrizeName = prize2.Name;
                        game.PrizeValue = prize2.Value;

                        repoGame.Save(game);
                        game.PartitionKey = game.ClientId;
                        repoGame.Save(game);

                        prize1.IsUsed = false;
                        prize1.UsedDate = game.CreationDate;
                        prize2.IsUsed = true;
                        prize2.UsedDate = game.CreationDate;

                        repo.Save(prize1);
                        repo.Save(prize2);

                        code.IsUsed1 = false;
                        code.IsUsed2 = true;
                        code.UsedDate = game.CreationDate;

                        repoCode.Save(code);

                        return Ok(game);
                    }
                    else if (code.IsUsed2 && !prize1.IsUsed && prize1.Level == 1)
                    {
                        game.PrizeId = prize1.RowKey;
                        game.PrizeImageUrl = prize1.ImageUrl;
                        game.PrizeLevel = prize1.Level;
                        game.PrizeName = prize1.Name;
                        game.PrizeValue = prize1.Value;

                        repoGame.Save(game);
                        game.PartitionKey = game.ClientId;
                        repoGame.Save(game);

                        prize1.IsUsed = true;
                        prize1.UsedDate = game.CreationDate;
                        prize2.IsUsed = false;
                        prize2.UsedDate = game.CreationDate;

                        repo.Save(prize1);
                        repo.Save(prize2);

                        code.IsUsed1 = true;
                        code.IsUsed2 = false;
                        code.UsedDate = game.CreationDate;

                        repoCode.Save(code);

                        return Ok(game);
                    }
                    else
                    {
                        return Ok(game);
                    }
                }

            }
            catch (Exception)
            {
            }

            return BadRequest("El codigo ingresado no es valido");
        }
    }
}
